package annotations

type HeaderType struct {
	TestType string
	System   string
	Ignore   bool
}

type FunctionType struct {
	Ignore bool
}

type ScenarioType struct {
	Description string `json:"description"`
	Ignore      bool   `json:"ignore"`
}
