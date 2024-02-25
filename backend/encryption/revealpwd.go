package encryption

import (
	eh "GoPass/backend/errorHandler"
	"log"
)

func RevealPassword(encripterPassword, userKey string) (string, error) {
	decrypted, err := DecryptPassword(encripterPassword, userKey)
	if err != nil {
		log.Printf("Decryption failure: %v", err)
		return "", eh.NewGoPassErrorf("failted to decrypt password")
	}
	return decrypted, nil
}
