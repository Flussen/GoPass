package request

import "GoPass/backend/models"

type Password struct {
	Title    string          `json:"title"`
	Username string          `json:"username"`
	Pwd      string          `json:"pwd"`
	Settings models.Settings `json:"settings"`
}

type SimplePassword struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type CompletePassword struct {
	ID       string          `json:"id"`
	Title    string          `json:"title"`
	Username string          `json:"username"`
	Password string          `json:"password"`
	Data     models.Settings `json:"data"`
}
