package main

import (
	"fmt"     // Package for formatted I/O
	"log"     // Package for logging
	"testing" // Package for testing

	"github.com/stretchr/testify/assert" // Package for assertions in tests
)

// TestPassword is a test function for PasswordGenerator
func TestPassword(t *testing.T) {
	length := 20 // Length of the password to generate

	// Generate a password and get its strength status
	pwd, status := NewApp().PasswordGenerator(length)

	// Assert that the generated password and status are not nil
	if assert.NotNil(t, pwd, status) {
		log.Println("Password generated, not nil")
		fmt.Print(pwd, status) // Print the generated password and its status
	}
}
