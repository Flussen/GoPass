package models

type User struct {
	ID        string   `json:"id"`
	Account   string   `json:"account"`
	Email     string   `json:"email"`
	Password  string   `json:"passwords"`
	Card      []Card   `json:"cards"`
	UserKey   string   `json:"userKey"`
	Seeds     []string `json:"seeds"`
	Config    Config   `json:"config"`
	CreatedAt string   `json:"created_at"`
}

type Config struct {
	UI       string   `json:"ui"`
	Groups   []string `json:"groups"`
	Language string   `json:"language"`
}

type UserRequest struct {
	Account string `json:"account"`
	Email   string `json:"email"`
	Config  Config `json:"Preference"`
}
