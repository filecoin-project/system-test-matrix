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

type File struct {
	ID           FileID `json:"-"`
	File         string `json:"file"`
	Path         string `json:"path"`
	Project      string `json:"repository"`
	ParentFolder string `json:"parent_folder"`
	Package      string `json:"package"`
}
type TestFile struct {
	File
	TestType  string     `json:"test_type"`
	Ignore    bool       `json:"ignore"`
	Functions []Function `json:"scenarios"`
}

type SourceFile struct {
	File
	Ignore  bool `json:"ignore"`
	Methods []Method
}

type Function struct {
	FileID          FileID   `json:"-"`
	Name            string   `json:"function"`
	CallExpressions []string `json:"-"`
	Behaviors       []a.BehaviorType
	IsTesting       bool `json:"-"`
}

type Method struct {
	FileID FileID `json:"-"`
	Name   string `json:"method"`
}
type FunctionAnnotation struct {
	ID           int    `yaml:"id" json:"-"`
	Name         string `yaml:"name"`
	InputParams  string `yaml:"inputParams" json:"-"`
	ReturnValues string `yaml:"returnValues" json:"-"`
	Description  string `yaml:"description" json:"-"`
	Public       bool   `json:"-"`
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
		testFile := NewTestFile(file)
		files = append(files, testFile)
	}

	return files, nil
}

func GetSourceFiles(root string, ignore []string) (system string, files []SourceFile, err error) {
	system, fs, err := ListGoFilesInFolder(root, ignore)
	if err != nil {
		return "", nil, err
	}

	if len(fs) == 0 {
		return "", nil, nil
	}

	for _, file := range fs {
		srcFiles := NewSourceFile(file)
		files = append(files, srcFiles)
	}

	return system, files, nil
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

// GenerateMethodDescription generates description based on inputParams, returnParams
func GenerateMethodDescription(f FunctionAnnotation) string {
	var dsc string
	if f.Description == "" {
		dsc = "Function description not set."
		if (f.InputParams != "" && f.InputParams != "()") && f.ReturnValues != "" {
			dsc = fmt.Sprintf(`Given a %s, returns %s`, f.InputParams, f.ReturnValues)
		} else if (f.InputParams == "" || f.InputParams == "()") && f.ReturnValues != "" {
			dsc = fmt.Sprintf(`Returns %s`, f.ReturnValues)
		}
	}

	return dsc
}
