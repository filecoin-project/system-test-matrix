import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { Dropdown } from '../../Dropdown/Dropdown'

export default {
  title: 'Dropdown/All Dropdown Stories',
  component: Dropdown,
  decorators: [
    Story => (
      <div
        style={{
          width: '179px',
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
