package lang

import (
	"strings"
	c "testsuites/collector"

	a "testsuites/annotations"

	sitter "github.com/smacker/go-tree-sitter"
)

type GoLang struct {
	Content  string
	Cursor   *sitter.TreeCursor
	FilePath string
}

func (g *GoLang) ParseContent() (*c.FileData, error) {

	fileData := &c.FileData{}

	var annotationParser a.Parser

	fileData.Metadata = g.getMetadata(&annotationParser)
	functions := g.getFunctionNodes(&annotationParser)

	for _, function := range functions {

		behaviors := g.findBehaviorsFromNode(function.Node)
		var callExpressions []string = nil
		if len(behaviors) > 0 {
			callExpressions = g.findCallExprFromNode(function.Node)
		}

		fileData.Functions = append(fileData.Functions, makeCollectorScenario(g.FilePath, function.Name, behaviors, callExpressions))

	}

	return fileData, nil
}

func (g *GoLang) getMetadata(parser *a.Parser) *c.Metadata {
	meta := c.Metadata{}

	numChildsRootNode := g.Cursor.CurrentNode().ChildCount()
	for childId := 0; childId < int(numChildsRootNode); childId++ {
		child := g.Cursor.CurrentNode().Child(childId)

		if child != nil {

			if child.Type() == string(PACKAGE_CLAUSE) {
				break
			}

			value, annotationType, _ := parser.Parse(g.Content[child.StartByte():child.EndByte()])

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

func (g *GoLang) getFunctionNodes(parser *a.Parser) (funcAnnoPair []struct {
	Node *sitter.Node
	Name string
}) {
	numChildsRootNode := g.Cursor.CurrentNode().ChildCount()
	node := &sitter.Node{}
	prevNode := &sitter.Node{}
	funcName := ""
	isIgnored := false
	for childId := 0; int(numChildsRootNode) > childId; childId++ {
		child := g.Cursor.CurrentNode().Child(childId)

		if child != nil {
			if child.Type() == string(FUNCTION_DECLARATION) {
				if prevNode.Type() == string(COMMENT) {

					value, annotationType, _ := parser.Parse(g.Content[prevNode.StartByte():prevNode.EndByte()])
					if value != nil && annotationType == a.Ignore {
						isIgnored = value.(bool)
					}
				}

				funcName = g.Content[child.Child(1).StartByte():child.Child(1).EndByte()]
				if child.Child(2).Type() == string(PARAMETER_LIST) {
					funcParamString := g.Content[child.Child(2).StartByte():child.Child(2).EndByte()]
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

func (g *GoLang) findBehaviorsFromNode(node *sitter.Node) (behaviors []a.BehaviorType) {
	if node == nil {
		return nil
	}

	var annotationParser a.Parser

	iter := sitter.NewIterator(node, sitter.DFSMode)
	iter.ForEach(func(iterChild *sitter.Node) error {
		if iterChild.Type() == string(COMMENT) {
			behavior, parsedType, err := annotationParser.Parse(g.Content[iterChild.StartByte():iterChild.EndByte()])
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

func (g *GoLang) findCallExprFromNode(node *sitter.Node) (expressions []string) {
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
					expr := g.Content[child.StartByte():child.EndByte()]

					expressions = append(expressions, expr)

				}
			}

		}
		return nil
	})

	return expressions
}
