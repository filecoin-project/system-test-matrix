package lang

import (
	c "testsuites/collector"

	sitter "github.com/smacker/go-tree-sitter"
)

type RustLang struct {
	Content  string
	Cursor   *sitter.TreeCursor
	FilePath string
}

func (g *RustLang) ParseContent() (*c.FileData, error) {

	return nil, nil
}
