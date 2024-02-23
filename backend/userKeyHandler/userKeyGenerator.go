package userkeyhandler

import (
	"math/rand"
	"time"
)

func GenerateRandomUserKey(length int) string {
	rand.New(rand.NewSource(time.Now().Unix()))
	characters := "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	randomNumber := make([]byte, length)
	for i := 0; i < length; i++ {
		randomNumber[i] = characters[rand.Intn(len(characters))]
	}
	return string(randomNumber)
}
