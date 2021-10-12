package extractor

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"io/ioutil"
	"os"
	"strings"

	c "testsuites/collector"
)

type Function struct {
	Name      string
	Scenarios []c.Scenario
}

func ExtractScenarios(file c.TestFile) (err error, functions []c.Function) {
	err, content := getFileContent(file.Path)
	if err != nil {
		return err, nil
	}

	funcData := getFunctions(content, file.Path)
	for _, s := range funcData {
		functions = append(functions, c.Function{
			Name:      s.Name,
			Scenarios: s.Scenarios,
		})

	}
	return nil, functions
}

func getFileContent(filePath string) (err error, content string) {

	file, err := os.Open(filePath)
	if err != nil {
		return err, ""
	}
	defer file.Close()

	src, err := ioutil.ReadAll(file)
	if err != nil {
		return err, ""
	}

	return nil, string(src)
}

func getFunctions(content string, filePath string) []Function {
	var functions []Function

	fileSet := token.NewFileSet()
	node, err := parser.ParseFile(fileSet, "test.go", content, 0)
	if err != nil {
		return nil
	}

	ast.Inspect(node, func(n ast.Node) bool {

		switch fn := n.(type) {

		case *ast.FuncDecl:

			testExists := false

			for _, elem := range fn.Type.Params.List {
				start := elem.Type.Pos() - 1
				end := elem.Type.End() - 1

				paramName := content[start:end]

				if strings.Contains(paramName, "testing.T") {
					testExists = true
				}
			}

			if testExists {
				var fScenarios []c.Scenario

				//docComment := fn.Doc.Text()

				// for _, stmt := range fn.Body.List {
				// 	if exprStmt, ok := stmt.(*ast.ExprStmt); ok {
				// 		if call, ok := exprStmt.X.(*ast.CallExpr); ok {
				// 			if fun, ok := call.Fun.(*ast.SelectorExpr); ok {
				// 				if fun.Sel.Name == "Run" {
				// 					if arg, ok := call.Args[0].(*ast.BasicLit); ok {
				// 						fScenarios = append(fScenarios, c.Scenario{
				// 							Id:   MakeID(filePath, TrimQuotes(fn.Name.String()), TrimQuotes(arg.Value)),
				// 							Name: TrimQuotes(arg.Value),
				// 						})
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// }

				functions = append(functions, Function{
					Name:      fn.Name.Name,
					Scenarios: fScenarios,
				})
			}
		}

		return true
	})

	return functions
}

func TrimQuotes(input string) string {
	return strings.TrimFunc(input, func(r rune) bool {
		if r == '"' {
			return true
		}
		return false
	})
}

func MakeID(filePath string, funcName string, scenario string) string {
	hash := md5.Sum([]byte(fmt.Sprintf("%s_%s_%s", filePath, funcName, scenario)))
	return string(hex.EncodeToString(hash[:]))
}
