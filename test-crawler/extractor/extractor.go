package extractor

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"strings"
	"unicode"

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
	IDENTIFIER           NodeType = "identifier"
	METHOD_DECLARATION   NodeType = "method_declaration"
)

type Metadata struct {
	Package string
	Ignore  bool
	a.HeaderType
}

type FileData struct {
	Metadata  *Metadata
	Functions []c.Function
}

type FunctionAnnotationNode struct {
	Node     *sitter.Node
	Function c.FunctionAnnotation
}

type hasNoTests bool

func ExtractInfo(file c.TestFile, ctx context.Context, fileID c.FileID) (*FileData, hasNoTests, error) {

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

	fileData.Metadata = fData.Metadata

	for _, s := range fData.Functions {
		fileData.Functions = append(fileData.Functions, c.Function{
			FileID:          fileID,
			Name:            s.Name,
			Behaviors:       s.Behaviors,
			CallExpressions: s.CallExpressions,
			IsTesting:       s.IsTesting,
		})

	}

	return fileData, hasNoTests(!checkForExistanceOfTests(fData)), nil
}

func GetExportedFunctions(ctx context.Context, filePath string) ([]c.FunctionAnnotation, error) {
	content, err := getFileContent(filePath)
	if err != nil {
		return nil, err
	}

	parser := sitter.NewParser()
	parser.SetLanguage(golang.GetLanguage())

	tree, err := parser.ParseCtx(ctx, nil, []byte(content))
	if err != nil {
		return nil, err
	}

	cursor := sitter.NewTreeCursor(tree.RootNode())
	fnsAnno, err := parseContentForFunctions(content, cursor)
	if err != nil {
		return nil, err
	}

	return fnsAnno, nil
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
	funcNodes := getFunctionNodes(content, treeCursor, &annotationParser)

	for _, funcNode := range funcNodes {

		behaviors := findBehaviorsFromNode(content, funcNode.Node)
		var callExpressions []string = nil
		if len(behaviors) > 0 {
			callExpressions = findCallExprFromNode(content, funcNode.Node)
		}

		fileData.Functions = append(fileData.Functions, makeCollectorScenario(filePath, funcNode.Function.Name, behaviors, callExpressions))

	}

	return fileData, nil
}

func checkForExistanceOfTests(fData *FileData) bool {
	for _, data := range fData.Functions {
		if data.IsTesting {
			return true
		}
	}
	return false
}

func getMetadata(content string, treeCursor *sitter.TreeCursor, parser *a.Parser) *Metadata {

	meta := Metadata{}

	numChildsRootNode := treeCursor.CurrentNode().ChildCount()
	for childId := 0; childId < int(numChildsRootNode); childId++ {
		child := treeCursor.CurrentNode().Child(childId)

		if child != nil {

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

// getFunctionNodes method extracts functions and methods.
// Function can have 2 types: function_declaration (for example contructor)
// and method_declaration (can be exported and unexported).
// Return value is a slice of FunctionAnnotationNode, where each node holds function's annotation.
func getFunctionNodes(content string, treeCursor *sitter.TreeCursor, parser *a.Parser) (funcAnnoPair []FunctionAnnotationNode) {

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

				funcAnnoPair = append(funcAnnoPair, FunctionAnnotationNode{
					Node: node,
					Function: c.FunctionAnnotation{
						Name: funcName,
					},
				})

				node = nil
				funcName = ""
				isIgnored = false
			}
			/*
				Take a look at this function for example:
				*********
				func (e *ProofEventStream) ListenProofEvent(
					ctx context.Context,
					policy *types2.ProofRegisterPolicy)
				(<-chan *types2.RequestEvent, error){...}
				*********
				child.Child(1) is a first part of function declaration (e *ProofEventStream)
				child.Child(2): field_identifier  'ListenProofEvent'
				child.Child(3): parameter_list:  (ctx context.Context, policy *types2.ProofRegisterPolicy)
				child.Child(4): parameter_list:  (<-chan *types2.RequestEvent, error)
			*/
			if child.Type() == string(METHOD_DECLARATION) {
				funcName = content[child.Child(2).StartByte():child.Child(2).EndByte()]
				params := ""
				returnValues := ""
				if child.Child(1).Type() == string(PARAMETER_LIST) {
					params = content[child.Child(3).StartByte():child.Child(3).EndByte()]
					returnValues = content[child.Child(4).StartByte():child.Child(4).EndByte()]
				}
				funcAnnoPair = append(funcAnnoPair, FunctionAnnotationNode{
					Node: child,
					Function: c.FunctionAnnotation{
						Name:         funcName,
						Public:       isPublic(funcName),
						InputParams:  params,
						ReturnValues: returnValues,
					},
				})
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
			childCount := iterChild.ChildCount()

			for i := 0; i < int(childCount); i++ {
				child := iterChild.Child(i)

				if child.Type() == string(IDENTIFIER) {
					expr := content[child.StartByte():child.EndByte()]

					expressions = append(expressions, expr)

				}
			}

		}
		return nil
	})

	return expressions
}

func makeCollectorScenario(filePath string, funcName string, behaviors []a.BehaviorType, expressions []string) c.Function {

	for i := range behaviors {
		behaviors[i].Id = makeID(filePath, funcName, behaviors[i].Tag)
	}

	fScenario := c.Function{
		Name:            funcName,
		CallExpressions: expressions,
		Behaviors:       behaviors,
	}

	if len(behaviors) > 0 || strings.HasPrefix(funcName, "Test") {
		fScenario.IsTesting = true
	}

	return fScenario
}

func makeID(filePath string, funcName string, behavior string) string {
	hash := md5.Sum([]byte(fmt.Sprintf("%s_%s_%s", filePath, funcName, behavior)))
	return string(hex.EncodeToString(hash[:]))
}

// parseContentForFunctions accepts a content which represents whole golang file as a string,
// parses it and returns a slice of function annotations (including exported and unexported ones).
func parseContentForFunctions(content string, cursor *sitter.TreeCursor) ([]c.FunctionAnnotation, error) {
	var annotationParser a.Parser

	var fnsAnno []c.FunctionAnnotation
	funcNodes := getFunctionNodes(content, cursor, &annotationParser)
	for _, funcNode := range funcNodes {
		fnsAnno = append(fnsAnno, funcNode.Function)
	}

	return fnsAnno, nil
}

func isPublic(funcName string) bool {
	return unicode.IsUpper(rune(funcName[0]))
}
