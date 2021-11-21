package extractor

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io"
	"os"

	a "testsuites/annotations"
	c "testsuites/collector"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/golang"
)

type Metadata struct {
	Package string
	Ignore  bool
	a.HeaderType
}

func ExtractInfo(file c.TestFile, ctx context.Context) (scenarios []c.Scenario, meta *Metadata, err error) {
	content, err := getFileContent(file.Path)
	if err != nil {
		return nil, nil, err
	}

	parser := sitter.NewParser()
	parser.SetLanguage(golang.GetLanguage())

	tree, err := parser.ParseCtx(ctx, nil, []byte(content))
	if err != nil {
		return nil, nil, err
	}

	cursor := sitter.NewTreeCursor(tree.RootNode())

	scenData, meta, err := parseContent(content, cursor, file.Path)
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

	src, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	return string(src), nil
}

func parseContent(content string, treeCursor *sitter.TreeCursor, filePath string) ([]c.Scenario, *Metadata, error) {
	var scenarios []c.Scenario
	var metadata *Metadata

	var annotationParser a.Parser

	metadata = getMetadata(content, treeCursor, &annotationParser)

	// for _, function := range file.Scope.Objects {
	// 	testExists := false

	// 	params := findFunctionParamsFromDST(function)

	// 	for _, param := range params {
	// 		if strings.Contains(param, "testing.T") {
	// 			testExists = true
	// 		}
	// 	}

	// 	if testExists {

	// 		behaviors := findBehaviorsFromDST(function)

	// 		scenarios = append(scenarios, makeCollectorScenario(filePath, function.Name, behaviors))
	// 	}

	// }

	return scenarios, metadata, nil
}

func getMetadata(content string, treeCursor *sitter.TreeCursor, parser *a.Parser) *Metadata {

	meta := Metadata{}

	numChildsRootNode := treeCursor.CurrentNode().ChildCount()
	for childId := 0; numChildsRootNode > 0; childId++ {
		child := treeCursor.CurrentNode().Child(childId)

		if child != nil {

			value, annotationType, _ := parser.Parse(content[child.StartByte():child.EndByte()])

			if value != nil && (annotationType == a.Header || annotationType == a.Ignore) {
				switch dynType := value.(type) {
				case *a.HeaderType:
					{
						meta.HeaderType = *dynType
					}
				case bool:
					{
						meta.Ignore = dynType
					}
				}
			}
		}
	}

	return &meta
}

func findFunctionParamsFromDST() []string {

	var params []string

	// switch object.Decl.(type) {
	// case *dst.FuncDecl:
	// 	{
	// 		if object.Decl.(*dst.FuncDecl) != nil {
	// 			paramList := object.Decl.(*dst.FuncDecl).Type.Params.List
	// 			for _, param := range paramList {
	// 				switch outer := param.Type.(type) {
	// 				//case *dst.FuncType:
	// 					{

	// 					}
	// 				case *dst.StarExpr:
	// 					{
	// 						switch inner := outer.X.(type) {
	// 						case *dst.SelectorExpr:
	// 							{
	// 								pkg := inner.X.(*dst.Ident).Name
	// 								pkgType := inner.Sel.Name

	// 								params = append(params, fmt.Sprintf("%s.%s", pkg, pkgType))
	// 							}
	// 						}

	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	return params
}

func findBehaviorsFromDST() []a.BehaviorType {
	var behaviors []a.BehaviorType
	var annotationParser a.Parser

	//bodyObjects := object.Decl.(*dst.FuncDecl).Body.List

	//for _, object := range bodyObjects {

	comment := getCommentFromStmt()

	behavior, parsedType, err := annotationParser.Parse(comment)
	if err == nil {
		if behavior != nil && parsedType == a.Behavior {
			switch behaviorType := behavior.(type) {
			case []a.BehaviorType:
				behaviors = append(behaviors, behaviorType...)
			}
		} else {
			behaviors = append(behaviors, a.BehaviorType{})
		}
	}
	//}

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

func getCommentFromStmt() string {
	var result string

	return result
}
