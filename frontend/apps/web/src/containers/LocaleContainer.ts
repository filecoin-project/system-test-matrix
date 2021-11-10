import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import i18n from 'i18next'
import moment from 'moment'
import { Action } from '@filecoin/types'

type ActionType = 'SET_LANGUAGE' | 'SET_LOCALE' | 'SET_CURRENCY'

interface State {
  language: string
  locale: string
  currency: string
}

export const localeInitialState: State = {
  language: 'en',
  locale: 'en-GB',
  currency: 'EUR',
}

const reducer = (state: State, action: Action<ActionType>) => {
  switch (action.type) {
    case 'SET_LANGUAGE': {
      return { ...state, lan: action.value }
    }
    case 'SET_LOCALE': {
      const locale = action.value
      moment.locale(locale)
      return { ...state, locale }
    }
    default:
      return state
  }
}

function useLocale() {
  const [state, dispatch] = useReducer(reducer, localeInitialState)

  const setLanguage = (value: string = localeInitialState.language) => {
    i18n.changeLanguage(value)
    dispatch({ type: 'SET_LANGUAGE', value })
  }

  // initial value is of en_US format - we want en-US
  const setLocale = (value: string = localeInitialState.locale) => {
    let locale = value
    if (locale.indexOf('_')) {
      locale = locale.split('_').join('-')
    }

    dispatch({ type: 'SET_LOCALE', value: locale })
  }

  return {
    state,
    setLanguage,
    setLocale,
  }
}

export const LocaleContainer = createContainer(useLocale)
