import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Modal } from '../Modal'

describe('Modal suite', () => {
  test('calls onClose when close button is clicked', () => {
    const spy = jest.fn()
    render(<Modal isOpen={true} onClose={spy} />)
    fireEvent.click(screen.getByTestId('close-btn'))
    expect(spy).toHaveBeenCalled()
  })
  test('renders correct title', () => {
    render(<Modal isOpen={true} title="test-title" />)
    expect(screen.getByText(/^test-title$/i)).toBeInTheDocument()
  })
})
