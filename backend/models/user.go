package models

import "time"

type User struct {
	ID           string    `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	Password     string    `json:"password"`
	CreatedAt    time.Time `json:"created_at"`
	SessionToken string    `json:"session_token"`
	TokenExpiry  time.Time `json:"token_expiry"`
}
