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

type Repository struct {
	Name        []string `yaml:",flow"`
	Origin      []string `yaml:",flow"`
	Mode        string   `yaml:"mode"`
	Destination string   `yaml:"destination"`
}

type Config struct {
	Repo       Repository `yaml:"repository"`
	OutputMode OutputMode `yaml:"output"`
	Language   string     `yaml:"lang_mode"`
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
		Repo: Repository{
			Name:        []string{},
			Origin:      []string{},
			Mode:        "local",
			Destination: "_local",
		},
		OutputMode: "stdout",
		Language:   "auto",
	}
}
