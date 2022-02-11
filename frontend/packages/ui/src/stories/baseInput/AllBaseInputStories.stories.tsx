import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { BaseInput } from '../../BaseInput'

export default {
  title: 'BaseInput/All stories',
  component: BaseInput,
  decorators: [
    Story => (
      <div
        style={{
          position: 'relative',
          width: '328px',
          height: '100%',
          margin: '50px auto',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      disable: true,
    },
  },
} as ComponentMeta<typeof BaseInput>

export const Basic: ComponentStory<typeof BaseInput> = () => {
  return <BaseInput placeholder="Basic" />
}

export const Disabled: ComponentStory<typeof BaseInput> = () => {
  return <BaseInput placeholder="Disabled" disabled={true} />
}

export const Password: ComponentStory<typeof BaseInput> = () => {
  return (
    <BaseInput
      placeholder="Password"
      type="password"
      info="Password must have at least 12 characters"
    />
  )
}

export const WithIconBefore: ComponentStory<typeof BaseInput> = () => {
  return <BaseInput placeholder="With Icon Before" iconBefore="search" />
}

export const WithIconAfter: ComponentStory<typeof BaseInput> = () => {
  return <BaseInput placeholder="With Icon After" iconAfter="search" />
}

export const WithClearButton: ComponentStory<typeof BaseInput> = () => {
  const [value, setValue] = useState('')

  return (
    <BaseInput
      value={value}
      placeholder="With Clear Button"
      onChange={e => setValue(e.currentTarget.value)}
      onClearInput={() => setValue('')}
    />
  )
}

export const WithErrorMessage: ComponentStory<typeof BaseInput> = () => {
  return (
    <BaseInput
      placeholder="With Error Message"
      status="error"
      info="This is error message"
    />
  )
}

export const WithSuccessMessage: ComponentStory<typeof BaseInput> = () => {
  return (
    <BaseInput
      placeholder="With Success Message"
      status="success"
      info="This is success message"
    />
  )
}
