package main

/*
	TODO: Need to know when the function starts and ends so we know if behevior is inside the function body
	TODO: Above function and on top of the source file should be flag for ignore and we should support that
	TODO: Header support
	TODO: Detect language and pass it to parser
*/

import (
	"context"
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
	files, err := c.GetTestFiles("_modules/")
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
