package request

import (
	"GoPass/backend/models"
)

type Card struct {
	Card         string          `json:"card"`
	Holder       string          `json:"holder"`
	Number       uint            `json:"number"`
	SecurityCode uint            `json:"security_code"`
	Month        int             `json:"month"`
	Year         int             `json:"year"`
	Settings     models.Settings `json:"settings"`
}
