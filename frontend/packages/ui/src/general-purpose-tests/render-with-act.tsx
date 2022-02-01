import { act, render, RenderResult } from '@testing-library/react'
import React from 'react'

export async function renderWithAct(element: React.ReactElement) {
  let result: RenderResult
  await act(async () => {
    result = render(element)
  })
  return result
}
