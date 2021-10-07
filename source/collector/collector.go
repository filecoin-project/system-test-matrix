package collector

import (
	"os"
	"path/filepath"
	"strings"
)

type TestFile struct {
	File         string     `json:"file"`
	Path         string     `json:"path"`
	Project      string     `json:"project"`
	ParentFolder string     `json:"parent_folder"`
	Functions    []Function `json:"functions"`
}

type Function struct {
	Name      string     `json:"function"`
	Scenarios []Scenario `json:"scenarios"`
}

type Scenario struct {
	Id   string `json:"scenario_id"`
	Name string `json:"scenario_name"`
}

func GetTestFiles(root string) (err error, files []TestFile) {
	err, fileArray := listTestFiles(root)
	if err != nil {
		return err, nil
	}

	if len(fileArray) == 0 {
		return nil, nil
	}

	for _, file := range fileArray {
		testFile := NewTestFile(file)
		files = append(files, testFile)
	}

	return nil, files
}

func listTestFiles(root string) (err error, files []string) {
	err = filepath.Walk(root,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if strings.Contains(path, "_test.go") {
				files = append(files, path)
			}

			return nil
		})

	if err != nil {
		return err, nil
	}

	if len(files) != 0 {
		return nil, files
	}

	return nil, nil
}

func NewTestFile(path string) TestFile {
	parts := strings.Split(path, "/")

	return TestFile{
		File:         parts[len(parts)-1],
		Path:         path,
		Project:      parts[1],
		ParentFolder: parts[len(parts)-2],
	}
}
