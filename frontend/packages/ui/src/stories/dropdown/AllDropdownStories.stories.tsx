import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { Dropdown } from '../../Dropdown/Dropdown'
import { StackLayout } from '../../Layouts'

export default {
  title: 'Dropdown/All Dropdown Stories',
  component: Dropdown,
  decorators: [
    Story => (
      <div
        style={{
          width: '328px',
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
} as ComponentMeta<typeof Dropdown>

const options = [
  {
    label: 'Menu item 1 ',
    value: 'option1',
  },
  {
    label: 'Menu item 2',
    value: 'option2',
  },
]

export const Default: ComponentStory<typeof Dropdown> = () => {
  const [value, setValue] = useState()
  return (
    <Dropdown
      options={options}
      value={value}
      onChange={e => setValue(e.value)}
      placeholder="Select option"
    />
  )
}

export const Multiple: ComponentStory<typeof Dropdown> = () => {
  const [value, setValue] = useState()
  return (
    <Dropdown
      options={options}
      value={value}
      multiple={true}
      onChange={e => setValue(e.value)}
      placeholder="Select options"
    />
  )
}

export const Size: ComponentStory<typeof Dropdown> = () => {
  const [value, setValue] = useState()
  const [valueLarge, setValueLarge] = useState()
  return (
    <StackLayout gap={2}>
      <Dropdown
        options={options}
        value={valueLarge}
        size="large"
        onChange={e => setValueLarge(e.value)}
        placeholder="Select  large"
      />

      <Dropdown
        options={options}
        value={value}
        onChange={e => setValue(e.value)}
        placeholder="Select  medium"
      />
    </StackLayout>
  )
}

export const Status: ComponentStory<typeof Dropdown> = () => {
  const [success, setSuccess] = useState()
  const [error, setError] = useState()
  return (
    <StackLayout gap={2}>
      <Dropdown
        options={options}
        value={success}
        status="success"
        info="Text"
        onChange={e => setSuccess(e.value)}
        placeholder="Select success"
      />

      <Dropdown
        options={options}
        value={error}
        status="error"
        info="Text"
        onChange={e => setError(e.value)}
        placeholder="Select error"
      />
    </StackLayout>
  )
}
