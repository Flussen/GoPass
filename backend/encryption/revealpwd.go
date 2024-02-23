package encryption

import (
	"fmt"
	"log"
)

func RevealPassword(encripterPassword, userKey string) (string, error) {
	decrypted, err := DecryptPassword(encripterPassword, userKey)
	if err != nil {
		log.Printf("Decryption failure: %v", err)
		return "", fmt.Errorf("failted to decrypt password")
	}
	return decrypted, nil
}
