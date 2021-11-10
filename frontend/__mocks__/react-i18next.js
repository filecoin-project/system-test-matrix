const reactI18next = require('react-i18next')

const useMock = [k => k, {}]
useMock.t = k => k
useMock.i18n = { changeLanguage: k => k }

module.exports = {
  useTranslation: () => useMock,
  initReactI18next: reactI18next.initReactI18next,
}
