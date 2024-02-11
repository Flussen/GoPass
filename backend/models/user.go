package models

type User struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	Password     string `json:"password"`
	CreatedAt    string `json:"created_at"`
	SessionToken string `json:"session_token"`
	TokenExpiry  string `json:"token_expiry"`
}
