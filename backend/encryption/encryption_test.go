package encryption

import (
	"fmt"
	"math/rand"
	"testing"
	"time"
)

func generateKey(length int) string {
	rand.New(rand.NewSource(time.Now().Unix()))
	characters := "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	randomNumber := make([]byte, length)
	for i := 0; i < length; i++ {
		randomNumber[i] = characters[rand.Intn(len(characters))]
	}
	return string(randomNumber)
}

func TestEncrypt(t *testing.T) {
	originalPassword := "SecretPassword"
	userKey := generateKey(32)

	encryptPWD, err := EncryptPassword(originalPassword, userKey)
	if err != nil {
		t.Fatalf("EncryptionPassword failed: %v", err)
	}

	decryptPWD, err := DecryptPassword(encryptPWD, userKey)
	if err != nil {
		t.Fatalf("DecryptPassword failed: %v", err)
	}

	if decryptPWD != originalPassword {
		t.Errorf("Decrypted password does not match original. Got %s, want %s", decryptPWD, originalPassword)
	}

	fmt.Printf("Test passed - password %v, UserKey: %v", decryptPWD, userKey)
}
