package main

import (
	"io"
	"os"

	"gopkg.in/yaml.v2"
)

type OutputMode string

const (
	MODE_STDOUT OutputMode = "stdout"
	MODE_FILE   OutputMode = "file"
)

type Config struct {
	TestCrawlerPaths      []string   `yaml:"test_crawler_paths"`
	TestCrawlerOutputMode OutputMode `yaml:"test_crawler_output"`
	TestCrawlerOutputDir  string     `yaml:"test_crawler_output_dir"`
	TestCrawlerLanguage   string     `yaml:"test_crawler_lang_mode"`
	TestCrawlerIndentJSON bool       `yaml:"test_crawler_indent_json"`
	TestCrawlerIgnore     []string   `yaml:"test_crawler_ignore"`

	BehaviorGenPaths     []string `yaml:"behavior_gen_paths"`
	BehaviorGenIgnore    []string `yaml:"behavior_gen_ignore"`
	BehaviorGenOutputDir string   `yaml:"behavior_gen_output_dir"`
}

const filename string = "config.yaml"

func NewConfig() Config {

	file, err := os.Open(filename)
	if err != nil {
		return Default()
	}
	defer file.Close()

	config := Config{}

	content, err := io.ReadAll(file)
	if err != nil {
		return Default()
	}

	err = yaml.Unmarshal([]byte(content), &config)
	if err != nil {
		return Default()
	}

	return config
}

func Default() Config {
	return Config{
		TestCrawlerPaths:      []string{"_modules/lotus"},
		TestCrawlerOutputMode: "stdout",
		TestCrawlerLanguage:   "auto",
		TestCrawlerIndentJSON: false,
	}
}
