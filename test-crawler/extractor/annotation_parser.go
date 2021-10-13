package extractor

import (
	"errors"
	"fmt"
	"regexp"
)

type Parser struct{}

type Annotation string

const (
	Header   Annotation = "header"
	Func     Annotation = "func"
	Scenario Annotation = "scen"
	Unknown  Annotation = "unknown"
)

func (p *Parser) Parse(input string, annotation Annotation) (interface{}, error) {
	parsedType, err := tryParse(input)
	if err != nil {
		return nil, err
	}

	switch parsedType {
	case Header:
		{
			header, err := getHeaderInfo(input)
			if err != nil {
				return nil, err
			}
			return header, nil
		}
	case Func:
		{
			function, err := getFunctionInfo(input)
			if err != nil {
				return nil, err
			}
			return function, nil
		}
	}

	return nil, nil
}

func tryParse(input string) (Annotation, error) {
	var ret Annotation = Unknown

	reg := regexp.MustCompile("stm:([A-z+]);")

	match := reg.FindString(input)
	if len(match) < 1 {
		return ret, errors.New("failed to match regex")
	}

	ret = getType(match)
	if ret == Unknown {
		return ret, errors.New("unknown type")
	}

	return ret, nil
}

func getHeaderInfo(input string) (*HeaderType, error) {

	testType, err := findInStringByKey(input, "type")
	if err != nil {
		return nil, err
	}

	system, err := findInStringByKey(input, "system")
	if err != nil {
		return nil, err
	}

	ignore := false
	ignoreKey, _ := findInStringByKey(input, "ignore")
	if ignoreKey != "false" && len(ignoreKey) > 0 {
		ignore = true
	}

	return &HeaderType{
		TestType: testType,
		System:   system,
		Ignore:   ignore,
	}, nil
}

func getFunctionInfo(input string) (*FunctionType, error) {

	ignore := false
	ignoreKey, _ := findInStringByKey(input, "ignore")
	if ignoreKey != "false" && len(ignoreKey) > 0 {
		ignore = true
	}

	return &FunctionType{
		Ignore: ignore,
	}, nil
}

func findInStringByKey(input string, key string) (string, error) {
	reg := regexp.MustCompile(fmt.Sprintf("%s=([A-z]+);?"))

	match := reg.FindString(input)
	if len(match) < 1 {
		return "", errors.New(fmt.Sprintf("failed to find by key (%s)", key))
	}

	return match, nil
}

func getType(input string) Annotation {
	switch Annotation(input) {
	case Header, Func, Scenario:
		{
			return Annotation(input)
		}
	default:
		{
			return Unknown
		}
	}
}
