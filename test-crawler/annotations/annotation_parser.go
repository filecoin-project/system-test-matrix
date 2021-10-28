package annotations

import (
	"errors"
	"fmt"
	"regexp"
)

type Parser struct{}

type Annotation string

const (
	Header   Annotation = "#"
	Behavior Annotation = "@"
	Ignore   Annotation = "ignore"
	Unknown  Annotation = "unknown"
)

func (p *Parser) Parse(input string) (interface{}, Annotation, error) {
	parsedType, err := tryParse(input)
	if err != nil {
		return nil, Unknown, err
	}

	switch parsedType {
	case Header:
		{
			header, err := getHeaderInfo(input)
			if err != nil {
				return nil, Unknown, err
			}
			return header, Header, nil
		}
	case Behavior:
		{
			behaviors, err := getBehaviorInfo(input)
			if err != nil {
				return nil, Unknown, err
			}
			return behaviors, Behavior, nil
		}
	case Ignore:
		{
			return true, Ignore, nil
		}
	}

	return nil, Unknown, nil
}

func tryParse(input string) (Annotation, error) {
	var ret Annotation = Unknown

	reg := regexp.MustCompile(`stm: ?([A-z]+|@|#);?`)

	match := reg.FindAllStringSubmatch(input, -1)
	if len(match) < 1 {
		return ret, errors.New("failed to match regex")
	}

	ret = getTypeFromString(match[0][1])
	if ret == Unknown {
		return ret, errors.New("unknown type")
	}

	return ret, nil
}

func getHeaderInfo(input string) (*HeaderType, error) {

	testType := findItemBySymbol(input, "#")

	return &HeaderType{
		TestType: testType[0],
	}, nil
}

func getBehaviorInfo(input string) ([]BehaviorType, error) {

	var behaviors []BehaviorType

	behaviorsTags := findItemBySymbol(input, "@")

	for _, tag := range behaviorsTags {
		behaviors = append(behaviors, BehaviorType{
			// Id is calculated later
			Id:     "",
			Tag:    tag,
			Ignore: false,
		})
	}

	return behaviors, nil
}

/**** Not needed anymore but might be useful in the future ****
func findInStringByKey(input string, key string) string {
	reg := regexp.MustCompile(fmt.Sprintf("%s=(([A-z0-9]+\\s?(,?\\s?)){1,});?", key))

	match := reg.FindAllStringSubmatch(input, -1)
	if len(match) < 1 {
		return ""
	}

	return match[0][1]
}
*/

func findItemBySymbol(input string, key string) []string {
	reg := regexp.MustCompile(fmt.Sprintf("%s([a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*)", key))

	match := reg.FindAllStringSubmatch(input, -1)
	if len(match) < 1 {
		return nil
	}

	behaviors := []string{}

	for i := 0; i < len(match); i++ {
		behaviors = append(behaviors, match[i][1])
	}

	return behaviors
}

func getTypeFromString(input string) Annotation {
	switch Annotation(input) {
	case Header, Behavior, Ignore:
		{
			return Annotation(input)
		}
	default:
		{
			return Unknown
		}
	}
}
