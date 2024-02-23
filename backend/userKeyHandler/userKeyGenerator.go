package userkeyhandler

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateRandomUserKey(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
