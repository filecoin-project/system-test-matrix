import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { CenterLayout } from '../..'
import {
  Dropdown,
  DropdownSizes,
  DropdownStatus,
} from '../../Dropdown/Dropdown'

export default {
  title: 'Dropdown/Properties',
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
  args: {
    options: [
      {
        label: 'Menu item 1 ',
        value: 'option1',
      },
      {
        label: 'Menu item 2',
        value: 'option2',
      },
    ],
    size: 'medium',
    multiple: false,
    info: 'This is info text',
    scrollHeight: 200,
  },
  argTypes: {
    size: {
      name: 'dropdown size',
      options: DropdownSizes,
    },
    multiple: {
      name: 'multiple options',
      control: {
        type: 'boolean',
      },
    },
    status: {
      name: 'status',
      options: DropdownStatus,
    },
    info: {
      name: 'info message',
    },
    scrollHeight: {
      control: {
        type: 'range',
        min: 0,
        max: 1000,
        step: 100,
      },
    },
  },
} as ComponentMeta<typeof Dropdown>

export const DropdownProperties: ComponentStory<typeof Dropdown> = args => {
  const [value, setValue] = useState()
  return (
    <CenterLayout>
      <Dropdown
        value={value}
        onChange={e => setValue(e.value)}
        placeholder="Select option"
        {...args}
      />
    </CenterLayout>
  )
}

DropdownProperties.storyName = 'Properties'
