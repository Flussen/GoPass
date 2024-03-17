package units_tests

import (
	"GoPass/app"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestSaveUserPassword verifies the functionality of the DoSaveUserPassword method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// registers a user, saves passwords for the user, retrieves them, and checks their validity.
// If any step of the process fails, the test fails with an error message.
func Test_save_user_password(t *testing.T) {
	assert := assert.New(t)
	db, cleanup := CreateTestDB()
	defer cleanup()

	app := &app.App{DB: db}

	const (
		userTest  = "User"
		emailTest = "email@hotmail.com"
		passTest  = "password"
	)

	// Register process
	_, err := app.DoRegister(userTest, emailTest, passTest)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	js, err := app.DoLogin(userTest, passTest)
	if err != nil {
		t.Fatalf("DoLogin failed: %v", err)
	}

	var userdata models.Receive

	err = json.Unmarshal([]byte(js), &userdata)
	if err != nil {
		t.Fatalf("json.Unmarshal failed: %v", err)
	}

	tests := []struct {
		name            string
		tuser           string
		tusernameToSave string
		tservice        string
		tpassword       string
		tuserKey        string
		expectedErr     bool
		checkData       bool
	}{
		{
			"correct test for save a new password",
			"User",
			"userTest1",
			"google",
			"superPassword",
			userdata.UserKey,
			false,
			false,
		},
		{
			"empty inputs",
			"User",
			"userTest2",
			"",
			"",
			userdata.UserKey,
			true,
			false,
		},
		{
			"empty userKey",
			"User",
			"userTest3",
			"google",
			"superPassword",
			"",
			true,
			false,
		},
		{
			"empty User",
			"",
			"test2",
			"google",
			"superPassword",
			userdata.UserKey,
			true,
			false,
		},
		{
			"saving check test correct",
			"User",
			"logintoGoogle",
			"google",
			"superPassword",
			userdata.UserKey,
			false,
			true,
		},
		{
			"try saving with empty data and check data",
			"User",
			"",
			"google",
			"superPassword",
			userdata.UserKey,
			true,
			true,
		},
	}

	for _, tt := range tests {
		ttest := t.Run(tt.name, func(t *testing.T) {
			id, err := app.DoSaveUserPassword(tt.tuser, tt.tusernameToSave, tt.tuser, tt.tpassword, "IconDefault", tt.tuserKey)
			if tt.expectedErr {
				assert.Empty(id, "expect empty for the id")
				assert.NotNil(err, "expect NOT nil for err")
			} else {
				assert.NotEmpty(id, "expect not empty for the id")
				assert.Nil(err, "expect nil for err")
			}
			if tt.checkData {
				passwords, _ := app.GetUserPasswords(userTest)

				var pwdsContainer models.PasswordsContainer

				err = json.Unmarshal([]byte(passwords), &pwdsContainer)
				if err != nil {
					t.Error("Error by Unmarshal")
				}

				for _, v := range pwdsContainer.Passwords {
					if tt.expectedErr {
						assert.Empty(t, v, "there should not be any saved password")
					} else {
						assert.NotEmpty(t, v, "cannot be empty for the passwords")
					}
				}
			}
			app.DoDeleteUserPassword(userTest, id) // we will delete every password to make sure it doesn't interfere with other test
		})

		if ttest == true {
			fmt.Printf("\nTest: %v passed ✅", tt.name)
		}
	}
}

func Test_edit_user_password(t *testing.T) {
	assert := assert.New(t)
	db, cleanup := CreateTestDB()
	defer cleanup()

	app := &app.App{DB: db}

	const (
		userTest  = "User"
		emailTest = "email@hotmail.com"
		passTest  = "password"
	)

	// Register process
	_, err := app.DoRegister(userTest, emailTest, passTest)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	js, err := app.DoLogin(userTest, passTest)
	if err != nil {
		t.Fatalf("DoLogin failed: %v", err)
	}
	var userdata models.Receive

	err = json.Unmarshal([]byte(js), &userdata)
	if err != nil {
		t.Fatalf("json.Unmarshal failed: %v", err)
	}

	id, err := app.DoSaveUserPassword(userTest, "test", "google", "password", "IconDefault", userdata.UserKey)
	if err != nil {
		t.Fatalf("DoSaveUserPassword failed: %v", err)
	}

	tests := []struct {
		name         string
		tuser        string
		tuserKey     string
		tid          string
		tnewTitle    string
		tnewUsername string
		tnewPwd      string
		expectError  bool
		checkData    bool
	}{
		{
			"return nil error",
			userTest,
			userdata.UserKey,
			id,
			"NewTitle1",
			"newUserName1",
			"passwordEncrypted",
			false,
			false,
		},
		{
			"returns an error if any field is empty",
			userTest,
			userdata.UserKey,
			id,
			"NewTitle2",
			"newUserName2",
			"",
			true,
			false,
		},
		{
			"return an error if the userKey is empty",
			userTest,
			"",
			id,
			"NewTitle3",
			"newUserName3",
			"passwordEncrypted",
			true,
			false,
		},
		{
			"return nil err and the data is updated",
			userTest,
			userdata.UserKey,
			id,
			"NewTitle4",
			"newUserName4",
			"passwordEncrypted",
			false,
			true,
		},
		{
			"return ERR and data is NOT updated",
			userTest,
			"",
			id,
			"NewTitle5",
			"newUserName5",
			"passwordEncrypted4",
			true,
			true,
		},
	}

	for _, tt := range tests {
		ttest := t.Run(tt.name, func(t *testing.T) {
			errUpdate := app.DoUpdateUserPassword(tt.tuser, tt.tuserKey, tt.tid,
				tt.tnewTitle, tt.tnewUsername, tt.tnewPwd)
			if tt.expectError {

				assert.NotNil(errUpdate, "expect a error")

				if tt.checkData {
					password, err := app.GetUserPasswordById(userTest, id)
					if err != nil {
						t.Fatalf("error by app.GetUserPasswordById: %v", err)
					}

					var pwd models.Password
					if err = json.Unmarshal([]byte(password), &pwd); err != nil {
						t.Fatalf("error by Unmarshal: %v", err)
					}
					assert.NotNil(errUpdate, "expect a error")
					assert.Equal(tt.tid, pwd.Id, "expect same id")
					assert.Equal("NewTitle4", pwd.Title, "expect new Title")
					assert.Equal("newUserName4", pwd.Username, "expect new Username")
					// NewTitle4 & newUserName4 because this is the latest updated, but it should
					// not be updated to NewTitle5 or newUserName5
				}
			} else {
				assert.Nil(errUpdate, "expect a nil in err")
			}
			if tt.checkData && !tt.expectError {
				passwords, err := app.GetUserPasswordById(userTest, id)
				if err != nil {
					t.Fatalf("error by app.GetUserPasswordById: %v", err)
				}

				var password models.Password
				if err = json.Unmarshal([]byte(passwords), &password); err != nil {
					t.Fatalf("error by Unmarshal: %v", err)
				}

				assert.Equal(tt.tid, id, "expect same id")
				assert.Equal(tt.tnewTitle, password.Title, "expect new Title")
				assert.Equal(tt.tnewUsername, password.Username, "expect new Username")
				// assert.Equal(tt.tnewPwd, password.Pwd, "expect new Password")
			}
		})
		if ttest == true {
			fmt.Printf("\nTest: %v passed ✅", tt.name)
		}
	}

}

func Test_delete_password(t *testing.T) {
	assert := assert.New(t)
	db, cleanup := CreateTestDB()
	defer cleanup()

	app := &app.App{DB: db}

	const (
		userTest  = "User"
		emailTest = "email@hotmail.com"
		passTest  = "password"
	)

	// Register process
	_, err := app.DoRegister(userTest, emailTest, passTest)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	js, err := app.DoLogin(userTest, passTest)
	if err != nil {
		t.Fatalf("DoLogin failed: %v", err)
	}
	var userdata models.Receive

	err = json.Unmarshal([]byte(js), &userdata)
	if err != nil {
		t.Fatalf("json.Unmarshal failed: %v", err)
	}
	id1, err := app.DoSaveUserPassword(userTest, "test1", "google", "password", "IconDefault", userdata.UserKey)
	if err != nil {
		t.Fatalf("DoSaveUserPassword failed: %v", err)
	}
	id2, err := app.DoSaveUserPassword(userTest, "test2", "google2", "password2", "IconDefault", userdata.UserKey)
	if err != nil {
		t.Fatalf("DoSaveUserPassword failed: %v", err)
	}
	id3, err := app.DoSaveUserPassword(userTest, "test3", "google3", "password3", "IconDefault", userdata.UserKey)
	if err != nil {
		t.Fatalf("DoSaveUserPassword failed: %v", err)
	}
	id4, err := app.DoSaveUserPassword(userTest, "test4", "google4", "password4", "IconDefault", userdata.UserKey)
	if err != nil {
		t.Fatalf("DoSaveUserPassword failed: %v", err)
	}

	tests := []struct {
		name        string
		username    string
		id          string
		checkData   bool
		expectError bool
	}{
		{
			"password deleted successfully",
			userTest,
			id1,
			false,
			false,
		},
		{
			"password deleted failed!",
			"",
			id2,
			false,
			true,
		},
		{
			"password deleted failed and data not deleted!",
			"",
			id3,
			true,
			true,
		},
		{
			"password deleted successfully and data deleted!",
			userTest,
			id4,
			true,
			false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			errDelete := app.DoDeleteUserPassword(tt.username, tt.id)

			passwords, err := app.GetUserPasswords(userTest)
			if err != nil {
				t.Fatal(err)
			}
			var pwdsContainer models.PasswordsContainer
			err = json.Unmarshal([]byte(passwords), &pwdsContainer)

			if err != nil {
				t.Fatal(err)
			}

			if tt.expectError {
				assert.NotNil(errDelete, "should return an error")
				if tt.checkData {
					assert.NotNil(errDelete)
					for _, v := range pwdsContainer.Passwords {
						if v.Id == tt.id {
							assert.NotEmpty(v)
						}

					}
				}
			} else {
				assert.Nil(errDelete, "should return a nil")
				if tt.checkData {
					for _, v := range pwdsContainer.Passwords {
						if v.Id == tt.id {
							assert.Empty(v)
						}
					}
					assert.Nil(errDelete)
				}
			}
		})
	}
}
