package extractor

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	a "testsuites/annotations"
	c "testsuites/collector"

	"github.com/dave/dst"
	"github.com/dave/dst/decorator"
)

type Function struct {
	Name      string
	Scenarios []c.Scenario
}

type Metadata struct {
	Package string
	a.HeaderType
}

func ExtractScenarios(file c.TestFile) (functions []c.Function, meta *Metadata, err error) {
	content, err := getFileContent(file.Path)
	if err != nil {
		return nil, nil, err
	}

	funcData, meta, err := getFunctions(content, file.Path)
	if err != nil {
		return nil, nil, err
	}
	for _, s := range funcData {
		functions = append(functions, c.Function{
			Name:      s.Name,
			Scenarios: s.Scenarios,
		})

	}
	return functions, meta, nil
}

func getFileContent(filePath string) (content string, err error) {

	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	src, err := ioutil.ReadAll(file)
	if err != nil {
		return "", err
	}

	return string(src), nil
}

func getFunctions(content string, filePath string) ([]Function, *Metadata, error) {
	var functions []Function
	var metadata Metadata

	var annotationParser a.Parser

	f, err := decorator.Parse(content)
	if err != nil {
		panic(err)
	}

	metadata.Package = f.Name.Name

	headerData, err := annotationParser.Parse(f.Decs.NodeDecs.Start[0], a.Header)
	if err == nil {
		metadata.TestType = headerData.(*a.HeaderType).TestType
		metadata.System = headerData.(*a.HeaderType).System
		metadata.Ignore = headerData.(*a.HeaderType).Ignore
	}

	for _, function := range f.Scope.Objects {
		testExists := false

		params := findFunctionParamsFromDST(function)

		for _, param := range params {
			if strings.Contains(param, "testing.T") {
				testExists = true
			}
		}

		if testExists {
			fScenarios := findScenariosFromDST(function)

			functions = append(functions, Function{
				Name:      function.Name,
				Scenarios: makeCollectorScenarios(filePath, function.Name, fScenarios),
			})
		}

	}

	return functions, &metadata, nil
}

func findFunctionParamsFromDST(object *dst.Object) []string {

	var params []string

	if object.Decl.(*dst.FuncDecl) != nil {
		paramList := object.Decl.(*dst.FuncDecl).Type.Params.List
		for _, param := range paramList {
			pkg := param.Type.(*dst.StarExpr).X.(*dst.SelectorExpr).X.(*dst.Ident).Name
			pkgType := param.Type.(*dst.StarExpr).X.(*dst.SelectorExpr).Sel.Name

			params = append(params, fmt.Sprintf("%s.%s", pkg, pkgType))
		}
	}

	return params
}

func findFunctionAnnotation(object *dst.Object) a.FunctionType {
	var fType a.FunctionType

	return fType
}

func findScenariosFromDST(object *dst.Object) []a.ScenarioType {
	var scenarios []a.ScenarioType
	var annotationParser a.Parser

	bodyObjects := object.Decl.(*dst.FuncDecl).Body.List

	for _, object := range bodyObjects {

		comment := object.(*dst.ExprStmt).Decs.NodeDecs.Start[0]

		scenario, err := annotationParser.Parse(comment, a.Scenario)
		if err != nil {
			scenarios = append(scenarios, scenario.(a.ScenarioType))
		}
	}

	return scenarios
}

func makeCollectorScenarios(filePath string, funcName string, scenarios []a.ScenarioType) []c.Scenario {
	var fScenarios []c.Scenario

	return fScenarios
}

func makeID(filePath string, funcName string, scenario string) string {
	hash := md5.Sum([]byte(fmt.Sprintf("%s_%s_%s", filePath, funcName, scenario)))
	return string(hex.EncodeToString(hash[:]))
}
