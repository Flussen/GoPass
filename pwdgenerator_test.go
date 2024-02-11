package main

import (
	"fmt"
	"log"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPassword(t *testing.T) {
	length := 20 // length of the password to generate
	pwd, status := NewApp().PasswordGenerator(length)

	if assert.NotNil(t, pwd, status) {
		log.Println("Password generated, not nil")
		fmt.Print(pwd, status)
	}
}
