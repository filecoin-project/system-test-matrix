import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Checkbox, CheckboxProps } from '../Checkbox'

export default {
  title: 'Checkbox',
  component: Checkbox,
  argTypes: {
    disabled: { defaultValue: false, control: { type: 'boolean' } },
  },
} as Meta

const Template: Story<CheckboxProps> = args => <Checkbox {...args} />

export const Default = Template.bind({})

export const Checked = Template.bind({})
Checked.args = {
  checked: true,
}
export const Error = Template.bind({})
Error.args = {
  hasError: true,
}
export const Label = Template.bind({})
Label.args = {
  label: 'This is example of checkbox with label',
}
