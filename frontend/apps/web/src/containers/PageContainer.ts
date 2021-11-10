import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import i18n from 'i18next'

interface State {
  title: string
}

const initialState: State = {
  title: 'Filecoin',
}

const reducer = (state: State, action) => {
  switch (action.type) {
    case 'setTitle': {
      return {
        ...state,
        title: i18n.t(action.value),
      }
    }
    default: {
      return state
    }
  }
}

// TODO: type
function usePage() {
  const [state, dispatch] = useReducer(reducer, initialState)

  function setTitle(title = 'Filecoin') {
    dispatch({ type: 'setTitle', value: title })
  }

  return { state, dispatch, setTitle }
}

export const PageContainer = createContainer(usePage)
