package annotations

import (
	"errors"
	"fmt"
	"regexp"
)

type Parser struct{}

type Annotation string

const (
	Header   Annotation = "header"
	Behavior Annotation = "@"
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
	case Behavior:
		{
			behaviors, err := getBehaviorInfo(input)
			if err != nil {
				return nil, err
			}
			return behaviors, nil
		}
	}

	return nil, nil
}

func tryParse(input string) (Annotation, error) {
	var ret Annotation = Unknown

	reg := regexp.MustCompile(`stm: ?([A-z]+|@);?`)

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

func getBehaviorInfo(input string) ([]BehaviorType, error) {

	var behaviors []BehaviorType

	behaviorsTags := findBehaviorsFromString(input, "@")

	for _, tag := range behaviorsTags {
		behaviors = append(behaviors, BehaviorType{
			Id:     "",
			Tag:    tag,
			Ignore: false,
		})
	}

	return behaviors, nil
}

// func getScenarioInfo(input string) (*ScenarioType, error) {

// 	behaviors := findInStringByKey(input, "behaviors")

// 	behaviorArray := strings.Split(behaviors, ",")
// 	for i := range behaviorArray {
// 		behaviorArray[i] = strings.TrimSpace(behaviorArray[i])
// 	}

// 	ignore := false
// 	ignoreKey := findInStringByKey(input, "ignore")
// 	if ignoreKey != "false" && len(ignoreKey) > 0 {
// 		ignore = true
// 	}

// 	return &ScenarioType{
// 		Behaviors: behaviorArray,
// 		Ignore:    ignore,
// 	}, nil
// }

func findInStringByKey(input string, key string) string {
	reg := regexp.MustCompile(fmt.Sprintf("%s=(([A-z0-9]+\\s?(,?\\s?)){1,});?", key))

	match := reg.FindAllStringSubmatch(input, -1)
	if len(match) < 1 {
		return ""
	}

	return match[0][1]
}

func findBehaviorsFromString(input string, key string) []string {
	reg := regexp.MustCompile(fmt.Sprintf("%s([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)", key))

	match := reg.FindAllStringSubmatch(input, -1)
	if len(match) < 1 {
		return nil
	}

	behaviors := []string{}

	for i := 1; i < len(match[0]); i++ {
		behaviors = append(behaviors, match[0][i])
	}

	return behaviors
}

func getType(input string) Annotation {
	switch Annotation(input) {
	case Header, Behavior:
		{
			return Annotation(input)
		}
	default:
		{
			return Unknown
		}
	}
}
