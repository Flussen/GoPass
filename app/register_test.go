package app

import "testing"

func TestDoRegister(t *testing.T) {
	db, cleanup := createTestDB(t)
	defer cleanup()

	app := &App{DB: db} // Asume que tu estructura App puede recibir db como argumento

	// Realiza una llamada a DoRegister con datos de prueba
	success, err := app.DoRegister("testuser", "test@example.com", "password123")
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}
	if !success {
		t.Errorf("DoRegister was not successful")
	}

	// Aquí podrías querer verificar si el usuario realmente se creó,
	// buscando en la base de datos, si tu función CreateUser retorna alguna forma de confirmación.
}
