package extractor

type Annotation string

const (
	Header   Annotation = "header"
	Func     Annotation = "func"
	Scenario Annotation = "scen"
	Unknown  Annotation = "unknown"
)

func TryParse(input string) (Annotation, error) {
	var ret Annotation = Unknown

	return ret, nil
}
