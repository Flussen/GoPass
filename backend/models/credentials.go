package models

type Credentails struct {
	Account   string     `json:"account"`
	ID        string     `json:"id"`
	Cards     []Card     `json:"cards"`
	Passwords []Password `json:"passwords"`
}
