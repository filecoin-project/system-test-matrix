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

func ExtractScenarios(file c.TestFile) (scenarios []c.Scenario, meta *Metadata, err error) {
	content, err := getFileContent(file.Path)
	if err != nil {
		return nil, nil, err
	}

	scenData, meta, err := getScenarios(content, file.Path)
	if err != nil {
		return nil, nil, err
	}
	for _, s := range scenData {
		scenarios = append(scenarios, c.Scenario{
			Function:  s.Function,
			Behaviors: s.Behaviors,
		})

	}
	return scenarios, meta, nil
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

func getScenarios(content string, filePath string) ([]c.Scenario, *Metadata, error) {
	var scenarios []c.Scenario
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

			behaviors := findBehaviorsFromDST(function)

			scenarios = append(scenarios, makeCollectorScenario(filePath, function.Name, behaviors))
		}

	}

	return scenarios, &metadata, nil
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

// func findScenarioFromDST(object *dst.Object) a.ScenarioType {
// 	var fType a.ScenarioType
// 	var annotationParser a.Parser

// 	if len(object.Decl.(*dst.FuncDecl).Decs.NodeDecs.Start) > 0 {
// 		IfType, err := annotationParser.Parse(object.Decl.(*dst.FuncDecl).Decs.NodeDecs.Start[0], a.Scenario)
// 		if err == nil {
// 			fType.Ignore = IfType.(*a.ScenarioType).Ignore
// 		}
// 	}
// 	return fType
// }

func findBehaviorsFromDST(object *dst.Object) []a.BehaviorType {
	var behaviors []a.BehaviorType
	var annotationParser a.Parser

	bodyObjects := object.Decl.(*dst.FuncDecl).Body.List

	for _, object := range bodyObjects {

		comment := getCommentFromStmt(object)

		behavior, err := annotationParser.Parse(comment, a.Behavior)
		if err == nil {
			if behavior != nil {
				switch behaviorType := behavior.(type) {
				case []a.BehaviorType:
					behaviors = append(behaviors, behaviorType...)
				}
			} else {
				behaviors = append(behaviors, a.BehaviorType{})
			}
		}
	}

	return behaviors
}

func makeCollectorScenario(filePath string, funcName string, behaviors []a.BehaviorType) c.Scenario {

	for i := range behaviors {
		behaviors[i].Id = makeID(filePath, funcName, behaviors[i].Tag)
	}

	fScenario := c.Scenario{
		Function:  funcName,
		Behaviors: behaviors,
	}

	return fScenario
}

func makeID(filePath string, funcName string, behavior string) string {
	hash := md5.Sum([]byte(fmt.Sprintf("%s_%s_%s", filePath, funcName, behavior)))
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
