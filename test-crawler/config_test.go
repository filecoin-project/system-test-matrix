package main

import (
	"io/ioutil"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
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

	yamlFile := "config_test.yaml"
	configBytes, err := yaml.Marshal(&cfg)
	assert.NoError(t, err)

	assert.NoError(t, ioutil.WriteFile(yamlFile, configBytes, 0644))

	var configFromFile Config
	fileContent, err := ioutil.ReadFile(yamlFile)
	assert.NoError(t, err)

	err = yaml.Unmarshal(fileContent, &configFromFile)
	assert.NoError(t, err)

	assert.Equal(t, cfg, configFromFile)
	os.Remove(yamlFile)
}
