package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
	"time"

	a "testsuites/annotations"
	c "testsuites/collector"
	ex "testsuites/extractor"

	y "gopkg.in/yaml.v2"
)

type FnLink struct {
	FileID    c.FileID
	Name      string
	Links     []string
	Behaviors []a.BehaviorType
}

func main() {

	config := NewConfig()

	var crawl string
	flag.StringVar(&crawl, "crawl", "behavior", "what should this crawler do? -crawl=src (source files), -crawl=behavior (test files)")
	flag.Parse()

	if crawl == "behavior" {
		crawlRepoBehaviorsAndSaveToJSON(config)
	} else if crawl == "src" {
		if err := crawlRepoSourceCodeAndSaveToYaml(config); err != nil {
			fmt.Println(err.Error())
		}
	}
}

func crawlRepoBehaviorsAndSaveToJSON(config Config) {
	allFiles := make(map[c.FileID]*c.TestFile)
	var fileFunctions []c.Function

	for _, path := range config.TestCrawlerPaths {
		files, err := c.GetTestFiles(path, config.TestCrawlerIgnore)
		if err != nil {
			fmt.Println(err)
			return
		}

		ctx := context.Background()

		for i := 0; i < len(files); i++ {

			fileID := c.CreateFileID(files[i].Path, files[i].File)

			fileData, hasNoBehaviors, err := ex.ExtractInfo(files[i], ctx, fileID)
			if err != nil {
				fmt.Println(err)
				continue
			}

			if hasNoBehaviors {
				continue
			}

			if fileData.Metadata != nil {
				files[i].Package = fileData.Metadata.Package
				files[i].TestType = fileData.Metadata.TestType
				files[i].Ignore = fileData.Metadata.Ignore
			}

			allFiles[fileID] = &files[i]

			fileFunctions = append(fileFunctions, fileData.Functions...)
		}
	}

	linkedFns := linkFiles(fileFunctions)

	convertToTestFile(linkedFns, allFiles)

	result := filterFilesWhereChildIsRoot(allFiles)

	Save(result, config.TestCrawlerOutputMode, config.TestCrawlerOutputDir, config.TestCrawlerIndentJSON)
}

func crawlRepoSourceCodeAndSaveToYaml(config Config) error {
	ctx := context.Background()
	for _, path := range config.BehaviorGenPaths {
		systemMethods, err := crawlFolderForSystemMethods(path)
		if err != nil {
			return err
		}

		if err := makeYAMLFromSystemMethods(ctx, config, *systemMethods); err != nil {
			return fmt.Errorf("error %w saving to yaml for system %s", err, systemMethods.System)
		}
	}

	return nil
}

// crawlSingleFileForMethods accepts path of single go file,
// and prints extracted methods out of it.
func crawlSingleFileForFunctions(ctx context.Context, path string) ([]c.FunctionAnnotation, error) {
	fns, err := ex.GetExportedFunctions(ctx, path)
	if err != nil {
		return nil, fmt.Errorf("error extracting public methods from file: %w", err)
	}

	return fns, nil
}

// crawlFolderForSystemMethods accepts folder, which represents a system that will be crawled for
// all of his methods.
// ex: "../repo-to-crawl/venus-gateway/proofevent"
func crawlFolderForSystemMethods(system string) (*c.SystemMethods, error) {
	system, files, err := c.ListGoFilesInFolder(system, nil)
	if err != nil {
		return nil, err
	}

	systemFunctions := c.SystemMethods{
		System:  system,
		Methods: make([]c.FunctionAnnotation, 0),
	}

	ctx := context.Background()
	for _, file := range files {
		fns, err := crawlSingleFileForFunctions(ctx, file)
		if err != nil {
			return nil, fmt.Errorf("can not crawl file: %s, err: %w", file, err)
		}
		systemFunctions.Methods = append(systemFunctions.Methods, fns...)
	}

	return &systemFunctions, nil
}

// makeYAMLFromSystemMethods will make yaml file from public methods.
func makeYAMLFromSystemMethods(ctx context.Context, config Config, systemMethods c.SystemMethods) error {

	if _, err := os.Stat(config.BehaviorGenOutputDir); errors.Is(err, os.ErrNotExist) {
		err2 := os.Mkdir(config.BehaviorGenOutputDir, os.ModePerm)
		if err2 != nil {
			return fmt.Errorf("error create dir: %w", err)
		}
	}

	yamlData, err := y.Marshal(&systemMethods)
	if err != nil {
		return fmt.Errorf("error marhaling: %w", err)
	}

	filename := fmt.Sprintf("%s/%s.yaml", config.BehaviorGenOutputDir, systemMethods.System)
	file, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("error create file: %w", err)
	}
	defer file.Close()
	fmt.Println("File generated: ", filename)

	err = ioutil.WriteFile(filename, yamlData, 0644)
	if err != nil {
		return fmt.Errorf("error write to file: %w", err)
	}

	return nil
}

func linkFiles(flist []c.Function) (links [][]FnLink) {

	functions := make(map[string]c.Function)

	// map all functions to key(name)-value(function) for fast access later
	for _, fun := range flist {
		if fun.IsTesting {
			functions[fun.Name] = fun
		}
	}

	for _, fun := range flist {
		if fun.IsTesting {
			var funcStack []FnLink
			if len(funcStack) == 0 {
				funcStack = append(funcStack, FnLink{
					FileID:    fun.FileID,
					Name:      fun.Name,
					Behaviors: fun.Behaviors,
				})
			}

			for _, cexpr := range fun.CallExpressions {
				fnLookup(cexpr, functions, funcStack)
			}

			links = append(links, funcStack)

			funcStack = nil
		}
	}

	return links
}

func fnLookup(callExpr string, functions map[string]c.Function, result []FnLink) {
	// if the function exists in lookup table
	if callExpr == functions[callExpr].Name {
		val := functions[callExpr]
		// link new found function to previous one in stack
		result[len(result)-1].Links = append(result[len(result)-1].Links, val.Name)
		// push new found function on to the stack
		result = append(result, FnLink{
			FileID:    val.FileID,
			Name:      val.Name,
			Behaviors: val.Behaviors,
		})

		// use recursion to try and find another link
		for _, cexpr := range val.CallExpressions {
			fnLookup(cexpr, functions, result)
		}
	} else {
		return
	}

}

func convertToTestFile(linkedFiles [][]FnLink, allFiles map[c.FileID]*c.TestFile) {

	for _, lf := range linkedFiles {
		if strings.HasPrefix(lf[0].Name, "Test") {
			for i := 1; i < len(lf); i++ {
				lf[0].Behaviors = append(lf[0].Behaviors, lf[i].Behaviors...)
			}

			file := lf[0].FileID.ToFile(allFiles)
			if file != nil {
				file.Functions = append(file.Functions, c.Function{
					FileID:          lf[0].FileID,
					Name:            lf[0].Name,
					CallExpressions: nil,
					Behaviors:       lf[0].Behaviors,
					IsTesting:       true,
				})
			}
		}
	}
}

func filterFilesWhereChildIsRoot(allFiles map[c.FileID]*c.TestFile) []c.TestFile {

	var filteredFiles []c.TestFile
	var filteredFns []c.Function

	for _, file := range allFiles {
		containsRoot := false
		for _, test := range file.Functions {
			if strings.HasPrefix(test.Name, "Test") {
				containsRoot = true
				filteredFns = append(filteredFns, test)
			}
		}
		file.Functions = filteredFns

		if containsRoot {
			filteredFiles = append(filteredFiles, *file)
		}
		filteredFns = nil
	}

	return filteredFiles
}

func Save(files []c.TestFile, mode OutputMode, outputDir string, indentJSON bool) {
	var content []byte
	var err error
	if indentJSON {
		content, err = json.MarshalIndent(files, "", " ")
	} else {
		content, err = json.Marshal(files)
	}
	if err != nil {
		panic(err)
	}

	switch mode {
	case MODE_FILE:
		now := time.Now()
		timestamp := now.Unix()

		if _, err := os.Stat(outputDir); os.IsNotExist(err) {
			er := os.Mkdir(outputDir, 0755)
			if er != nil {
				return
			}
		}

		filename := fmt.Sprintf("%s/output_%d.json", outputDir, timestamp)

		file, err := os.Create(filename)
		if err != nil {
			return
		}
		defer file.Close()

		file.Write(content)
	case MODE_STDOUT:
		fmt.Println(string(content))
	default:
		fmt.Println(string(content))
	}

}

func Shell(command string, destination string) (string, string, error) {
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd := exec.Command("bash", "-c", command)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	cmd.Dir = fmt.Sprintf("./%s", destination)
	err := cmd.Run()
	return stdout.String(), stderr.String(), err
}
