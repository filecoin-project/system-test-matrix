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
	Paths      []string   `yaml:"paths"`
	OutputMode OutputMode `yaml:"output"`
	OutputDir  string     `yaml:"output_dir"`
	Language   string     `yaml:"lang_mode"`
	IndentJSON bool       `yaml:"indent_json"`
	Ignore     []string   `yaml:"ignore"`
	SingleFile string     `yaml:"single_file"`
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
		Paths:      []string{"_modules/lotus"},
		OutputMode: "stdout",
		Language:   "auto",
		IndentJSON: false,
	}
}
