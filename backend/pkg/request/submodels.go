package request

import "GoPass/backend/models"

// without id
type passwordData struct {
	Title    string          `json:"title"`
	Username string          `json:"username"`
	Password string          `json:"password"`
	Data     models.Settings `json:"data"`
}
