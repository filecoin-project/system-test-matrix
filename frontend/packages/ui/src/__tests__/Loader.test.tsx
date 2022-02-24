import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import React from 'react'
import { renderWithAct } from '../general-purpose-tests/render-with-act'
import { Loader, LoaderProps } from '../Loader'

const defaultProps: LoaderProps = {
  fullScreen: true,
}
describe('Loader suite', () => {
  test('Loader should render with default height of 72px', async () => {
    await renderWithAct(<Loader {...defaultProps} />)
    expect(screen.getByTestId('loader-test-id')).toHaveAttribute('height', '72')
  })
})
