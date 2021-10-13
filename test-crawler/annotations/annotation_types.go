package annotations

type HeaderType struct {
	TestType string `json:"test_type"`
	System   string `json:"system"`
	Ignore   bool   `json:"ignore"`
}

type FunctionType struct {
	Ignore bool `json:"ignore"`
}

type ScenarioType struct {
	Description string `json:"scenario_name"`
	Ignore      bool   `json:"ignore"`
}
