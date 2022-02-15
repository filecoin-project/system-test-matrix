import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { SearchInput } from '../../SearchInput'

export default {
  title: 'SearchInput/Properties',
  component: SearchInput,
  decorators: [
    Story => (
      <div
        style={{
          position: 'relative',
          width: '940px',
          height: '100%',
          margin: '50px auto',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    value: '',
    width: '58.75rem',
    autoFocus: false,
    placeholder: 'Search',
  },
  argTypes: {},
} as ComponentMeta<typeof SearchInput>

export const BaseInputProperties: ComponentStory<typeof SearchInput> = args => {
  const [searchTerm, setSearchTerm] = useState(undefined)

  return (
    <SearchInput
      onSearch={value => {
        setSearchTerm(value)
      }}
      value={searchTerm}
      {...args}
    />
  )
}

BaseInputProperties.storyName = 'Properties'
