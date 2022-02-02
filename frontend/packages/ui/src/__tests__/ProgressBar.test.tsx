import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import React from 'react'
import { renderWithAct } from '../general-purpose-tests/render-with-act'
import { ProgressBar, ProgressBarProps } from '../ProgressBar'

const defaultProps: ProgressBarProps = {
  data: [{ name: 'testBar', percentage: 55.5, numberOfTests: 3 }],
}
describe('ProgressBar suite', () => {
  test('does component render', async () => {
    await renderWithAct(<ProgressBar {...defaultProps} />)
    expect(screen.getByTestId('progress-bar-test')).toHaveAttribute(
      'data-tip',
      expect.stringContaining(defaultProps.data[0].name),
    )
  })
})
