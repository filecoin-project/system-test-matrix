import { useState } from '@storybook/addons'
import { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { BaseInput } from '../BaseInput'
import { StackLayout } from '../Layouts'

export default {
  title: 'BaseInput',
  component: BaseInput,
} as Meta

let setTemplateValue: (update: string | ((prevState: string) => string)) => void

const Template = args => {
  const [value, setValue] = useState('')
  setTemplateValue = setValue

  return (
    <Wrapper>
      <BaseInput
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        {...args}
      />
    </Wrapper>
  )
}

export const Base = Template.bind({})
Base.args = {
  placeholder: 'Base',
}

export const Disabled = Template.bind({})
Disabled.args = {
  placeholder: 'Disabled',
  disabled: true,
}

export const Password = Template.bind({})
Password.args = {
  placeholder: 'Password',
  type: 'password',
  info: 'Password must have at least 12 characters',
}

export const WithIconBefore = Template.bind({})
WithIconBefore.args = {
  placeholder: 'With Icon Before',
  iconBefore: 'search',
}

export const WithIconAfter = Template.bind({})
WithIconAfter.args = {
  placeholder: 'With Icon After',
  iconAfter: 'calendar',
}

export const WithClearButton = Template.bind({})
WithClearButton.args = {
  placeholder: 'With Clear Button',
  onClearInput: () => setTemplateValue(''),
}

export const WithErrorMessage = Template.bind({})
WithErrorMessage.args = {
  placeholder: 'With Error Message',
  status: 'error',
  info: 'Oh no, someone destroyed my snowman :(',
}

export const WithSuccessMessage = Template.bind({})
WithSuccessMessage.args = {
  placeholder: 'With Success Message',
  status: 'success',
  info: 'Success message!',
}

const Wrapper = styled(StackLayout)`
  position: relative;
  width: 328px;
  height: 100%;
  margin: 50px auto;
`
