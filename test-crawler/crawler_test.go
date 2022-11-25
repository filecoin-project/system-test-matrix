package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCrawlSingleFileForFunctions(t *testing.T) {
	fnsAnn, err := crawlSingleFileForFunctions("./mocks/event.go")
	if err != nil {
		t.Errorf("got error: %v", err.Error())
	}

	if len(fnsAnn) != 4 {
		t.Errorf("got %q, expected %q methods", len(fnsAnn), 2)
	}

	assert.Equal(t, "HelloEvent", fnsAnn[0].Name)
	assert.Equal(t, "()", fnsAnn[0].InputParams)      // input param
	assert.Equal(t, "string", fnsAnn[0].ReturnValues) // return param

	assert.Equal(t, "HelloEventWithParameter", fnsAnn[1].Name)
	assert.Equal(t, "(param string)", fnsAnn[1].InputParams)
	assert.Equal(t, "(string, error)", fnsAnn[1].ReturnValues)

	assert.Equal(t, "FunctionWithoutParameters", fnsAnn[2].Name)
	assert.Equal(t, "()", fnsAnn[2].InputParams)
	assert.Equal(t, "", fnsAnn[2].ReturnValues)

	assert.Equal(t, "FunctionWithPointerReturnValue", fnsAnn[3].Name)
	assert.Equal(t, "()", fnsAnn[3].InputParams)
	assert.Equal(t, "*Event", fnsAnn[3].ReturnValues)
}
