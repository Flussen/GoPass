package models

type Password struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Username    string `json:"username"`
	Pwd         string `json:"pwd"`
	Data        Data   `json:"data"`
	CreatedDate string `json:"created_date"`
}

type PasswordsContainer struct {
	Passwords []Password `json:"passwords"`
}

type Data struct {
	Favorite bool   `json:"favorite"`
	Group    string `json:"group"`
	Icon     string `json:"icon"`
	Status   string `json:"status"`
}
