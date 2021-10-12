package extractor

import (
	"regexp"
)

type Annotation string

const (
	Header   Annotation = "header"
	Func     Annotation = "func"
	Scenario Annotation = "scen"
	Unknown  Annotation = "unknown"
)

func TryParse(input string) (Annotation, error) {
	var ret Annotation = Unknown

	reg := regexp.MustCompile("stm:([A-z+]);")

	match := reg.FindString(input)

	AnnotationType := GetType(match)

	return ret, nil
}

func GetType(input string) Annotation {
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
