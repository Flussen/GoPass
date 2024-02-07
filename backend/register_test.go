package app

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

type IRegister interface {
	Register(username, email, password string) (bool, error)
}

type RegisterMock struct {
}

func (m *RegisterMock) Register(username, email, password string) (bool, error) {
	if username == "correctUser" && email == "correctEmail" && password == "correctPassword" {
		return true, nil
	} else {
		return false, errors.New("credenciales inválidas")
	}
}

func TestRegisterWithMock(t *testing.T) {
	// Crea una instancia del mock
	mockApp := &RegisterMock{}

	// Caso 1: Registro exitoso con credenciales válidas
	registered, err := mockApp.Register("correctUser", "correctEmail", "correctPassword")
	assert.NoError(t, err)
	assert.True(t, registered)

	// Caso 2: Usuario o correo electrónico ya existen
	registered, err = mockApp.Register("existingUser", "existing@example.com", "existingPassword")
	assert.Error(t, err)
	assert.False(t, registered)

	// Caso 3: Credenciales inválidas (usuario vacío)
	registered, err = mockApp.Register("", "invalid@example.com", "invalidPassword")
	assert.Error(t, err)
	assert.False(t, registered)

	// Caso 4: Credenciales inválidas (contraseña vacía)
	registered, err = mockApp.Register("invalidUser", "invalid@example.com", "")
	assert.Error(t, err)
	assert.False(t, registered)
}
