package collector

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestListGoFilesInFolder(t *testing.T) {
	t.Run("Read golang files from temporary directory", func(t *testing.T) {
		tempDir := t.TempDir()
		err := ioutil.WriteFile(fmt.Sprintf("%s/a.go", tempDir), []byte("package main func main(){a:=1}"), 0644)
		assert.NoError(t, err)
		err = ioutil.WriteFile(fmt.Sprintf("%s/b.go", tempDir), []byte("package main func main(){b:=2}"), 0644)
		assert.NoError(t, err)

		system, files, err := ListGoFilesInFolder(tempDir, nil)
		assert.NoError(t, err)
		splitedFolderName := strings.Split(tempDir, "/")
		systemName := splitedFolderName[len(splitedFolderName)-1]
		assert.Equal(t, system, systemName)
		assert.Equal(t, 2, len(files))
		os.Remove(tempDir)
	})

	t.Run("Read golang files excluding everything else", func(t *testing.T) {
		tempDir := t.TempDir()
		err := ioutil.WriteFile(fmt.Sprintf("%s/a.go", tempDir), []byte("package main func main(){a:=1}"), 0644)
		err = ioutil.WriteFile(fmt.Sprintf("%s/b.go", tempDir), []byte("package main func main(){b:=2}"), 0644)
		err = ioutil.WriteFile(fmt.Sprintf("%s/b_test.go", tempDir), []byte("package main_test"), 0644)
		err = ioutil.WriteFile(fmt.Sprintf("%s/.env", tempDir), []byte("PORT=8080"), 0644)
		assert.NoError(t, err)

		system, files, err := ListGoFilesInFolder(tempDir, nil)
		assert.NoError(t, err)
		splitedFolderName := strings.Split(tempDir, "/")
		systemName := splitedFolderName[len(splitedFolderName)-1]
		assert.Equal(t, system, systemName)
		assert.Equal(t, 2, len(files))
		os.Remove(tempDir)
	})
}
