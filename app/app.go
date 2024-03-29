// Main app golang source by @Flussen - https://github.com/Flussen 🔧
//
// GoPass Manager project is under a GNU license to maintain the free code
// and intellectual protection of its creators so that it remains available to everyone. 🤖
// https://github.com/Flussen/GoPass?tab=GPL-3.0-1-ov-file

// Please consider giving us a star on github if you liked our work
// GoPass https://github.com/Flussen/GoPass ❤️

package app

import (
	// Package imports

	"GoPass/backend/auth"
	"GoPass/backend/controllers"
	database "GoPass/backend/db" // Importing a custom package, renamed for clarity
	"GoPass/backend/encryption"
	eh "GoPass/backend/errorHandler" // Error handler
	"GoPass/backend/models"          // Importing another custom package
	"GoPass/backend/sessiontoken"

	"encoding/json"
	"time"

	// Package for generating unique UUIDs
	"go.etcd.io/bbolt" // Package for handling Bolt databases
	// Package for password hashing
)

// App is an empty struct that will add the functions that will
// be added to main.go so that wails go compiles. This is the way to
// improve the abstraction of the program so that the program scales.
type App struct {
	DB *bbolt.DB
}

// NewApp create an instance for wails to work on in the main package and receive the app
func NewApp() *App {
	return &App{}
}

func NewAppWithDB(db *bbolt.DB) *App {
	return &App{DB: db}
}

/*
   ------------------------------------------------
   Do type function, that are exported in typescript so
   that specific things are done, such as registering, creating
   a login session, they generally perform actions that return
   verification or authentication data.

	->> DO type functions continue below <<--
   ------------------------------------------------
*/

// Login is called when the user clicks the login button
// Will perform various checks on the database bucket,
// if the bucket exists, if the user exists in the bucket,
// if the password is comparable to the hash
// it will also parse the data, decrypt the userKey stored in the database
// and generate a login token. (Expiry in 30 days)
func (a *App) DoLogin(username, password string) (string, error) {
	bytes, err := auth.Login(a.DB, username, password)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

// Register registers a new user with the given username, email, and password
func (a *App) DoRegister(username, email, password string) error {
	return auth.Register(a.DB, username, email, password)
}

// Saves a password for the given username and service
//
//	controllers.SavePassword(DB, username, userKey, service, password) // is the controller for Save the password
func (a *App) DoSaveUserPassword(user, usernameToSave, service, password, icon, status, userKey string) (string, error) {
	date := time.Now().Format(time.DateTime)
	id, err := controllers.SavePassword(a.DB, user, usernameToSave, service,
		password, icon, status, userKey, date)
	if err != nil {
		return "", err
	}
	return id, nil
}

// DeletePassword deletes a password saved in the database by the given username and service.
//
//	controllers.DeletePass(DB, username, service) // is the controller for delete the password in the database
func (a *App) DoDeleteUserPassword(username, id string) error {
	return controllers.DeletePass(a.DB, username, id)
}

func (a *App) DoUpdateUserPassword(username, userKey, id, newTitle, newUsername, newPwd string) error {
	newDate := time.Now().Format(time.DateTime)
	return controllers.UpdatePass(a.DB, username, id, userKey, newTitle, newPwd, newUsername, newDate)
}

// Change password for the user ACCOUNT!!
func (a *App) DoChangeAccountPassword(username, originalPwd, newPwd string) error {
	return controllers.ChangeUserPassword(a.DB, username, originalPwd, newPwd)
}

func (a *App) DoChangeAccountInfo(username, newUsername, newEmail string) error {
	panic("not implemented")
}

// logout system to clean the token and expirytime variable in the database
func (a *App) DoLogout() error {
	return sessiontoken.CleanSessionToken(a.DB)
}

/*
   ------------------------------------------------
	Get type functions, they work to receive a specific data,
	they can do decryption processes to receive that data
	but generally they only receive data to export it to the
	typescript frontend.

	->> GET type functions continue below <<--
   ------------------------------------------------
*/

func (a *App) GetUserInfo(username string) (string, error) {
	model, err := controllers.GetUserInfo(a.DB, username)
	if err != nil {
		eh.NewGoPassErrorf("ERROR: %v", err)
	}

	byteModel, err := json.Marshal(model)
	if err != nil {
		eh.NewGoPassErrorf("ERROR: %v", err)
	}
	return string(byteModel), nil
}

func (a *App) GetUserPasswordById(username, id string) (string, error) {
	json, err := controllers.UserPasswordByID(a.DB, username, id)
	if err != nil {
		return "", err
	}
	return string(json), nil
}

// Verifies the validity of a session token and return to the app
// true if the session is valid and false if the session invalid
//
//	components.VerifySessionToken(DB, token) // is the verificator
func (a *App) VerifyToken(token string) (bool, error) {
	valid, err := sessiontoken.VerifyToken(token)
	if err != nil {
		return false, err
	}

	if !valid {
		sessiontoken.CleanSessionToken(a.DB)
	}

	return valid, nil
}

// Retrieves the passwords of the user with the given username
//
//	components.VerifySessionToken(DB, token) // is the controller for get the user passwords
func (a *App) GetUserPasswords(username string) (string, error) {
	pwds, err := controllers.GetUserPasswords(a.DB, username)
	if err != nil {
		return "", err
	}
	container := models.PasswordsContainer{Passwords: pwds}
	jsonData, err := json.Marshal(container)
	if err != nil {
		return "", err
	}
	return string(jsonData), nil
}

// Shows the password by the userKey decryption method
//
//	encryption.RevealPassword(encryptedPassword, userKey) // It is the encryption controller
func (a *App) ShowPassword(username, id, userKey string) (string, error) {

	var dataPassword models.Password

	err := a.DB.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(username))
		if userBucket == nil {
			return eh.NewGoPassError(eh.ErrUserNotFound)
		}

		encryptedPasswordBytes := userBucket.Get([]byte(id))
		if encryptedPasswordBytes == nil {
			return eh.NewGoPassErrorf("password not found for %s", id)
		}
		// encryptedPassword = string(encryptedPasswordBytes)
		err := json.Unmarshal(encryptedPasswordBytes, &dataPassword)
		if err != nil {
			return eh.NewGoPassErrorf("error unmarshal in ShowPassword %v", err)
		}
		return nil
	})

	if err != nil {
		return "", err
	}

	decrypted, err := encryption.RevealPassword(dataPassword.Pwd, userKey)
	if err != nil {
		return "", err
	}

	return decrypted, nil
}

// ListUsers retrieves user information concurrently
//
//	controllers.GetUsersConcurrently(db, userIDs) // is the controller for get users simultaneously
func (a *App) GetListUsers() (string, error) {
	return controllers.GetUsersConcurrently(a.DB)
}

func (a *App) GetLastSession() (string, error) {

	var sessionBytes []byte

	a.DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("LastSessionSaved"))
		if b == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		sessionBytes = b.Get([]byte("lastsession"))
		if sessionBytes == nil {
			return eh.NewGoPassError("the last session is empty or was deleted, login again")
		}

		return nil
	})

	return string(sessionBytes), nil
}

// GetVersion returns the version of the application. Example 1.0.1
func (a *App) GetVersion() string {
	return "0.1 BETA - Rejewski"
}

/*
   ------------------------------------------------
	Test type functions, is only for testing the frontend
	get and return information.

	->> GET type functions continue below <<--
   ------------------------------------------------
*/

// Greet test for frontend development
func (a *App) TestGreet(username string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()
	return "Great!!", nil
}
