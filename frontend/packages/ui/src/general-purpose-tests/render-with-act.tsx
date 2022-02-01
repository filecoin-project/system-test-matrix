import { act, render, RenderResult } from '@testing-library/react'
import React from 'react'

export const renderWithAct = async (element: React.ReactElement) => {
  let result: RenderResult
  act(() => {
    result = render(element)
  })
  return Promise.resolve(result)
}
