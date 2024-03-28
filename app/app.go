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
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"GoPass/backend/pkg/response"
	"GoPass/backend/recovery"
	"GoPass/backend/sessiontoken"

	"encoding/json"
	"time"

	"go.etcd.io/bbolt"
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
   ----------------------Auth----------------------
  	Functions for authentication flow, registration,
	exiting sessions. They start with Do.
   ------------------------------------------------
*/

// Register registers a new user with the given username, email, and password
func (a *App) DoRegister(request request.Register) (response.Register, error) {
	if request.Account == "" || request.Email == "" ||
		request.Password == "" {
		return response.Register{}, eh.NewGoPassError(eh.ErrEmptyParameters)
	}
	return auth.Register(a.DB, request.Account, request.Email, request.Password, request.Configs)
}

// verifies the user's credentials and if they are correct it will create a
// token and save in lastsession, a token that is only valid for 30 days
func (a *App) DoLogin(request request.Login) (string, error) {
	bytes, err := auth.Login(a.DB, request.Account, request.Password)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

// logout system to clean the token and expirytime variable in the database
func (a *App) DoLogout() error {
	return sessiontoken.CleanSessionToken(a.DB)
}

func (a *App) DoCheckSeeds(request request.SeedsCheck) error {
	return recovery.CheckSeeds(a.DB, request.Account, request.Seeds)
}

func (a *App) DoRecovery(request request.Recovery) error {
	return auth.NewRecovery(a.DB, request.Account, request.NewPassword)
}

/*
   -------------------Passwords--------------------
  	In this section the operation of passwords is managed,
	the common CRUD for passwords is worked on.
   ------------------------------------------------
*/

// saves a password for the given username and service.
func (a *App) DoSavePassword(user, userKey, usernameToSave, title, password string, data models.Settings) (string, error) {
	date := time.Now().Format(time.DateTime)
	id, err := controllers.SavePassword(a.DB, user, userKey, usernameToSave, title, password, date, data)
	if err != nil {
		return "", err
	}
	return id, nil
}

// removes a password, which requires the user to whom that password belongs and the password id.
func (a *App) DoDeletePassword(username, id string) error {
	return controllers.DeletePassword(a.DB, username, id)
}

func (a *App) DoUpdatePassword(username, userKey, id, newTitle, newUsername, newPwd string) error {
	newDate := time.Now().Format(time.DateTime)
	return controllers.UpdatePassword(a.DB, username, id, userKey, newTitle, newPwd, newUsername, newDate)
}

func (a *App) DoSetPasswordSettings(id, user string, data models.Settings) error {
	return controllers.SetPasswordSettings(a.DB, id, user, data)
}

func (a *App) GetPasswordById(username, id string) (string, error) {
	json, err := controllers.GetPasswordByID(a.DB, username, id)
	if err != nil {
		return "", err
	}
	return string(json), nil
}

/*
   -------------------Cards--------------------

   ------------------------------------------------
*/

func (a *App) DoNewCard(account string, card request.Card) error {
	return nil
}

/*
   --------------------Account---------------------
  	User management with account, update, information.
   ------------------------------------------------
*/

// Change password for the user ACCOUNT!!
func (a *App) DoChangeAccountPassword(username, originalPwd, newPwd string) error {
	return controllers.ChangeUserPassword(a.DB, username, originalPwd, newPwd)
}

func (a *App) DoChangeAccountInfo(username string, newModel models.UserRequest) error {
	return controllers.UpdateProfile(a.DB, username, newModel)
}

func (a *App) GetAccountInfo(username string) (string, error) {
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

// Retrieves the passwords of the user with the given username
func (a *App) GetAccountPasswords(username string) (string, error) {
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

/*
   ---------------------Token----------------------
  	JWT management, generation, verification and general
	operation of the token system.
   ------------------------------------------------
*/

// Verifies the validity of a session token and return to the app
// true if the session is valid and false if the session invalid
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

/*
   ------------------Cryptography------------------
  	Functions of the encryption and decryption system.
   ------------------------------------------------
*/

// Shows the password by the userKey decryption method
func (a *App) PasswordDecrypt(username, id, userKey string) (string, error) {

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

/*
   ----------------General purposes----------------
  	General, extra or purposes that do not fit into
	their own category.
   ------------------------------------------------
*/

// ListUsers retrieves user information concurrently
func (a *App) GetListAccounts() (string, error) {
	return controllers.GetUsersConcurrently(a.DB)
}

// GetVersion returns the version of the application. Example 1.0.1
func (a *App) GetVersion() string {
	return "0.1.1 BETA - Rejewski"
}

// -----------------> TEST's <-----------------

// Greet test for frontend development
func (a *App) TestGreet(username string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()
	return "Great!!", nil
}
