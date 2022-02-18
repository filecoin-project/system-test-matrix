import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { SearchInput } from '../..'

export default {
  title: 'SearchInput/All stories',
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
  parameters: {
    controls: {
      disable: true,
    },
  },
} as ComponentMeta<typeof SearchInput>

export const InputBasedSearch: ComponentStory<typeof SearchInput> = () => {
  const [searchTerm, setSearchTerm] = useState(undefined)

  return (
    <SearchInput
      onSearch={value => {
        setSearchTerm(value)
      }}
      value={searchTerm}
      placeholder="Search tests"
      width="58.75rem"
      autoFocus={false}
    />
  )
}
