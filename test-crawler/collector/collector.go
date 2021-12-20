package collector

import (
	"os"
	"path/filepath"
	"strings"

	a "testsuites/annotations"
)

type TestFile struct {
	File         string     `json:"file"`
	Path         string     `json:"path"`
	Project      string     `json:"repository"`
	ParentFolder string     `json:"parent_folder"`
	Package      string     `json:"package"`
	TestType     string     `json:"test_type"`
	Ignore       bool       `json:"ignore"`
	Scenarios    []Scenario `json:"scenarios"`
}

type Scenario struct {
	Function  string `json:"function"`
	Behaviors []a.BehaviorType
}

func GetTestFiles(root string) (files []TestFile, err error) {
	fileArray, err := listTestFiles(root)
	if err != nil {
		return nil, err
	}

	if len(fileArray) == 0 {
		return nil, nil
	}

	for _, file := range fileArray {
		testFile := NewFile(file)
		files = append(files, testFile)
	}

	return files, nil
}

func listTestFiles(root string) (files []string, err error) {
	err = filepath.Walk(root,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if strings.Contains(path, ".go") {
				files = append(files, path)
			}

			return nil
		})

	if err != nil {
		return nil, err
	}

	if len(files) != 0 {
		return files, nil
	}

	return nil, nil
}

func NewFile(path string) TestFile {
	parts := strings.Split(path, "/")

	return TestFile{
		File:         parts[len(parts)-1],
		Path:         path,
		Project:      parts[1],
		ParentFolder: parts[len(parts)-2],
	}
}
