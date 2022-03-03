package lang

import (
	a "testsuites/annotations"
	c "testsuites/collector"

	sitter "github.com/smacker/go-tree-sitter"
)

type RustLang struct {
	Content  string
	Cursor   *sitter.TreeCursor
	FilePath string
}

func (r *RustLang) ParseContent() (*c.FileData, error) {

	fileData := &c.FileData{}

	var annotationParser a.Parser

	fileData.Metadata = r.getMetadata(&annotationParser)
	functions := r.getFunctionNodes(&annotationParser)

	for _, function := range functions {

		behaviors := r.findBehaviorsFromNode(function.Node)
		var callExpressions []string = nil
		if len(behaviors) > 0 {
			callExpressions = r.findCallExprFromNode(function.Node)
		}

		fileData.Functions = append(fileData.Functions, makeCollectorScenario(r.FilePath, function.Name, behaviors, callExpressions))

	}

	return fileData, nil
}

func (r *RustLang) getMetadata(parser *a.Parser) *c.Metadata {
	meta := c.Metadata{}

	numChildsRootNode := r.Cursor.CurrentNode().ChildCount()
	for childId := 0; childId < int(numChildsRootNode); childId++ {
		child := r.Cursor.CurrentNode().Child(childId)

		if child != nil {

			// check if attribute is start of test mod
			if child.Type() == string(ATTRIBUTE_ITEM) {
				argChild := child.ChildByFieldName(string(META_ARGUMENTS))
				if argChild != nil {
					metaChild := argChild.ChildByFieldName(string(META_ITEM))
					if metaChild != nil {
						arg := r.Content[metaChild.StartByte():metaChild.EndByte()]
						if arg != "test" {
							continue
						}
					}
				}
			}

			//  get body declaration
			bodyChild := r.Cursor.CurrentNode().Child(childId + 1).ChildByFieldName(string(DECLARATION_LIST))
			if bodyChild != nil {
				bodyChildCount := bodyChild.ChildCount()
				for cId := 0; cId < int(bodyChildCount); cId++ {
					// parse line comments if found, first non comment breaks
					bchild := bodyChild.Child(cId)
					if bchild.Type() == string(LINE_COMMENT) {
						value, annotationType, _ := parser.Parse(r.Content[bchild.StartByte():bchild.EndByte()])

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
				// no overflow would occur because next node is checked
				childId = childId + 1
			}
		}
	}

	return &meta
}

func (r *RustLang) getFunctionNodes(parser *a.Parser) (funcAnnoPair []struct {
	Node *sitter.Node
	Name string
}) {
	numChildsRootNode := r.Cursor.CurrentNode().ChildCount()
	funcName := ""
	for childId := 0; int(numChildsRootNode) > childId; childId++ {
		child := r.Cursor.CurrentNode().Child(childId)

		if child != nil {

			// check if attribute is start of test mod
			if child.Type() == string(ATTRIBUTE_ITEM) {
				argChild := child.ChildByFieldName(string(META_ARGUMENTS))
				if argChild != nil {
					metaChild := argChild.ChildByFieldName(string(META_ITEM))
					if metaChild != nil {
						arg := r.Content[metaChild.StartByte():metaChild.EndByte()]
						if arg != "test" {
							continue
						}
					}
				}
			}

			//  get body declaration
			bodyChild := r.Cursor.CurrentNode().Child(childId + 1).ChildByFieldName(string(DECLARATION_LIST))
			if bodyChild != nil {
				bodyChildCount := bodyChild.ChildCount()
				for cId := 0; cId < int(bodyChildCount); cId++ {
					bchild := bodyChild.Child(cId)

					if bchild.Type() == string(ATTRIBUTE_ITEM) {
						meta := bchild.ChildByFieldName(string(META_ITEM))
						// we are only interested in function with "test" attribute
						if r.Content[meta.StartByte():meta.EndByte()] != "test" {
							continue
						}

						fnChild := bodyChild.Child(cId + 1)
						if fnChild != nil && fnChild.Type() == string(FUNCTION_ITEM) {
							if fnChild.Child(1).Type() == string(IDENTIFIER) {
								funcName = r.Content[fnChild.Child(1).StartByte():fnChild.Child(1).EndByte()]
							}

							funcAnnoPair = append(funcAnnoPair, struct {
								Node *sitter.Node
								Name string
							}{
								Node: fnChild,
								Name: funcName,
							})

							// no overflow would occur because next node is checked
							cId = cId + 1
							funcName = ""
						}
					}

				}
			}
		}

	}

	return funcAnnoPair
}

func (r *RustLang) findBehaviorsFromNode(node *sitter.Node) (behaviors []a.BehaviorType) {
	if node == nil {
		return nil
	}

	var annotationParser a.Parser

	iter := sitter.NewIterator(node, sitter.DFSMode)
	iter.ForEach(func(iterChild *sitter.Node) error {
		if iterChild.Type() == string(LINE_COMMENT) {
			behavior, parsedType, err := annotationParser.Parse(r.Content[iterChild.StartByte():iterChild.EndByte()])
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

func (r *RustLang) findCallExprFromNode(node *sitter.Node) (expressions []string) {
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
					expr := r.Content[child.StartByte():child.EndByte()]

					expressions = append(expressions, expr)

				}
			}

		}
		return nil
	})

	return expressions
}
