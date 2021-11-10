import { useReducer } from 'react'
import { createContainer } from 'unstated-next'
import { Action } from '@filecoin/types'

type ActionType = 'PUSH_NOTIFICATION' | 'REMOVE_NOTIFICATION' | 'CLEAR_ALL'

export type NotificationStatus = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO'

export interface Notification {
  id: string
  message?: string
  status?: NotificationStatus
  errors?: {
    [key: string]: string
  }
}

interface State {
  notifications: Notification[]
}

const reducer = (state: State, action: Action<ActionType>): State => {
  switch (action.type) {
    case 'PUSH_NOTIFICATION': {
      const { message = '', status = 'SUCCESS', errors } = action.value
      return {
        notifications: [
          ...state.notifications,
          { id: `${Date.now()}`, message, status, errors },
        ],
      }
    }
    case 'REMOVE_NOTIFICATION': {
      const notifications = state.notifications.filter(
        ({ id }) => id !== action.value,
      )
      return { notifications }
    }
    case 'CLEAR_ALL':
      return { notifications: [] }
    default:
      return { notifications: [] }
  }
}

function useNotification(initialState = { notifications: [] }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return { state, dispatch }
}

export const NotificationContainer = createContainer(useNotification)
