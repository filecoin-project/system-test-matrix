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

	finishedFiles := make(map[c.FileID][]c.Scenario)
	incompleteFiles := make(map[c.FileID][]c.Scenario)

	allFiles := make(map[c.FileID]c.TestFile)

	ctx := context.Background()

	for i, file := range files {

		fileID := c.CreateFileID(file.Path, file.File)

		allFiles[fileID] = file

		fileData, isCompleted, err := ex.ExtractInfo(file, ctx)
		if err != nil {
			fmt.Println(err)
			continue
		}

		if !isCompleted {
			incompleteFiles[fileID] = fileData.Scenarios
			continue
		}

		if fileData.Metadata != nil {
			files[i].Package = fileData.Metadata.Package
			files[i].TestType = fileData.Metadata.TestType
			files[i].Ignore = fileData.Metadata.Ignore
			files[i].Scenarios = fileData.Scenarios
		}

		finishedFiles[fileID] = file.Scenarios
	}

	complete := trySolveIncomplete(incompleteFiles)
	if complete != nil {
		merge(finishedFiles, complete)
	}

	files = convertToTestFile(finishedFiles, allFiles)

	Save(files, config.OutputMode, config.OutputDir)
}

func trySolveIncomplete(map[c.FileID][]c.Scenario) map[c.FileID][]c.Scenario {

	return nil
}

func convertToTestFile(finishedFiles map[c.FileID][]c.Scenario, allFiles map[c.FileID]c.TestFile) (result []c.TestFile) {
	for id, _ := range finishedFiles {
		result = append(result, *id.ToFile(allFiles))
	}
	return nil
}

func merge(ms ...map[c.FileID][]c.Scenario) map[c.FileID][]c.Scenario {
	res := map[c.FileID][]c.Scenario{}
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
