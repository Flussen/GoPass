package units_tests

import (
	"GoPass/app"
	eh "GoPass/backend/errorHandler" // Error handler
	"GoPass/backend/models"

	"GoPass/backend/pkg/request"
	"fmt"
	"testing"
)

func TestPwd(t *testing.T) {
	db, cleanup := CreateTestDB()
	defer cleanup()

	app := &app.App{DB: db}

	// Register process
	rRegister := request.Register{
		Account:  "flussen",
		Email:    "mail@hotmail.com",
		Password: "admin",
		Configs:  models.Config{},
	}

	_, err := app.DoRegister(rRegister)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	rLogin := request.Login{
		Account:  "flussen",
		Password: "admin",
	}

	rspl, err := app.DoLogin(rLogin)
	if err != nil {
		t.Fatalf("DoLogin failed: %v", err)
	}

	// Passwords
	rPassword := request.Password{
		UserKey:  rspl.UserKey,
		Title:    "aws",
		Username: "flussen",
		Password: "passsuper",
		Settings: models.Settings{Favorite: true},
	}

	// rPassword2 := request.Password{
	// 	UserKey:  rspl.UserKey,
	// 	Title:    "facebook",
	// 	Username: "flussen",
	// 	Password: "facebook pass",
	// 	Settings: models.Settings{Favorite: false, Group: "social media"},
	// }

	id, err := app.DoSavePassword(rLogin.Account, rPassword)
	if err != nil {
		t.Fatal(err)
	}

	err = app.DoDeletePassword(rLogin.Account, id)
	if err != nil {
		t.Fatal(err)
	}

	// _, err = app.DoSavePassword(rLogin.Account, rPassword2)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	pwds, err := app.GetAllPasswords(rLogin.Account)
	if err != nil {
		if err == eh.ErrNotFound {
			fmt.Println(err)
			return
		}
		t.Fatal(err)
	}

	fmt.Println(pwds)
}
