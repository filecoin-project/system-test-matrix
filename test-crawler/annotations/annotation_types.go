package annotations

type HeaderType struct {
	TestType string `json:"test_type"`
	System   string `json:"system"`
	Ignore   bool   `json:"ignore"`
}
type ScenarioType struct {
	Behaviors []string `json:"behaviors"`
	Ignore    bool     `json:"ignore"`
}

type BehaviorType struct {
	Id     string `json:"behavior_id"`
	Tag    string `json:"behavior"`
	Ignore bool   `json:"ignore"`
}
