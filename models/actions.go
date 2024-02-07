package models

import (
	"encoding/json"
	"errors"
	"fmt"

	"go.etcd.io/bbolt"
)

func CreateUser(db *bbolt.DB, user User) error {
	// Serializar el usuario a JSON
	userBytes, err := json.Marshal(user)
	if err != nil {
		return err
	}

	// Insertar/Actualizar el usuario en la base de datos
	return db.Update(func(tx *bbolt.Tx) error {
		// Asegurarse de que el bucket existe
		b, err := tx.CreateBucketIfNotExists([]byte("Users"))
		if err != nil {
			return err
		}

		// Usar el ID del usuario como clave para almacenar el valor serializado
		return b.Put([]byte(user.Username), userBytes)
	})
}

func GetUserByID(db *bbolt.DB, userID string) (*User, error) {
	var user User
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return nil // El bucket no existe
		}
		userBytes := b.Get([]byte(userID))
		if userBytes == nil {
			return nil // El usuario no existe
		}
		return json.Unmarshal(userBytes, &user)
	})
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func GetUserByUsername(db *bbolt.DB, username string) (*User, error) {
	var user User
	err := db.View(func(tx *bbolt.Tx) error {
		// Asume que los usuarios están almacenados en un bucket llamado "Users".
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("bucket de usuarios no encontrado")
		}

		// Asume que el nombre de usuario es la clave para buscar el usuario.
		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New("usuario no encontrado")
		}

		// Deserializa los bytes del usuario en la estructura User.
		if err := json.Unmarshal(userBytes, &user); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func CheckUserExists(db *bbolt.DB, username, email string) (exists bool, err error) {
	err = db.View(func(tx *bbolt.Tx) error {
		usersBucket := tx.Bucket([]byte("Users"))
		if usersBucket == nil {
			return nil // Considera un bucket vacío como no existente
		}

		// Busca por nombre de usuario
		userBytes := usersBucket.Get([]byte(username))
		if userBytes != nil {
			exists = true
			return nil
		}

		// Opcional: Buscar por email, requiere iterar si los emails no son claves
		c := usersBucket.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			var user User
			if err := json.Unmarshal(v, &user); err != nil {
				continue // o maneja el error
			}
			if user.Email == email {
				exists = true
				return nil
			}
		}

		return nil
	})

	return
}
func GetUserPasswords(db *bbolt.DB, userID string) (map[string]string, error) {
	passwords := make(map[string]string)

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(userID))
		if userBucket == nil {
			return fmt.Errorf("bucket not found")
		}

		return userBucket.ForEach(func(k, v []byte) error {
			passwords[string(k)] = string(v)
			return nil
		})
	})

	return passwords, err
}

func SavePassword(db *bbolt.DB, userID, service, password string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		userBucket, err := tx.CreateBucketIfNotExists([]byte(userID))
		if err != nil {
			return err
		}
		return userBucket.Put([]byte(service), []byte(password))
	})
}

func EnsureUserPasswordsBucket(db *bbolt.DB, userID string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists([]byte(userID))
		return err
	})
}

func DeletePass(db *bbolt.DB, userID, service string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		// Obtiene el bucket de contraseñas del usuario.
		userBucket := tx.Bucket([]byte(userID))
		if userBucket == nil {
			return fmt.Errorf("bucket not found for user %s", userID)
		}

		// Elimina la contraseña asociada al servicio.
		err := userBucket.Delete([]byte(service))
		if err != nil {
			return fmt.Errorf("failed to delete password for service %s: %v", service, err)
		}

		return nil
	})
}
