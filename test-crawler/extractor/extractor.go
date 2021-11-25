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
	functions := getFunctionNodes(content, treeCursor, &annotationParser)

	for _, function := range functions {

		behaviors := findBehaviorsFromNode(content, function.Node)

		scenarios = append(scenarios, makeCollectorScenario(filePath, function.Name, behaviors))

	}

	return scenarios, metadata, nil
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
