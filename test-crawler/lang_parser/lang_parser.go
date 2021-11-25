package lang_parser

import (
	"errors"
	"fmt"
	"path/filepath"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/c"
	"github.com/smacker/go-tree-sitter/cpp"
	"github.com/smacker/go-tree-sitter/csharp"
	"github.com/smacker/go-tree-sitter/elm"
	"github.com/smacker/go-tree-sitter/golang"
	"github.com/smacker/go-tree-sitter/java"
	"github.com/smacker/go-tree-sitter/javascript"
	"github.com/smacker/go-tree-sitter/lua"
	"github.com/smacker/go-tree-sitter/ocaml"
	"github.com/smacker/go-tree-sitter/python"
	"github.com/smacker/go-tree-sitter/ruby"
	"github.com/smacker/go-tree-sitter/rust"
	"github.com/smacker/go-tree-sitter/typescript/typescript"
)

const LANG_AUTO string = "auto"

type ErrorLangDiffersFromConfigLang struct{}

func (e *ErrorLangDiffersFromConfigLang) Error() string {
	return "language differs from the one that is set in config"
}

func GetParserForLang(path string, file string, language string) (*sitter.Parser, error) {

	extension := filepath.Ext(fmt.Sprintf("%s/%s", path, file))

	parser := sitter.NewParser()

	sitterLang, lang := getLanguage(FileExt(extension))
	if sitterLang == nil {
		return nil, errors.New("unsupported language")
	}

	if LangAlias(language) != lang && language != LANG_AUTO {
		return nil, &ErrorLangDiffersFromConfigLang{}
	}

	parser.SetLanguage(sitterLang)
	return parser, nil
}

func getLanguage(fext FileExt) (*sitter.Language, LangAlias) {

	switch fext {
	case GOLANG_EXT:
		return golang.GetLanguage(), GO_LANG
	case RUST_EXT:
		return rust.GetLanguage(), RUST_LANG
	case CPP_EXT, CPP_HEADER_EXT, C_HEADER_EXT:
		return cpp.GetLanguage(), CPP_LANG
	case C_EXT:
		return c.GetLanguage(), C_LANG
	case CSHARP_EXT:
		return csharp.GetLanguage(), CSHARP_LANG
	case ELM_EXT:
		return elm.GetLanguage(), ELM_LANG
	case JAVA_EXT:
		return java.GetLanguage(), JAVA_LANG
	case JAVASCRIPT_EXT:
		return javascript.GetLanguage(), JAVASCRIPT_LANG
	case LUA_EXT:
		return lua.GetLanguage(), LUA_LANG
	case OCAML_EXT:
		return ocaml.GetLanguage(), OCAML_LANG
	case PYTHON_EXT:
		return python.GetLanguage(), PYTHON_LANG
	case RUBY_EXT:
		return ruby.GetLanguage(), RUBY_LANG
	case TYPESCRIPT_EXT:
		return typescript.GetLanguage(), TYPESCRIPT_LANG
	default:
		return nil, ""
	}
}
