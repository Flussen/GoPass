package models

import (
	"GoPass/backend/encryption"
	"encoding/json" // Package for JSON encoding and decoding
	"errors"        // Package for errors
	"fmt"           // Package for formatted I/O
	"log"           // Package for logging
	"sync"          // Package for synchronization

	"go.etcd.io/bbolt"           // Package for handling Bolt databases
	"golang.org/x/crypto/bcrypt" // Package for password hashing
)

// CreateUser serializes the user to JSON and inserts/updates it in the database
func CreateUser(db *bbolt.DB, user User) error {
	// Serialize the user to JSON
	userBytes, err := json.Marshal(user)
	if err != nil {
		return err
	}

	// Insert/update the user in the database
	return db.Update(func(tx *bbolt.Tx) error {
		// Ensure the bucket exists
		b, err := tx.CreateBucketIfNotExists([]byte("Users"))
		if err != nil {
			return err
		}

		// Use the user's ID as the key to store the serialized value
		return b.Put([]byte(user.Username), userBytes)
	})
}

// GetUserByID retrieves a user by its ID from the database
func GetUserByID(db *bbolt.DB, userID string) (*User, error) {
	var user User
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return nil // Bucket doesn't exist
		}
		userBytes := b.Get([]byte(userID))
		if userBytes == nil {
			return nil // User doesn't exist
		}
		return json.Unmarshal(userBytes, &user)
	})
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByUsername retrieves a user by its username from the database
func GetUserByUsername(db *bbolt.DB, username string) (*User, error) {
	var user User
	err := db.View(func(tx *bbolt.Tx) error {
		// Assume users are stored in a bucket named "Users".
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("users bucket not found")
		}

		// Assume username is the key to lookup the user.
		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New("user not found")
		}

		// Deserialize user bytes into User structure.
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

// GetUsersConcurrently retrieves user information concurrently
func GetUsersConcurrently(db *bbolt.DB, userIDs []string) ([]*User, error) {
	var users []*User
	var err error

	resultChan := make(chan *User)

	var wg sync.WaitGroup

	for _, userID := range userIDs {
		wg.Add(1)
		go func(id string) {
			user, err := GetUserByID(db, id)
			if err != nil {
				log.Printf("Error getting user with ID %s: %v", id, err)
			}
			resultChan <- user
		}(userID)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	for range userIDs {
		user := <-resultChan
		if user != nil {
			users = append(users, user)
		}
	}
	return users, err
}

// CheckUserExists checks if a user exists in the database by username or email
func CheckUserExists(db *bbolt.DB, username, email string) (exists bool, err error) {
	err = db.View(func(tx *bbolt.Tx) error {
		usersBucket := tx.Bucket([]byte("Users"))
		if usersBucket == nil {
			return nil // Consider an empty bucket as non-existent
		}

		// Search by username
		userBytes := usersBucket.Get([]byte(username))
		if userBytes != nil {
			exists = true
			return nil
		}

		// Optional: Search by email, requires iterating if emails are not keys
		c := usersBucket.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			var user User
			if err := json.Unmarshal(v, &user); err != nil {
				continue // or handle the error
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

// GetUserPasswords retrieves passwords of the user from the database
func GetUserPasswords(db *bbolt.DB, username string) (map[string]string, error) {
	passwords := make(map[string]string)

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(username))
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

func CheckPasswordForService(db *bbolt.DB, service, username, inputPassword string) (bool, error) {
	var storedHash []byte
	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(username))
		if userBucket == nil {
			return errors.New("bucket not found")
		}

		storedHash = userBucket.Get([]byte(service))
		if storedHash == nil {
			return errors.New("service not found")
		}

		return nil
	})

	if err != nil {
		return false, err
	}

	// Utiliza bcrypt para comparar la contraseña proporcionada con el hash almacenado.
	err = bcrypt.CompareHashAndPassword(storedHash, []byte(inputPassword))
	if err != nil {
		// Si hay un error (lo que significa que las contraseñas no coinciden), devuelve false.
		return false, nil
	}

	// Si llegamos aquí, significa que la contraseña coincide con el hash.
	return true, nil
}

// CheckPasswordHash compares a password with its hashed value
func CheckPasswordHash(password, hash string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err
}

// SavePassword saves a password for the user in the database
func SavePassword(db *bbolt.DB, userID, service, password, userKey string) error {

	encryptedPassword, err := encryption.EncryptPassword(password, userKey)
	if err != nil {
		log.Println("Encription failure", err)
		return err
	}

	return db.Update(func(tx *bbolt.Tx) error {
		userBucket, err := tx.CreateBucketIfNotExists([]byte(userID))
		if err != nil {
			return err
		}

		return userBucket.Put([]byte(service), []byte(encryptedPassword))
	})
}

func RevealPassword(encripterPassword, userKey string) (string, error) {
	decrypted, err := encryption.DecryptPassword(encripterPassword, userKey)
	if err != nil {
		log.Printf("Decryption failure: %v", err)
		return "", fmt.Errorf("failted to decrypt password")
	}
	return decrypted, nil
}

// DeletePass deletes a password for the user from the database
func DeletePass(db *bbolt.DB, userID, service string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		// Get the user's password bucket
		userBucket := tx.Bucket([]byte(userID))
		if userBucket == nil {
			return fmt.Errorf("bucket not found for user %s", userID)
		}

		// Delete the password associated with the service
		err := userBucket.Delete([]byte(service))
		if err != nil {
			return fmt.Errorf("failed to delete password for service %s: %v", service, err)
		}

		return nil
	})
}
