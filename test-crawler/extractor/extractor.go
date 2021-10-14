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

func getFunctions(content string, filePath string) ([]c.Function, *Metadata, error) {
	var functions []c.Function
	var metadata Metadata

	var annotationParser a.Parser

	file, err := decorator.Parse(content)
	if err != nil {
		panic(err)
	}

	metadata.Package = file.Name.Name

	if len(file.Decs.NodeDecs.Start) > 0 {
		headerData, err := annotationParser.Parse(file.Decs.NodeDecs.Start[0], a.Header)
		if err == nil {
			metadata.TestType = headerData.(*a.HeaderType).TestType
			metadata.System = headerData.(*a.HeaderType).System
			metadata.Ignore = headerData.(*a.HeaderType).Ignore
		}
	}

	for _, function := range file.Scope.Objects {
		testExists := false

		params := findFunctionParamsFromDST(function)

		for _, param := range params {
			if strings.Contains(param, "testing.T") {
				testExists = true
			}
		}

		if testExists {

			fType := findFunctionFromDST(function)

			fScenarios := findScenariosFromDST(function)

			functions = append(functions, c.Function{
				Name:         function.Name,
				Scenarios:    makeCollectorScenarios(filePath, function.Name, fScenarios),
				FunctionType: fType,
			})
		}

	}

	return functions, &metadata, nil
}

func findFunctionParamsFromDST(object *dst.Object) []string {

	var params []string

	switch object.Decl.(type) {
	case *dst.FuncDecl:
		{
			if object.Decl.(*dst.FuncDecl) != nil {
				paramList := object.Decl.(*dst.FuncDecl).Type.Params.List
				for _, param := range paramList {
					switch outer := param.Type.(type) {
					case *dst.FuncType:
						{

						}
					case *dst.StarExpr:
						{
							switch inner := outer.X.(type) {
							case *dst.SelectorExpr:
								{
									pkg := inner.X.(*dst.Ident).Name
									pkgType := inner.Sel.Name

									params = append(params, fmt.Sprintf("%s.%s", pkg, pkgType))
								}
							}

						}
					}
				}
			}
		}
	}

	return params
}

func findFunctionFromDST(object *dst.Object) a.FunctionType {
	var fType a.FunctionType
	var annotationParser a.Parser

	if len(object.Decl.(*dst.FuncDecl).Decs.NodeDecs.Start) > 0 {
		IfType, err := annotationParser.Parse(object.Decl.(*dst.FuncDecl).Decs.NodeDecs.Start[0], a.Func)
		if err == nil {
			fType.Ignore = IfType.(*a.FunctionType).Ignore
		}
	}
	return fType
}

func findScenariosFromDST(object *dst.Object) []a.ScenarioType {
	var scenarios []a.ScenarioType
	var annotationParser a.Parser

	bodyObjects := object.Decl.(*dst.FuncDecl).Body.List

	for _, object := range bodyObjects {

		comment := getCommentFromStmt(object)

		scenario, err := annotationParser.Parse(comment, a.Scenario)
		if err == nil {
			if scenario != nil {
				switch scenType := scenario.(type) {
				case *a.ScenarioType:
					scenarios = append(scenarios, *scenType)
				}
			} else {
				scenarios = append(scenarios, a.ScenarioType{})
			}
		}
	}

	return scenarios
}

func makeCollectorScenarios(filePath string, funcName string, scenarios []a.ScenarioType) []c.Scenario {
	var fScenarios []c.Scenario

	for _, scenario := range scenarios {
		fScenarios = append(fScenarios, c.Scenario{
			Id:           makeID(filePath, funcName, scenario.Description),
			ScenarioType: scenario,
		})
	}

	return fScenarios
}

func makeID(filePath string, funcName string, scenario string) string {
	hash := md5.Sum([]byte(fmt.Sprintf("%s_%s_%s", filePath, funcName, scenario)))
	return string(hex.EncodeToString(hash[:]))
}

func getCommentFromStmt(statment dst.Stmt) string {
	var result string

	switch v := statment.(type) {
	case *dst.BadStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.DeclStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.EmptyStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.LabeledStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.ExprStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.SendStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.IncDecStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.AssignStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.GoStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.DeferStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.ReturnStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.BranchStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.IfStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.CaseClause:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.SwitchStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.TypeSwitchStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.CommClause:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.SelectStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.ForStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	case *dst.RangeStmt:
		if len(v.Decs.NodeDecs.Start) > 0 {
			return v.Decs.NodeDecs.Start[0]
		}
	}

	return result
}
