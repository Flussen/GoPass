package app

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

// Mock de la base de datos
type ILogin interface {
	Login(username, password string) (bool, error)
}

// Define un mock que cumpla con la interfaz AppInterface
type LoginMock struct {
	// Puedes agregar cualquier campo adicional necesario para el mock
}

// Implementa la función Login del mock
func (m *LoginMock) Login(username, password string) (bool, error) {
	// Define los resultados predefinidos para las llamadas a Login
	// Aquí puedes establecer los resultados que deseas que devuelva el mock para diferentes casos de prueba
	if username == "existingUser" && password == "correctPassword" {
		return true, nil
	} else {
		return false, errors.New("credenciales inválidas")
	}
}

func TestLoginWithMock(t *testing.T) {
	// Crea una instancia del mock
	mockApp := &LoginMock{}

	// Caso 1: Usuario y contraseña correctos
	loggedIn, err := mockApp.Login("existingUser", "correctPassword")
	assert.NoError(t, err)
	assert.True(t, loggedIn)

	// Caso 2: Usuario no encontrado
	loggedIn, err = mockApp.Login("nonexistentUser", "password")
	assert.Error(t, err)
	assert.False(t, loggedIn)

	// Caso 3: Contraseña incorrecta
	loggedIn, err = mockApp.Login("existingUser", "incorrectPassword")
	assert.Error(t, err)
	assert.False(t, loggedIn)

	// Caso 4: Usuario correcto, pero contraseña incorrecta
	loggedIn, err = mockApp.Login("existingUser", "incorrectPassword")
	assert.Error(t, err)
	assert.False(t, loggedIn)
}
