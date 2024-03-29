package request

import "GoPass/backend/models"

type Register struct {
	Account  string        `json:"account"`
	Email    string        `json:"email"`
	Password string        `json:"password"`
	Configs  models.Config `json:"configs"`
}

type Login struct {
	Account  string `json:"account"`
	Password string `json:"password"`
}

type SeedsCheck struct {
	Account string   `json:"account"`
	Seeds   []string `json:"seeds"`
}

type Recovery struct {
	Account     string `json:"account"`
	NewPassword string `json:"new_password"`
}
