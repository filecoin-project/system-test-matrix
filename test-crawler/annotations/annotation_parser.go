package annotations

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
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
	case Scenario:
		{
			scenario, err := getScenarioInfo(input)
			if err != nil {
				return nil, err
			}
			return scenario, nil
		}
	}

	return nil, nil
}

func tryParse(input string) (Annotation, error) {
	var ret Annotation = Unknown

	reg := regexp.MustCompile("stm:([A-z]+);")

	match := reg.FindAllStringSubmatch(input, -1)
	if len(match) < 1 {
		return ret, errors.New("failed to match regex")
	}

	ret = getType(match[0][1])
	if ret == Unknown {
		return ret, errors.New("unknown type")
	}

	return ret, nil
}

func getHeaderInfo(input string) (*HeaderType, error) {

	testType := findInStringByKey(input, "type")

	system := findInStringByKey(input, "system")

	ignore := false
	ignoreKey := findInStringByKey(input, "ignore")
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
	ignoreKey := findInStringByKey(input, "ignore")
	if ignoreKey != "false" && len(ignoreKey) > 0 {
		ignore = true
	}

	return &FunctionType{
		Ignore: ignore,
	}, nil
}

func getScenarioInfo(input string) (*ScenarioType, error) {

	description := findInStringByKey(input, "desc")

	behaviors := findInStringByKey(input, "behaviors")

	behaviorArray := strings.Split(behaviors, ",")
	for i := range behaviorArray {
		behaviorArray[i] = strings.TrimSpace(behaviorArray[i])
	}

	ignore := false
	ignoreKey := findInStringByKey(input, "ignore")
	if ignoreKey != "false" && len(ignoreKey) > 0 {
		ignore = true
	}

	return &ScenarioType{
		Description: description,
		Behaviors:   behaviorArray,
		Ignore:      ignore,
	}, nil
}

func findInStringByKey(input string, key string) string {
	reg := regexp.MustCompile(fmt.Sprintf("%s=(([A-z0-9]+\\s?(,?\\s?)){1,});?", key))

	match := reg.FindAllStringSubmatch(input, -1)
	if len(match) < 1 {
		return ""
	}

	return match[0][1]
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
