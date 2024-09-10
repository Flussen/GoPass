package request

type Export struct {
	CredentialsType []string `json:"credentials_type"`
	ExportType      string   `json:"export_type"`
}
