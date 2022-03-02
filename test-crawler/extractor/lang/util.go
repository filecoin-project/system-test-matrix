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

const (
	COMMENT              NodeType = "comment"
	PACKAGE_CLAUSE       NodeType = "package_clause"
	FUNCTION_DECLARATION NodeType = "function_declaration"
	PARAMETER_LIST       NodeType = "parameter_list"
	BLOCK                NodeType = "block"
	CALL_EXPRESSION      NodeType = "call_expression"
	IDENTIFIER           NodeType = "identifier"
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
