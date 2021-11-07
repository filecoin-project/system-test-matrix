import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { EventBus } from '@filecoin/core'

import { NotificationMessage } from './NotificationMessage'

export type NotificationStatus = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO'

export interface Error {
  details?: string
  errorCode: string
  status: 'BAD_REQUEST'
}

export interface Notification {
  id?: string
  message?: string
  status?: NotificationStatus
  timeout?: number
  error?: Error
  /**
   * Run function after notification timeout expires
   */
  onTimeout?: () => void
}

export const NotificationBus = EventBus<Notification>('Notification')

export const NotificationManager: FunctionComponent = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  function removeNotification(id: string) {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  function queueNotificationDestroy({
    id = '',
    timeout = 5000,
    onTimeout = null,
  }) {
    setTimeout(() => {
      const el = document.getElementById(`notification-${id}`)
      if (el) {
        el.classList.toggle('fade-out')
      }
    }, timeout - 300)

    setTimeout(() => {
      removeNotification(`${id}`)
      onTimeout && onTimeout()
    }, timeout)
  }

  useEffect(() => {
    function onNotification(event: CustomEvent) {
      const { id = `${new Date()}`, status = 'SUCCESS', ...rest } = event.detail
      setNotifications(n => [...n, { id, status, ...rest }])
    }

    NotificationBus.listen(onNotification)
    return () => NotificationBus.destroy(onNotification)
  }, [])

  useEffect(() => {
    if (notifications.length) {
      const lastNotification = notifications[notifications.length - 1]
      queueNotificationDestroy(lastNotification)
    }
  }, [notifications])

  return (
    <Wrapper>
      {notifications.map(({ id, message, status, error }) => (
        <NotificationMessage
          key={id}
          id={`notification-${id}`}
          status={status}
          message={message}
          error={error}
        />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  z-index: 1000;
  pointer-events: none;
`
