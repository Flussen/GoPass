package response

type Register struct {
	ID      string   `json:"id"`
	Account string   `json:"account"`
	Seeds   []string `json:"seeds"`
}
