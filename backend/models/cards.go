package models

import (
	"time"
)

type Card struct {
	ID           string    `json:"id"`
	Card         string    `json:"card"`
	Holder       string    `json:"holder"`
	Number       uint      `json:"number"`
	Expiry       time.Time `json:"expiry"`
	SecurityCode uint      `json:"security_code"`
	Settings     Settings  `json:"settings"`
}
