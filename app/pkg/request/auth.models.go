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
