package extractor

import (
	c "testsuites/collector"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/golang"
	"github.com/smacker/go-tree-sitter/rust"
)

func GetParserForLangMode(lang_mode string) (*sitter.Language, error) {
	switch lang_mode {
	case "go":
		return golang.GetLanguage(), nil
	case "rust":
		return rust.GetLanguage(), nil
	default:
		return nil, &c.UnsupportedLanguageError{}
	}
}
