import '@filecoin/ui/src/fonts/fonts.less'
import 'normalize.css'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import './polyfills/color.js'
import './sw'

import React from 'react'
import ReactDOM from 'react-dom'
import { initTranslations } from '@filecoin/core'

import { App } from './App'

import { StyleContainer } from '@/containers/StyleContainer'

declare global {
  interface Window {
    Typekit: any
  }
}

async function init() {
  await initTranslations()

  ReactDOM.render(
    <StyleContainer.Provider>
      <App />
    </StyleContainer.Provider>,
    document.getElementById('main'),
  )
}

init()
