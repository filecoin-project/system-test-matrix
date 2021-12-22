package extractor

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"strings"

	a "testsuites/annotations"
	c "testsuites/collector"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/golang"
)

type NodeType string

const (
	COMMENT              NodeType = "comment"
	PACKAGE_CLAUSE       NodeType = "package_clause"
	FUNCTION_DECLARATION NodeType = "function_declaration"
	PARAMETER_LIST       NodeType = "parameter_list"
	BLOCK                NodeType = "block"
	CALL_EXPRESSION      NodeType = "call_expression"
)

type Metadata struct {
	Package string
	Ignore  bool
	a.HeaderType
}

type FileData struct {
	Metadata  *Metadata
	Scenarios []c.Scenario
	Complete  bool
}

type isCompleted bool

func ExtractInfo(file c.TestFile, ctx context.Context) (*FileData, isCompleted, error) {

	fileData := &FileData{}

	content, err := getFileContent(file.Path)
	if err != nil {
		return nil, true, err
	}

	parser := sitter.NewParser()
	parser.SetLanguage(golang.GetLanguage())

	tree, err := parser.ParseCtx(ctx, nil, []byte(content))
	if err != nil {
		return nil, true, err
	}

	cursor := sitter.NewTreeCursor(tree.RootNode())

	fData, err := parseContent(content, cursor, file.Path)
	if err != nil {
		return nil, true, err
	}
	for _, s := range fData.Scenarios {
		fileData.Scenarios = append(fileData.Scenarios, c.Scenario{
			Function:  s.Function,
			Behaviors: s.Behaviors,
		})

	}

	return fileData, isCompleted(fileData.Complete), nil
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

func parseContent(content string, treeCursor *sitter.TreeCursor, filePath string) (*FileData, error) {
	fileData := &FileData{}

	var annotationParser a.Parser

	fileData.Metadata = getMetadata(content, treeCursor, &annotationParser)
	functions := getFunctionNodes(content, treeCursor, &annotationParser)

	for _, function := range functions {

		behaviors := findBehaviorsFromNode(content, function.Node)
		var callExpressions []string = nil
		if len(behaviors) > 0 {
			callExpressions = findCallExprFromNode(content, function.Node)
		} else {
			fileData.Complete = true
		}

		fileData.Scenarios = append(fileData.Scenarios, makeCollectorScenario(filePath, function.Name, behaviors, callExpressions))

	}

	return fileData, nil
}

func getMetadata(content string, treeCursor *sitter.TreeCursor, parser *a.Parser) *Metadata {

	meta := Metadata{}

	numChildsRootNode := treeCursor.CurrentNode().ChildCount()
	for childId := 0; numChildsRootNode > 0; childId++ {
		child := treeCursor.CurrentNode().Child(childId)

		if !child.IsNull() {

			if child.Type() == string(PACKAGE_CLAUSE) {
				break
			}

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

func getFunctionNodes(content string, treeCursor *sitter.TreeCursor, parser *a.Parser) (funcAnnoPair []struct {
	Node *sitter.Node
	Name string
}) {

	numChildsRootNode := treeCursor.CurrentNode().ChildCount()
	node := &sitter.Node{}
	prevNode := &sitter.Node{}
	funcName := ""
	isIgnored := false
	for childId := 0; int(numChildsRootNode) > childId; childId++ {
		child := treeCursor.CurrentNode().Child(childId)

		if child != nil {
			if child.Type() == string(FUNCTION_DECLARATION) {
				if prevNode.Type() == string(COMMENT) {

					value, annotationType, _ := parser.Parse(content[prevNode.StartByte():prevNode.EndByte()])
					if value != nil && annotationType == a.Ignore {
						isIgnored = value.(bool)
					}
				}

				funcName = content[child.Child(1).StartByte():child.Child(1).EndByte()]
				if child.Child(2).Type() == string(PARAMETER_LIST) {
					funcParamString := content[child.Child(2).StartByte():child.Child(2).EndByte()]
					if !strings.Contains(funcParamString, "testing.T") {
						isIgnored = true
					} else {
						node = child
					}

				}

				if isIgnored {
					prevNode = child
					isIgnored = false
					continue
				}

				funcAnnoPair = append(funcAnnoPair, struct {
					Node *sitter.Node
					Name string
				}{
					Node: node,
					Name: funcName,
				})

				node = nil
				funcName = ""
				isIgnored = false
			}
			prevNode = child
		}
	}

	return funcAnnoPair
}

func findBehaviorsFromNode(content string, node *sitter.Node) (behaviors []a.BehaviorType) {
	if node == nil {
		return nil
	}

	var annotationParser a.Parser

	iter := sitter.NewIterator(node, sitter.DFSMode)
	iter.ForEach(func(iterChild *sitter.Node) error {
		if iterChild.Type() == string(COMMENT) {
			behavior, parsedType, err := annotationParser.Parse(content[iterChild.StartByte():iterChild.EndByte()])
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
		}
		return nil
	})

	return behaviors
}

func findCallExprFromNode(content string, node *sitter.Node) (expressions []string) {
	if node == nil {
		return nil
	}

	iter := sitter.NewIterator(node, sitter.DFSMode)
	iter.ForEach(func(iterChild *sitter.Node) error {
		if iterChild.Type() == string(CALL_EXPRESSION) {
			expr := content[iterChild.StartByte():iterChild.EndByte()]

			expressions = append(expressions, expr)
		}
		return nil
	})

	return expressions
}

func makeCollectorScenario(filePath string, funcName string, behaviors []a.BehaviorType, expressions []string) c.Scenario {

	for i := range behaviors {
		behaviors[i].Id = makeID(filePath, funcName, behaviors[i].Tag)
	}

	fScenario := c.Scenario{
		Function:        funcName,
		CallExpressions: expressions,
		Behaviors:       behaviors,
	}

	return fScenario
}

func makeID(filePath string, funcName string, behavior string) string {
	hash := md5.Sum([]byte(fmt.Sprintf("%s_%s_%s", filePath, funcName, behavior)))
	return string(hex.EncodeToString(hash[:]))
}
