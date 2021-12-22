package collector

import (
	"os"
	"path/filepath"
	"strings"

	a "testsuites/annotations"
)

type TestFile struct {
	ID           FileID
	File         string     `json:"file"`
	Path         string     `json:"path"`
	Project      string     `json:"repository"`
	ParentFolder string     `json:"parent_folder"`
	Package      string     `json:"package"`
	TestType     string     `json:"test_type"`
	Ignore       bool       `json:"ignore"`
	Functions    []Function `json:"scenarios"`
}

type Function struct {
	Name            string `json:"function"`
	CallExpressions []string
	Behaviors       []a.BehaviorType
	IsTesting       bool
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
