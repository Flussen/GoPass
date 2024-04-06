package actions

import (
	"GoPass/backend/credentials/actions/export"
	"GoPass/backend/pkg/request"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExport(t *testing.T) {
	db, rqstR, cleanup := initTest()
	defer cleanup()

	c := assert.New(t)

	credentialsType := []string{"passwords", "cards"}

	rqstI := request.Export{
		CredentialsType: credentialsType,
		ExportType:      "json",
	}

	err := export.Export(db, rqstR.Account, rqstI)
	c.NoError(err)

}
