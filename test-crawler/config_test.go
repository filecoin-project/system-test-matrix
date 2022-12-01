package main

import (
	"io/ioutil"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gopkg.in/yaml.v2"
)

func TestNewConfig(t *testing.T) {
	cfg := Config{
		TestCrawlerPaths:      []string{"a", "b"},
		TestCrawlerOutputMode: "stdout",
		TestCrawlerOutputDir:  "output",
		TestCrawlerLanguage:   "go",
		TestCrawlerIndentJSON: true,
		TestCrawlerIgnore:     []string{"extern"},

		BehaviorGenPaths:     []string{"c", "d"},
		BehaviorGenIgnore:    []string{".git"},
		BehaviorGenOutputDir: "output/catalogue",
	}

	f, err := ioutil.TempFile("", "config-test.yml")
	require.Nil(t, err)
	defer f.Close()
	defer os.Remove(f.Name())

	configBytes, err := yaml.Marshal(&cfg)
	assert.NoError(t, err)

	assert.NoError(t, ioutil.WriteFile(f.Name(), configBytes, 0644))

	var configFromFile Config
	fileContent, err := ioutil.ReadFile(f.Name())
	assert.NoError(t, err)

	err = yaml.Unmarshal(fileContent, &configFromFile)
	assert.NoError(t, err)

	assert.Equal(t, cfg, configFromFile)
}
