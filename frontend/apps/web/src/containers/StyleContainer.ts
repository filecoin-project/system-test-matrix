import { Dispatch, useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { Action } from '@filecoin/types'

type ActionType = 'CHANGE_THEME' | 'SET_CSS' | 'UPDATE_CSS' | 'SET_BODY_SCROLL'

interface State {
  customCss: string
  theme: {
    space: number[]
    breakpoints: string[]
    isBodyScrollable: boolean
  }
}

const initialState: State = {
  customCss: '',
  theme: {
    space: [0, 8, 16, 24, 32],
    breakpoints: ['32em', '48em', '64em'],
    isBodyScrollable: true,
  },
}

const reducer = (state: State, action: Action<ActionType>) => {
  switch (action.type) {
    case 'CHANGE_THEME': {
      return {
        ...state,
        ...action.value,
      }
    }
    case 'SET_BODY_SCROLL': {
      return {
        ...state,
        theme: { ...state.theme, isBodyScrollable: action.value },
      }
    }
    //probably not needed
    case 'SET_CSS': {
      return {
        ...state,
        customCss: action.value,
      }
    }
    case 'UPDATE_CSS': {
      return {
        ...state,
        customCss: state.customCss + action.value,
      }
    }
    default:
      return state
  }
}

function useContainer(): {
  state: State
  dispatch: Dispatch<Action<ActionType>>
} {
  const [state, dispatch] = useReducer(reducer, initialState)
  return { state, dispatch }
}

export const StyleContainer = createContainer(useContainer)
