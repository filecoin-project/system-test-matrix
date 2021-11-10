// setup file
import '@testing-library/jest-dom'
import 'jest-styled-components'
require('jest-fetch-mock').enableMocks()
window.URL.createObjectURL = jest.fn()
