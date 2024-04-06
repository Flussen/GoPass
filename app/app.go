// Main app golang source by @Flussen - https://github.com/Flussen 🔧
//
// GoPass Manager project is under a GNU license to maintain the free code
// and intellectual protection of its creators so that it remains available to everyone. 🤖
// https://github.com/Flussen/GoPass?tab=GPL-3.0-1-ov-file

// Please consider giving us a star on github if you liked our work
// GoPass https://github.com/Flussen/GoPass ❤️

package app

import (
	"GoPass/backend/auth"
	"GoPass/backend/credentials/actions/export"
	"GoPass/backend/credentials/cards"
	"GoPass/backend/credentials/passwords"
	database "GoPass/backend/db" // Importing a custom package, renamed for clarity
	"GoPass/backend/encryption"  // Error handler
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"GoPass/backend/pkg/response"
	"GoPass/backend/profile"
	"GoPass/backend/recovery"
	"GoPass/backend/sessiontoken"
	"context"

	"go.etcd.io/bbolt"
)

// App is an empty struct that will add the functions that will
// be added to main.go so that wails go compiles. This is the way to
// improve the abstraction of the program so that the program scales.
type App struct {
	DB  *bbolt.DB
	ctx context.Context
}

// NewApp create an instance for wails to work on in the main package and receive the app
func NewApp() *App {
	return &App{}
}

func NewAppWithDB(db *bbolt.DB) *App {
	return &App{DB: db}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

/*
   ----------------------Auth----------------------
  	Functions for authentication flow, registration,
	exiting sessions. They start with Do.
   ------------------------------------------------
*/

// Register registers a new user with the given username, email, and password
func (a *App) DoRegister(request request.Register) (response.Register, error) {
	return auth.Register(a.DB, request.Account, request.Email, request.Password, request.Configs)
}

// verifies the user's credentials and if they are correct it will create a
// token and save in lastsession, a token that is only valid for 30 days
func (a *App) DoLogin(request request.Login) (response.Login, error) {
	rsp, err := auth.Login(a.DB, request.Account, request.Password)
	if err != nil {
		return response.Login{}, err
	}

	return rsp, nil
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
func (a *App) DoNewPassword(account, userKey string, rqst request.Password) (string, error) {
	return passwords.NewPassword(a.DB, account, userKey, rqst)
}

// removes a password, which requires the user to whom that password belongs and the password id.
func (a *App) DoDeletePassword(username, id string) error {
	return passwords.DeletePassword(a.DB, username, id)
}

func (a *App) DoUpdatePassword(account, id, userKey string, rqst request.Password) error {
	return passwords.UpdatePassword(a.DB, account, id, userKey, rqst)
}

func (a *App) DoSetPasswordSettings(account, id string, data models.Settings) error {
	return passwords.SetPasswordSettings(a.DB, account, id, data)
}

func (a *App) GetPasswordById(account, id string) (models.Password, error) {
	return passwords.GetPasswordByID(a.DB, account, id)
}

// Get all passwords by a account
func (a *App) GetAllPasswords(account string) ([]models.Password, error) {
	return passwords.GetAllPasswords(a.DB, account)
}

/*
   -------------------Cards--------------------
	Cards functions
   ------------------------------------------------
*/

func (a *App) GetAllCards(account string) ([]models.Card, error) {
	return cards.GetAllCards(a.DB, account)
}

func (a *App) GetCardById(account, id string) (models.Card, error) {
	return cards.GetCardById(a.DB, account, id)
}

func (a *App) DoNewCard(account string, card request.Card) (string, error) {
	return cards.NewCard(a.DB, account, card)
}

func (a *App) UpdateCard(account, id string, request request.Card) error {
	return cards.UpdateCard(a.DB, account, id, request)
}

func (a *App) DeleteCard(account, id string) error {
	return cards.DeleteCard(a.DB, account, id)
}

/*
   --------------------Account---------------------
  	User management with account, update, information.
   ------------------------------------------------
*/

// Change password for the user ACCOUNT!!
func (a *App) DoChangeAccountPassword(username, originalPwd, newPwd string) error {
	return profile.ChangeAccountPassword(a.DB, username, originalPwd, newPwd)
}

func (a *App) DoChangeAccountInfo(username string, newModel models.UserRequest) error {
	return profile.UpdateProfile(a.DB, username, newModel)
}

func (a *App) GetAccountInfo(account string) (models.User, error) {
	return profile.GetAccountInfo(a.DB, account)
}

/*
   -------------------Groups--------------------
	Groups
   ------------------------------------------------
*/

func (a *App) DoNewGroup(account string, groups []string) error {
	return profile.NewGroup(a.DB, account, groups)
}

func (a *App) DeleteGroup(account, group string) error {
	return profile.DeleteGroup(a.DB, account, group)
}

func (a *App) GetGroups(account string) ([]string, error) {
	return profile.GetGroups(a.DB, account)
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
	return sessiontoken.VerifyToken(a.DB, token)
}

func (a *App) GetLastSession() (models.LastSession, error) {
	return sessiontoken.GetSession(a.DB)
}

/*
   ------------------Cryptography------------------
  	Functions of the encryption and decryption system.
   ------------------------------------------------
*/

// Shows the password by the userKey decryption method
func (a *App) PasswordDecrypt(account, userKey, id string) (string, error) {
	return encryption.RevealPassword(a.DB, account, userKey, id)
}

/*
   ----------------General purposes----------------
  	General, extra or purposes that do not fit into
	their own category.
   ------------------------------------------------
*/

// ListUsers retrieves user information concurrently
func (a *App) GetListAccounts() ([]models.User, error) {
	return profile.GetUsersConcurrently(a.DB)
}

// GetVersion returns the version of the application. Example 1.0.1
func (a *App) GetVersion() string {
	return "0.1.3 BETA - Rejewski"
}

func (a *App) DoExport(account string, rqst request.Export) error {
	return export.Export(a.DB, account, rqst)
}

// -----------------> TEST's <-----------------

// Greet test for frontend development
func (a *App) TestGreet(username string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()
	return "Great!!", nil
}
