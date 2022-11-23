package main

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExtractPublicMethodsFromFile(t *testing.T) {
	fnsAnn, err := extractPublicMethodsFromFile(context.Background(), "./mocks/event.go")
	if err != nil {
		t.Errorf("got error: %v", err.Error())
	}

	if len(fnsAnn) != 2 {
		t.Errorf("got %q, expected %q methods", len(fnsAnn), 2)
	}

	assert.Equal(t, "HelloEvent", fnsAnn[0].Name)
	assert.Equal(t, "()", fnsAnn[0].InputParams)      // input param
	assert.Equal(t, "string", fnsAnn[0].ReturnValues) // return param

	assert.Equal(t, "HelloEventWithParameter", fnsAnn[1].Name)
	assert.Equal(t, "(param string)", fnsAnn[1].InputParams)
	assert.Equal(t, "(string, error)", fnsAnn[1].ReturnValues)
}
