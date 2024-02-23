package app

// import (
// 	"GoPass/backend/models"
// 	"encoding/json"
// 	"log"
// 	"os"
// 	"testing"

// 	"go.etcd.io/bbolt"
// 	"golang.org/x/crypto/bcrypt"
// )

// in progress...
func LoginTest() {
	panic("this function is in progress...")
}

// // Mock de la base de datos y funciones necesarias para las pruebas
// func setupMockDB(t *testing.T) (*bbolt.DB, func()) {
// 	t.Helper() // Indica que esta es una función de ayuda

// 	// Crear un archivo temporal para la base de datos
// 	tempFile, err := os.CreateTemp("", "testdb-*.db")
// 	if err != nil {
// 		t.Fatalf("Failed to create temp file: %v", err)
// 	}
// 	log.Println("DB mock created successfully")
// 	tempFilePath := tempFile.Name()

// 	// Asegurarse de cerrar y eliminar el archivo temporal después de su uso
// 	cleanup := func() {
// 		tempFile.Close()
// 		os.Remove(tempFilePath)
// 		log.Println("DB mock removed successfully")
// 	}

// 	// Abrir la base de datos BBolt temporal
// 	db, err := bbolt.Open(tempFilePath, 0600, nil)
// 	if err != nil {
// 		t.Fatalf("Failed to open mock DB: %v", err)
// 		cleanup()
// 	}
// 	log.Println("DB mock opened successfully")

// 	return db, cleanup
// }

// func AddTestUser(db *bbolt.DB, username, password string) error {
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
// 	if err != nil {
// 		return err
// 	}

// 	newUser := models.User{
// 		Username: username,
// 		Password: string(hashedPassword),
// 		// Añade cualquier otro campo necesario para tu estructura User
// 	}

// 	userBytes, err := json.Marshal(newUser)
// 	if err != nil {
// 		return err
// 	}

// 	return db.Update(func(tx *bbolt.Tx) error {
// 		b, err := tx.CreateBucketIfNotExists([]byte("Users"))
// 		if err != nil {
// 			return err
// 		}
// 		return b.Put([]byte(username), userBytes)
// 	})
// }

// func TestLogin(t *testing.T) {
// 	db, cleanup := setupMockDB(t)
// 	defer cleanup()
// 	defer db.Close()

// 	app := NewApp()
// 	// app.SetDB(db)

// 	username := "testuser"
// 	password := "testpass"
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 4)
// 	if err != nil {
// 		t.Fatalf("Error hashing password: %v", err)
// 	}
// 	log.Println("password generated successfully")

// 	if err := insertTestUser(db, username, hashedPassword); err != nil {
// 		t.Fatalf("Failed to insert test user: %v", err)
// 	}

// 	log.Println("User inserted successfully")

// 	tests := []struct {
// 		name       string
// 		username   string
// 		password   string
// 		wantToken  bool
// 		wantErrMsg string
// 	}{
// 		{"LoginSuccessful", username, password, true, ""},
// 		{"LoginFailedWrongPassword", username, "wrongpass", false, "credenciales inválidas"},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			token, err := DoLogin(tt.username, tt.password)
// 			if (err != nil) != (tt.wantErrMsg != "") || (token == "" && tt.wantToken) {
// 				t.Errorf("Login() = %v, wantToken %v, error = %v, wantErrMsg %v", token, tt.wantToken, err, tt.wantErrMsg)
// 			}
// 		})
// 	}
// }

// func insertTestUser(db *bbolt.DB, username string, hashedPassword []byte) error {
// 	return db.Update(func(tx *bbolt.Tx) error {
// 		b, err := tx.CreateBucketIfNotExists([]byte("Users"))
// 		if err != nil {
// 			return err
// 		}
// 		log.Println("Bucket created")
// 		user := models.User{
// 			Username: username,
// 			Password: string(hashedPassword),
// 			// Completa con los demás campos necesarios
// 		}
// 		userBytes, err := json.Marshal(user)
// 		log.Println("User parsed")
// 		if err != nil {
// 			return err
// 		}
// 		log.Println("User bytes created")
// 		return b.Put([]byte(username), userBytes)
// 	})
// }
