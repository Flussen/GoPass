package models

type Password struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Username    string   `json:"username"`
	Pwd         string   `json:"pwd"`
	Data        Settings `json:"settings"`
	CreatedDate string   `json:"created_date"`
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
