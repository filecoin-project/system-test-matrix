package collector

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"strings"
)

type FileID string

func CreateFileID(path string, name string) FileID {
	hash := md5.Sum([]byte(fmt.Sprintf("%s%s", path, name)))
	return FileID(hex.EncodeToString(hash[:]))
}

func (f *FileID) Equal(id FileID) bool {
	return *f == id
}

func (f *FileID) ToFile(files map[FileID]TestFile) *TestFile {

	for _, file := range files {
		if f.Equal(file.ID) {
			return &file
		}
	}

	return nil
}

func NewFile(path string) TestFile {
	parts := strings.Split(path, "/")

	return TestFile{
		File:         parts[len(parts)-1],
		Path:         path,
		Project:      parts[1],
		ParentFolder: parts[len(parts)-2],
	}
}
