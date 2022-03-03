package lang

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"strings"
	a "testsuites/annotations"
	c "testsuites/collector"
)

type Language interface {
	ParseContent() (*c.FileData, error)
}

type NodeType string

// should split this on language based node types in the future
const (
	//golang
	COMMENT              NodeType = "comment"
	PACKAGE_CLAUSE       NodeType = "package_clause"
	FUNCTION_DECLARATION NodeType = "function_declaration"
	PARAMETER_LIST       NodeType = "parameter_list"
	BLOCK                NodeType = "block"
	CALL_EXPRESSION      NodeType = "call_expression"
	//rust
	IDENTIFIER       NodeType = "identifier"
	ATTRIBUTE_ITEM   NodeType = "attribute_item"
	META_ITEM        NodeType = "meta_item"
	MOD_ITEM         NodeType = "mod_item"
	FUNCTION_ITEM    NodeType = "function_item"
	DECLARATION_LIST NodeType = "declaration_list"
	LINE_COMMENT     NodeType = "line_comment"
	META_ARGUMENTS   NodeType = "meta_arguments"
)

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
