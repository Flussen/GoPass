package units_tests

// import (
// 	"GoPass/app"
// 	"GoPass/backend/models"
// 	"encoding/json"
// 	"fmt"
// 	"testing"
// )

// func TestAsd(t *testing.T) {
// 	db, cleanup := CreateTestDB()
// 	defer cleanup()

// 	const (
// 		userTest  = "User"
// 		emailTest = "email@hotmail.com"
// 		passTest  = "password"
// 	)

// 	app := &app.App{DB: db}
// 	// Register process
// 	err := app.DoRegister(userTest, emailTest, passTest)
// 	if err != nil {
// 		t.Fatalf("DoRegister failed: %v", err)
// 	}

// 	app.DoLogin(userTest, passTest)

// 	data, err := app.GetLastSession()
// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	var lastsession models.LastSession
// 	json.Unmarshal([]byte(data), &lastsession)
// 	fmt.Println(lastsession)
// }
