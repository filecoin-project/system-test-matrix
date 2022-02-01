import { screen } from '@testing-library/react'
import React from 'react'
import { Dropdown, DropdownProps } from '../Dropdown/Dropdown'
import { renderWithAct } from '../general-purpose-tests/render-with-act'

const defaultProps: DropdownProps = {
  options: [{ label: '5', value: '5' }],
  value: '5',
  onChange: Function,
}
describe('Dropdown suite', () => {
  test('does component render', async () => {
    await renderWithAct(<Dropdown {...defaultProps} />)
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })
})
