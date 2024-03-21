package collector

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"strings"
)

type FileID string

func CreateFileID(path string, name string) FileID {
	hash := md5.Sum([]byte(fmt.Sprintf("%s//%s", path, name)))
	return FileID(hex.EncodeToString(hash[:]))
}

func (f *FileID) Equal(id FileID) bool {
	return *f == id
}

func (f *FileID) ToFile(files map[FileID]*TestFile) *TestFile {

	for fileID, file := range files {
		if f.Equal(fileID) {
			return file
		}
	}

	return nil
}

func NewTestFile(path string) TestFile {
	parts := strings.Split(path, "/")

	return TestFile{
		File: File{
			File:         parts[len(parts)-1],
			Path:         path,
			Project:      parts[1],
			ParentFolder: parts[len(parts)-2],
		},
	}
}

func NewSourceFile(path string) SourceFile {
	parts := strings.Split(path, "/")

	return SourceFile{
		File: File{
			File:         parts[len(parts)-1],
			Path:         path,
			Project:      parts[1],
			ParentFolder: parts[len(parts)-2],
		},
	}
}
