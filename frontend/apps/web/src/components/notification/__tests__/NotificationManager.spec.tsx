import React from 'react'
import { render, act } from '@testing-library/react'

import { NotificationManager, NotificationBus } from '../NotificationManager'

describe('NotificationManager suite', () => {
  test('should render', () => {
    const component = render(<NotificationManager />)
    expect(component).toBeDefined()
  })

  test('should render a notification', async () => {
    const { getByText } = render(<NotificationManager />)
    act(() => {
      NotificationBus.dispatch({ message: 'Test', timeout: 1000 })
    })
    const notification = getByText('Test')
    expect(notification).toBeTruthy()
  })
})
