package collector

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"unicode"

	a "testsuites/annotations"
)

type TestFile struct {
	ID           FileID     `json:"-"`
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
	FileID          FileID   `json:"-"`
	Name            string   `json:"function"`
	CallExpressions []string `json:"-"`
	Behaviors       []a.BehaviorType
	IsTesting       bool `json:"-"`
}

type FunctionAnnotation struct {
	ID           int    `yaml:"id"`
	Name         string `yaml:"name"`
	InputParams  string `yaml:"inputParams"`
	ReturnValues string `yaml:"returnValues"`
	Description  string `yaml:"description"`
	Public       bool
}

type SystemMethods struct {
	System  string               `yaml:"system"`
	Methods []FunctionAnnotation `yaml:"methods"`
}

func GetTestFiles(root string, ignore []string) (files []TestFile, err error) {
	fileArray, err := listTestFiles(root, ignore)
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

func listTestFiles(root string, ignore []string) (files []string, err error) {
	err = filepath.Walk(root,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			// don't walk if current directory is in config.ignore array
			if info.IsDir() {
				dirname := info.Name()
				for _, ignoreName := range ignore {
					if ignoreName == dirname {
						return filepath.SkipDir
					}
				}
			}

			if strings.HasSuffix(path, ".go") {
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

// listGoFilesInFolder returns list of all .go files, excluding _test.go
// Root folder will represent a system for which the methods will be crawled.
func ListGoFilesInFolder(root string, ignore []string) (system string, files []string, err error) {
	err = filepath.Walk(root,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			// If it's directory, get the name of system.
			if root == path && info.IsDir() {
				system = info.Name()
			}

			if strings.HasSuffix(path, ".go") && !strings.Contains(path, "_test") {
				files = append(files, path)
			}

			return nil
		})

	if err != nil {
		return "", nil, err
	}

	if len(files) != 0 {
		return system, files, nil
	}

	return "", nil, nil
}

// GenerateMethodName generates name adding underscore and usecase index
// ex: name: ListenProofRequest -> LISTEN_PROOF_REQUEST_001
func GenerateMethodName(funcName string) string {
	usecase := "001" // in the future it will be autoincremented depending how many return cases we have.
	buf := &bytes.Buffer{}
	for i, rune := range funcName {
		if unicode.IsUpper(rune) && i > 0 {
			buf.WriteRune('_')
		}
		buf.WriteRune(rune)
	}

	return fmt.Sprintf("%s_%s", strings.ToUpper(buf.String()), usecase)
}

// GenerateMethodDescription generates description based on comment.
func GenerateMethodDescription(f FunctionAnnotation) string {
	if f.Description == "" {
		return "Function description not set."
	}
	return f.Description
}
