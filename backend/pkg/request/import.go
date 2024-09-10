package request

// account, credentialType, fileType, dataURL
type Import struct {
	Account        string `json:"account"`
	CredentialType string `json:"credential_type"`
	FileType       string `json:"file_type"`
	DataURL        string `json:"data_url"`
}
