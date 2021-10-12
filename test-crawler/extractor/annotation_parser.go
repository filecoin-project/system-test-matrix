package extractor

import (
	"errors"
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

func (p *Parser) Parse(input string) {
	tryParse(input)
}
