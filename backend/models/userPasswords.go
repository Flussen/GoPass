package models

type Password struct {
	Title       string `json:"title"`
	Id          string `json:"id"`
	Pwd         string `json:"pwd"`
	Username    string `json:"username"`
	CreatedDate string `json:"created_date"`
}

type PasswordsContainer struct {
	Passwords []Password `json:"passwords"`
}
