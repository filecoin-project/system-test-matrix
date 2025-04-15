package main

import (
	"context"
	"io/ioutil"
	"os"
	"testing"
	c "testsuites/collector"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	y "gopkg.in/yaml.v2"
)

func TestCrawlSingleFileForFunctions(t *testing.T) {
	ctx := context.Background()
	fnsAnn, err := crawlSingleFileForFunctions(ctx, "./mocks/event.go")
	if err != nil {
		t.Errorf("got error: %v", err.Error())
	}

	if len(fnsAnn) != 5 {
		t.Errorf("got %q, expected %q methods", len(fnsAnn), 2)
	}

	assert.Equal(t, "// HelloEvent simple method that just formats message.", fnsAnn[0].Description)
	assert.Equal(t, "HELLO_EVENT_001", fnsAnn[0].Name)
	assert.Equal(t, "()", fnsAnn[0].InputParams)      // input param
	assert.Equal(t, "string", fnsAnn[0].ReturnValues) // return param

	assert.Equal(t, "// HelloEventWithParameter accepts one param that got formated in message.", fnsAnn[1].Description)
	assert.Equal(t, "HELLO_EVENT_WITH_PARAMETER_001", fnsAnn[1].Name)
	assert.Equal(t, "(param string)", fnsAnn[1].InputParams)
	assert.Equal(t, "(string, error)", fnsAnn[1].ReturnValues)

	assert.Equal(t, "// FunctionWithoutParameters...", fnsAnn[2].Description)
	assert.Equal(t, "FUNCTION_WITHOUT_PARAMETERS_001", fnsAnn[2].Name)
	assert.Equal(t, "()", fnsAnn[2].InputParams)
	assert.Equal(t, "", fnsAnn[2].ReturnValues)

	assert.Equal(t, "// FunctionWithPointerReturnValue returns a simple pointer value.", fnsAnn[3].Description)
	assert.Equal(t, "FUNCTION_WITH_POINTER_RETURN_VALUE_001", fnsAnn[3].Name)
	assert.Equal(t, "()", fnsAnn[3].InputParams)
	assert.Equal(t, "*Event", fnsAnn[3].ReturnValues)

	assert.Equal(t, "Function description not set.", fnsAnn[4].Description)
	assert.Equal(t, "FUNCTION_WITHOUT_COMMENT_001", fnsAnn[4].Name)
	assert.Equal(t, "()", fnsAnn[4].InputParams)
	assert.Equal(t, "*Event", fnsAnn[4].ReturnValues)
}

func TestMakeYAML(t *testing.T) {

	yaml := []c.FunctionAnnotation{
		{
			ID:           1,
			Name:         "SomeName",
			InputParams:  "(ctx context.Context, param Parameters)",
			ReturnValues: "error",
			Description:  "SomeComment",
			Public:       true,
		},
		{
			ID:           2,
			Name:         "SomeName2",
			InputParams:  "(ctx context.Context, param2 Parameters2)",
			ReturnValues: "error",
			Description:  "SomeComment2",
			Public:       true,
		},
	}

	yamlData, err := y.Marshal(&yaml)
	if err != nil {
		t.Errorf("got error: %v", err.Error())
	}
	fileName := "test.yaml"
	err = ioutil.WriteFile(fileName, yamlData, 0644)
	if err != nil {
		panic("Unable to write data into the file")
	}

	bytes, err := ioutil.ReadFile(fileName)
	if err != nil {
		t.Errorf("got error: %v", err.Error())
	}

	assert.Equal(t, yamlData, bytes)

}

func TestCrawlRepoSourceCodeAndSaveToYaml(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "")
	require.NoError(t, err)
	defer os.RemoveAll(tempDir)

	err = crawlRepoSourceCodeAndSaveToYaml(Config{
		BehaviorGenPaths:      []string{"./mocks"},
		BehaviorGenOutputDir:  tempDir,
		BehaviorGenIndentJSON: true,
		BehaviorGenOutputMode: "file",
	})
	require.NoError(t, err)

	fileInfos, err := os.ReadDir(tempDir)
	require.NoError(t, err)
	assert.Equal(t, 2, len(fileInfos)) // one yaml file (behavior catalogue) and json file as crawled output
}

func TestSave(t *testing.T) {
	testFiles := []c.TestFile{
		{
			File: c.File{
				ID:      "1",
				File:    "event_test.go",
				Path:    "./mocks",
				Project: "test-crawler",
			},
			Functions: []c.Function{
				{
					Name: "TestHelloEvent",
				},
			},
		},
	}
	srcFiles := []c.SourceFile{
		{
			File: c.File{
				ID:      "1",
				File:    "event_test.go",
				Path:    "./mocks",
				Project: "test-crawler",
			},
			Methods: []c.Method{
				{
					Name: "HelloEvent",
				},
			},
		},
	}
	t.Run("Crawl test files and print to console", func(t *testing.T) {
		Save(&testFiles, OutputMode("stdout"), "outputs", true)
	})
	t.Run("Crawl test files and save to file", func(t *testing.T) {
		tempDir, err := os.MkdirTemp("", "")
		require.NoError(t, err)
		defer os.RemoveAll(tempDir)
		Save(&testFiles, OutputMode("file"), tempDir, true)
	})
	t.Run("Crawl source files and print to console", func(t *testing.T) {
		Save(&srcFiles, OutputMode("stdout"), "outputs", true)
	})
	t.Run("Crawl source files and save to file", func(t *testing.T) {
		tempDir := os.TempDir()
		defer os.RemoveAll(tempDir)
		Save(&testFiles, OutputMode("file"), tempDir, true)
	})
}
