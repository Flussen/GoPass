package app

import (
	"encoding/json"
	"log"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert" // Package for assertions in tests
)

type InfoPass struct {
	Status   string
	Password string
}

// # TestPassword is a test function for PasswordGenerator.
//
// Contains the password generation test and receiving the status,
// also test the length of the password,
// and check if the password has any of the requested special characters.
func Test_password_if_the_password_is_ok(t *testing.T) {
	length := 20 // Length of the password to generate
	specialCharacters := "!@#$%^&*()-_+=[]{};:,.<>?/|"
	containsSpecialCharacters := false

	// Generate a password and get its strength status
	pwd, err := NewApp().PasswordGenerator(length)
	if err != nil {
		panic("error in password")
	}

	var unpwd InfoPass
	err = json.Unmarshal([]byte(pwd), &unpwd)
	if err != nil {
		panic("error unmarshal")
	}

	// Assert notnil that the generated password and status are not nil
	if assert.NotNil(t, unpwd.Password, unpwd.Status) {
		log.Printf("TEST GENERATED: Password generated successfully, not null.\nPassword: %s\nstatus: %s", pwd, unpwd.Status)
	}
	// Assert len that if the length is 20
	if assert.Len(t, unpwd.Password, 20) {
		log.Printf("TEST LENGTH: Length is %v exactly", length)
	}

	// Assert true if the password contains at least one special character.
	for _, char := range specialCharacters {
		if strings.ContainsRune(unpwd.Password, char) {
			containsSpecialCharacters = true
			break
		}
	}
	if assert.True(t, containsSpecialCharacters) {
		log.Printf("TEST CONTAINS: The password contains at least one special character.")
	} else {
		log.Fatal("The password does not contain any special characters.")
	}
}
