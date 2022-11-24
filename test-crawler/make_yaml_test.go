package main

import (
	"testing"
	c "testsuites/collector"

	y "gopkg.in/yaml.v2"

	"github.com/stretchr/testify/assert"

	"io/ioutil"
)

func TestMakeYAML(t *testing.T) {

	yaml := []c.FunctionAnnotation{
		{
			ID:           1,
			Name:         "SomeName",
			InputParams:  "(ctx context.Context, param Parameters)",
			ReturnValues: "error",
			Description:  "",
			Public:       true,
		},
		{
			ID:           2,
			Name:         "SomeName2",
			InputParams:  "(ctx context.Context, param2 Parameters2)",
			ReturnValues: "error",
			Description:  "",
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
