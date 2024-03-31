package request

import "GoPass/backend/models"

type Password struct {
	UserKey  string `json:"userKey"`
	Title    string `json:"title"`
	Username string `json:"username"`
	Password string `json:"password"`
	Settings models.Settings
}

type DeletePassword struct {
	Account string `json:"account"`
	ID      string `json:"id"`
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
