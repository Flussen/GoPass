package models

type User struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	UserKey   string `json:"encryptedUserKey"`
	Config    Config `json:"Preference"`
	CreatedAt string `json:"created_at"`
}

type Config struct {
	UI     string   `json:"ui"`
	Groups []string `json:"groups"`
}
