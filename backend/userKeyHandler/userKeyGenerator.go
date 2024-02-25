package userkeyhandler

import (
	"math/rand"
	"time"
)

// This generate a new UserKey, is not for user account password or user password!!
func GenerateRandomUserKey(length int) string {
	rand.New(rand.NewSource(time.Now().Unix()))
	characters := "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	randomNumber := make([]byte, length)
	for i := 0; i < length; i++ {
		randomNumber[i] = characters[rand.Intn(len(characters))]
	}
	return string(randomNumber)
}
