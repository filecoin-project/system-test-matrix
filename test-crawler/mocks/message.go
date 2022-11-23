package mocks

type Message struct {
	Text string
}

func NewMessage() *Message {
	return &Message{}
}

func (m *Message) SendMessage(string) string {
	return m.Text
}

func (m *Message) ModifyMessage() *Message {
	m.Text = "Hello"
	return m
}
