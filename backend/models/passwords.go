package models

import "time"

type Password struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Username  string    `json:"username"`
	Pwd       string    `json:"pwd"`
	Settings  Settings  `json:"settings"`
	CreatedAt time.Time `json:"created_at"`
}

type PasswordsContainer struct {
	Passwords []Password `json:"passwords"`
}

type Settings struct {
	Favorite bool   `json:"favorite"`
	Group    string `json:"group"`
	Icon     string `json:"icon"`
	Status   string `json:"status"`
}
