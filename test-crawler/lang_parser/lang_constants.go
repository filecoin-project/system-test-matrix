package lang_parser

/*
	This are supported languages for test crawler
	For adding new ones, constants should be updated accordingly
	to the Tree-Sitter list of supported languages
	https://tree-sitter.github.io/tree-sitter/#available-parsers
*/

type FileExt string
type LangAlias string

type LangExtPair struct {
	Extension FileExt
	Language  LangAlias
}

const (
	CPP_EXT        FileExt = ".cpp"
	CPP_HEADER_EXT FileExt = ".hpp"
	CSHARP_EXT     FileExt = ".cs"
	C_EXT          FileExt = ".c"
	C_HEADER_EXT   FileExt = ".h"
	ELM_EXT        FileExt = ".elm"
	GOLANG_EXT     FileExt = ".go"
	JAVASCRIPT_EXT FileExt = ".js"
	JAVA_EXT       FileExt = ".java"
	LUA_EXT        FileExt = ".lua"
	OCAML_EXT      FileExt = ".ml"
	PYTHON_EXT     FileExt = ".py"
	RUBY_EXT       FileExt = ".rb"
	RUST_EXT       FileExt = ".rs"
	TYPESCRIPT_EXT FileExt = ".ts"
)

const (
	CPP_LANG        LangAlias = "cpp"
	CSHARP_LANG     LangAlias = "csharp"
	C_LANG          LangAlias = "c"
	ELM_LANG        LangAlias = "elm"
	GO_LANG         LangAlias = "golang"
	JAVASCRIPT_LANG LangAlias = "javascript"
	JAVA_LANG       LangAlias = "java"
	LUA_LANG        LangAlias = "lua"
	OCAML_LANG      LangAlias = "ocaml"
	PYTHON_LANG     LangAlias = "python"
	RUBY_LANG       LangAlias = "ruby"
	RUST_LANG       LangAlias = "rust"
	TYPESCRIPT_LANG LangAlias = "typescript"
)
