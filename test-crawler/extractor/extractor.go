package extractor

import (
	"context"
	"io"
	"os"

	c "testsuites/collector"
	lang "testsuites/extractor/lang"

	sitter "github.com/smacker/go-tree-sitter"
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
)

type hasNoTests bool

func ExtractInfo(file c.TestFile, ctx context.Context, fileID c.FileID, lang_mode string) (*c.FileData, hasNoTests, error) {

	fileData := &c.FileData{}

	content, err := getFileContent(file.Path)
	if err != nil {
		return nil, true, err
	}

	parser := sitter.NewParser()
	sitterLang, err := GetParserForLangMode(lang_mode)
	if err != nil {
		return nil, true, err
	}
	parser.SetLanguage(sitterLang)

	tree, err := parser.ParseCtx(ctx, nil, []byte(content))
	if err != nil {
		return nil, true, err
	}

	cursor := sitter.NewTreeCursor(tree.RootNode())

	contentLang, err := getContentLanguage(content, cursor, file.Path, lang_mode)
	if err != nil {
		return nil, true, err
	}

	fData, err := contentLang.ParseContent()
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

func checkForExistanceOfTests(fData *c.FileData) bool {
	for _, data := range fData.Functions {
		if data.IsTesting {
			return true
		}
	}
	return false
}

func getContentLanguage(content string, cursor *sitter.TreeCursor, filepath string, lang_mode string) (lang.Language, error) {
	switch lang_mode {
	case "go":
		return &lang.GoLang{
			Content:  content,
			Cursor:   cursor,
			FilePath: filepath,
		}, nil
	case "rust":
		return &lang.RustLang{
			Content:  content,
			Cursor:   cursor,
			FilePath: filepath,
		}, nil
	default:
		return nil, &c.UnsupportedLanguageError{}
	}

}
