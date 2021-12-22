package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"time"

	c "testsuites/collector"
	ex "testsuites/extractor"
)

func main() {

	config := NewConfig()

	allFiles := []c.TestFile{}

	for _, path := range config.Paths {
		files, err := c.GetTestFiles(path)
		if err != nil {
			fmt.Println(err)
			return
		}

		ctx := context.Background()

		for i, file := range files {
			scenarios, meta, err := ex.ExtractInfo(file, ctx)
			if err != nil {
				fmt.Println(err)
				continue
			}

			files[i].Package = meta.Package
			files[i].TestType = meta.TestType
			files[i].Ignore = meta.Ignore
			files[i].Scenarios = scenarios
		}

		allFiles = append(allFiles, files...)
	}

	Save(allFiles, config.OutputMode, config.OutputDir, config.IndentJSON)
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
