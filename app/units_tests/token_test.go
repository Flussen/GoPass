package units_tests

import (
	"testing"
)

// func Test_token_verification(t *testing.T) {
// 	assert := assert.New(t)
// 	db, cleanup := CreateTestDB()
// 	defer cleanup()

// 	app := &app.App{DB: db}

// 	const (
// 		userTest  string = "User"
// 		emailTest string = "email@hotmail.com"
// 		passTest  string = "password"
// 	)

// 	// Register process
// 	err := app.DoRegister(userTest, emailTest, passTest)
// 	if err != nil {
// 		t.Fatalf("DoRegister failed: %v", err)
// 	}

// 	// Login process
// 	js, err := app.DoLogin(userTest, passTest)
// 	if err != nil {
// 		t.Fatalf("DoLogin failed: %v", err)
// 	}
// 	var userdata models.Receive

// 	err = json.Unmarshal([]byte(js), &userdata)
// 	if err != nil {
// 		t.Fatalf("json.Unmarshal failed: %v", err)
// 	}

// 	tokenexpired, err := sessiontoken.CreateNewTokenExpired("idrandom", userTest)
// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	tests := []struct {
// 		name        string
// 		ttoken      string
// 		expectErr   bool
// 		expectValid bool
// 		checkData   bool
// 	}{
// 		{
// 			"correct token",
// 			userdata.Token,
// 			false,
// 			true,
// 			false,
// 		},
// 		{
// 			"incorrect token",
// 			`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
// 			eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTcxMDk1Mjk1MywiZXhwIjoxNzEwOTU2NTUzfQ.
// 			wJIPnRRooR9i690fDda3sLu6WueiMiWjOy-LCbsKZJo`,
// 			true,
// 			false,
// 			false,
// 		},
// 		{
// 			"data payload changed",
// 			`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
// 			eyJleHAiOjE3MTM1NDQwNTksImlkIjoiY2hhbmdlZCIsInVzZXJuYW1lIjoiVXNlciJ9.
// 			PTY_dc6JKjBx81FbRVvAE_M6xEtWQ8MSDs5VfAuI0GQ`,
// 			true,
// 			false,
// 			false,
// 		},
// 		{
// 			"incorrect HEADER",
// 			`eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.
// 			eyJleHAiOjE3MTM1NDQwNTksImlkIjoiYTA0NWYwNTQtNTg3ZS00NDY4LWE0OTAtNGM3MDNhMDgzYmUyIiwidXNlcm5hbWUiOiJVc2VyIn0.
// 			j_N5irjrqT9E1-0Y8l94H0S03Y-n1Y46OAJeZ-qoKedtTmxI8sLa4OXQThmtrAFEs0d87FVx0A6EB_Yi5nONKA`,
// 			true,
// 			false,
// 			false,
// 		},
// 		{
// 			"expired token",
// 			tokenexpired,
// 			true,
// 			false,
// 			false,
// 		},
// 		{
// 			"correct token and data is correct",
// 			userdata.Token,
// 			false,
// 			true,
// 			true,
// 		},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			ok, err := app.VerifyToken(tt.ttoken)

// 			if tt.expectErr {
// 				assert.NotNil(err)
// 				assert.False(ok)
// 			} else {
// 				assert.Nil(err)
// 			}
// 			if tt.expectValid {
// 				assert.True(ok)
// 			} else {
// 				assert.False(ok)
// 			}

// 			if err == nil && tt.checkData && ok {
// 				bytes, err := sessiontoken.ReturnTokenContent(tt.ttoken)
// 				if err != nil {
// 					t.Fatal(err)
// 				}

// 				type dataReceived struct {
// 					ID       string
// 					Username string
// 					Exp      int
// 				}

// 				var datareceived dataReceived
// 				json.Unmarshal(bytes, &datareceived)

// 				assert.Equal(userTest, datareceived.Username, "the result must be equal to the registered username")
// 				assert.IsType("", datareceived.ID, "the result must be a string")
// 				assert.IsType(0, datareceived.Exp, "the result must be a number (int)")
// 			}
// 		})
// 	}
// }

func Test_get_last_session_saved(t *testing.T) {
	//TO DO
}
