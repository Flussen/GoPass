package models

type User struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	UserKey   string `json:"encryptedUserKey"`
	CreatedAt string `json:"created_at"`
}
