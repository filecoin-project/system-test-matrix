import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { BaseInput } from '../../BaseInput'

export default {
  title: 'BaseInput/Properties',
  component: BaseInput,
  args: {
    placeholder: 'Input your props below',

    status: undefined,

    iconBefore: undefined,

    iconAfter: undefined,

    info: '',
  },
  argTypes: {},
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
} as ComponentMeta<typeof BaseInput>

export const BaseInputProperties: ComponentStory<typeof BaseInput> = args => {
  return <BaseInput {...args} />
}

BaseInputProperties.storyName = 'Properties'
