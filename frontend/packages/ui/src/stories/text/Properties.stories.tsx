import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CenterLayout, TextColors, TextStyle } from '../..'
import { Text } from '../../Text'

export default {
  title: 'Text/Properties',
  component: Text,
  args: {
    type: 'text xl',
    color: 'textGray',
    bold: false,
    semiBold: true,
    align: 'center',
  },
  argTypes: {
    type: {
      options: TextStyle,
    },
    color: {
      options: TextColors,
    },
    align: {
      options: ['left', 'right', 'center'],
    },
  },
} as ComponentMeta<typeof Text>

export const TextProperties: ComponentStory<typeof Text> = args => {
  return (
    <CenterLayout>
      <Text {...args}>Text Example</Text>
    </CenterLayout>
  )
}

TextProperties.storyName = 'Properties'
