package mocks

import (
	"errors"
	"fmt"
	"time"
)

type Event struct {
	ID string `json:"id"`
}

func NewEvent() *Event {
	return &Event{
		ID: time.Now().String(),
	}
}

// HelloEvent simple method that just formats message.
func (e *Event) HelloEvent() string {
	return fmt.Sprintf("Simple HelloEvent")
}

// HelloEventWithParameter accepts one param that got formated in message.
func (e *Event) HelloEventWithParameter(param string) (string, error) {
	if param == "" {
		return "", errors.New("no param provided")
	}

	return fmt.Sprintf("HelloEventWithParameter: %v", param), nil
}

// FunctionWithoutParameters...
func (e *Event) FunctionWithoutParameters() {

}

// FunctionWithPointerReturnValue returns a simple pointer value.
func (e *Event) FunctionWithPointerReturnValue() *Event {
	return &Event{}
}
