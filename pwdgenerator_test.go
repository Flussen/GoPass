package main

import (
	// Package for formatted I/O
	"log" // Package for logging
	"strings"
	"testing" // Package for testing

	"github.com/stretchr/testify/assert" // Package for assertions in tests
)

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
	pwd, status := NewApp().PasswordGenerator(length)

	// Assert notnil that the generated password and status are not nil
	if assert.NotNil(t, pwd, status) {
		log.Printf("TEST GENERATED: Password generated successfully, not null.\nPassword: %s\nstatus: %s", pwd, status)
	}
	// Assert len that if the length is 20
	if assert.Len(t, pwd, 20) {
		log.Printf("TEST LENGTH: Length is %v exactly", length)
	}

	// Assert true if the password contains at least one special character.
	for _, char := range specialCharacters {
		if strings.ContainsRune(pwd, char) {
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
