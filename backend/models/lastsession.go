package models

type LastSession struct {
	Username string `json:"username"`
	Token    string `json:"token"`
	UserKey  string `json:"userKey"`
}
