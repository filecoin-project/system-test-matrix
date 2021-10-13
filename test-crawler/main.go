package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	c "testsuites/collector"
	ex "testsuites/extractor"
)

const OUTPUT_FOLDER = "outputs"

func main() {
	//
	err, files := c.GetTestFiles("_modules/")
	if err != nil {
		fmt.Println(err)
		return
	}

	for i, file := range files {
		functions, meta, err := ex.ExtractScenarios(file)
		if err != nil {
			fmt.Println(err)
			continue
		}

		files[i].Package = meta.Package
		files[i].TestType = meta.TestType
		files[i].Ignore = meta.Ignore
		files[i].Functions = functions
	}

	SaveToFile(files)
}

func SaveToFile(files []c.TestFile) {
	now := time.Now()
	timestamp := now.Unix()

	filename := fmt.Sprintf("%s/output_%d.json", OUTPUT_FOLDER, timestamp)

	file, err := os.Create(filename)
	if err != nil {
		return
	}
	defer file.Close()

	content, err := json.Marshal(files)
	if err != nil {
		return
	}

	file.Write(content)
}
