package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"time"

	a "testsuites/annotations"
	c "testsuites/collector"
	ex "testsuites/extractor"
)

type FnLink struct {
	Name      string
	Links     []string
	Behaviors []a.BehaviorType
}

func main() {

	config := NewConfig()

	// for origin mode, pull or clone remote origin, for local just ignore and continue
	if config.Repo.Mode == "origin" {
		for i, repo := range config.Repo.Name {
			if _, err := os.Stat(fmt.Sprintf("%s/%s", config.Repo.Destination, repo)); os.IsNotExist(err) {
				_ = os.Mkdir(config.Repo.Destination, 7660)
				_, _, err := Shell(fmt.Sprintf("git clone %s %s", config.Repo.Origin[i], repo), config.Repo.Destination)
				if err != nil {
					fmt.Printf("error: %s", err.Error())
				}
			} else {
				Shell("git pull", config.Repo.Destination)
			}
		}
	}

	files, err := c.GetTestFiles(config.Repo.Destination)
	if err != nil {
		fmt.Println(err)
		return
	}

	fileFunctions := make(map[c.FileID][]c.Function)

	allFiles := make(map[c.FileID]c.TestFile)
	//var allScenarios []ex.FileData

	ctx := context.Background()

	for i, file := range files {

		fileID := c.CreateFileID(file.Path, file.File)

		fileData, hasNoBehaviors, err := ex.ExtractInfo(file, ctx, fileID)
		if err != nil {
			fmt.Println(err)
			continue
		}

		if !hasNoBehaviors {
			continue
		}

		allFiles[fileID] = file

		if fileData.Metadata != nil {
			files[i].Package = fileData.Metadata.Package
			files[i].TestType = fileData.Metadata.TestType
			files[i].Ignore = fileData.Metadata.Ignore
			files[i].Functions = fileData.Functions
		}

		fileFunctions[fileID] = fileData.Functions
	}

	linkedFiles := linkFiles(fileFunctions)

	files = convertToTestFile(linkedFiles, allFiles)

	Save(files, config.OutputMode, config.OutputDir)
}

func linkFiles(fns map[c.FileID][]c.Function) map[c.FileID][]c.Function {

	functions := make(map[string]c.Function)

	flist := convertFileFunctionsToList(fns)

	// map all functions to key(name)-value(function) for fast access later
	for _, fun := range flist {
		if fun.IsTesting {
			functions[fun.Name] = fun
		}
	}

	var funcStack []FnLink

	for _, fun := range flist {
		if fun.IsTesting {
			if len(funcStack) == 0 {
				funcStack = append(funcStack, FnLink{
					Name:      fun.Name,
					Behaviors: fun.Behaviors,
				})
			}

			for _, cexpr := range fun.CallExpressions {
				fnLookup(cexpr, functions, &funcStack)
			}
		}
	}

	return nil
}

func fnLookup(callExpr string, functions map[string]c.Function, result *[]FnLink) {
	// if the function exists in lookup table
	if callExpr == functions[callExpr].Name {
		// take its value
		val := functions[callExpr]
		// link new found function to previous one in stack
		(*result)[len(*result)-1].Links = append((*result)[len(*result)-1].Links, val.Name)
		// push new found function on to the stack
		*result = append(*result, FnLink{
			Name:      val.Name,
			Behaviors: val.Behaviors,
		})

		// use recursion to try and find another link
		for _, cexpr := range val.CallExpressions {
			fnLookup(cexpr, functions, result)
		}
	} else {
		// return if nothing is found
		return
	}

}

func convertFileFunctionsToList(fns map[c.FileID][]c.Function) (f []c.Function) {
	for _, mfunc := range fns {
		f = append(f, mfunc...)
	}
	return f
}

func convertToTestFile(finishedFiles map[c.FileID][]c.Function, allFiles map[c.FileID]c.TestFile) (result []c.TestFile) {
	for id := range finishedFiles {
		result = append(result, *id.ToFile(allFiles))
	}
	return nil
}

func merge(ms ...map[c.FileID][]c.Function) map[c.FileID][]c.Function {
	res := map[c.FileID][]c.Function{}
	for _, m := range ms {
		for k, v := range m {
			res[k] = append(res[k], v...)
		}
	}
	return res
}

func Save(files []c.TestFile, mode OutputMode, outputDir string) {

	content, err := json.Marshal(files)
	if err != nil {
		return
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
		fmt.Print(string(content))
	default:
		fmt.Print(string(content))
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
