package collector

type UnsupportedLanguageError struct{}

func (m *UnsupportedLanguageError) Error() string {
	return "Language not supported."
}

func getLangExt(lang_mode string) (string, error) {
	switch lang_mode {
	case "go":
		return ".go", nil
	case "rust":
		return ".rs", nil
	default:
		// get all files regardless of extension
		return "", &UnsupportedLanguageError{}
	}
}
