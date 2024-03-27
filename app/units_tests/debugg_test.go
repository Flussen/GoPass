package units_tests

import (
	"GoPass/app"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"encoding/json"
	"fmt"
	"testing"
)

func TestXD(t *testing.T) {
	db, cleanup := CreateTestDB()
	defer cleanup()

	app := &app.App{DB: db}

	rqr := request.Register{
		Account:  "testUser",
		Email:    "mail@hotmail.com",
		Password: "passwordtest",
		Configs:  models.Config{},
	}

	// Register process
	rsp, err := app.DoRegister(rqr)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	rql := request.Login{
		Account:  "testUser",
		Password: "passwordtest",
	}

	// Login process
	js, err := app.DoLogin(rql)
	if err != nil {
		t.Fatalf("DoLogin failed: %v", err)
	}

	fmt.Println(rsp.Seeds)

	var rspLogin models.Receive

	err = json.Unmarshal([]byte(js), &rspLogin)
	if err != nil {
		t.Fatalf("json.Unmarshal failed: %v", err)
	}

	err = app.DoCheckSeeds(request.SeedsCheck{Account: rql.Account, Seeds: rsp.Seeds})
	if err != nil {
		t.Fatal(err)
	}

	err = app.DoRecovery(request.Recovery{Account: rql.Account, NewPassword: "newpassword!"})
	if err != nil {
		t.Fatal(err)
	}

	app.DoLogout()

	data, err := app.DoLogin(request.Login{Account: rql.Account, Password: "newpassword!"})
	if err != nil {
		t.Fatal(err)
	}

	err = json.Unmarshal([]byte(data), &rspLogin)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Println(rspLogin)
}
