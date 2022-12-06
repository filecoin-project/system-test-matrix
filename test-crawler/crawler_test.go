package main

import (
	"context"
	"io/ioutil"
	"testing"
	c "testsuites/collector"

	"github.com/stretchr/testify/assert"
	y "gopkg.in/yaml.v2"
)

func TestCrawlSingleFileForFunctions(t *testing.T) {
	ctx := context.Background()
	fnsAnn, err := crawlSingleFileForFunctions(ctx, "./mocks/event.go")
	if err != nil {
		t.Errorf("got error: %v", err.Error())
	}

	if len(fnsAnn) != 4 {
		t.Errorf("got %q, expected %q methods", len(fnsAnn), 2)
	}

	assert.Equal(t, "// HelloEvent simple method that just formats message.", fnsAnn[0].Description)
	assert.Equal(t, "HelloEvent", fnsAnn[0].Name)
	assert.Equal(t, "()", fnsAnn[0].InputParams)      // input param
	assert.Equal(t, "string", fnsAnn[0].ReturnValues) // return param

	assert.Equal(t, "// HelloEventWithParameter accepts one param that got formated in message.", fnsAnn[1].Description)
	assert.Equal(t, "HelloEventWithParameter", fnsAnn[1].Name)
	assert.Equal(t, "(param string)", fnsAnn[1].InputParams)
	assert.Equal(t, "(string, error)", fnsAnn[1].ReturnValues)

	assert.Equal(t, "// FunctionWithoutParameters...", fnsAnn[2].Description)
	assert.Equal(t, "FunctionWithoutParameters", fnsAnn[2].Name)
	assert.Equal(t, "()", fnsAnn[2].InputParams)
	assert.Equal(t, "", fnsAnn[2].ReturnValues)

	assert.Equal(t, "// FunctionWithPointerReturnValue returns a simple pointer value.", fnsAnn[3].Description)
	assert.Equal(t, "FunctionWithPointerReturnValue", fnsAnn[3].Name)
	assert.Equal(t, "()", fnsAnn[3].InputParams)
	assert.Equal(t, "*Event", fnsAnn[3].ReturnValues)
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
