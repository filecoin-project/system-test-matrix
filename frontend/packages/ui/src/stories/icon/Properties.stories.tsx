import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CenterLayout, IconColor, IconNames, IconSizes } from '../..'
import { Icon } from '../../Icon'

export default {
  title: 'Icon/Properties',
  component: Icon,
  args: {
    name: 'book',
    size: 'xlarge',
    color: 'gray',
    className: 'class-example',
  },
  argTypes: {
    name: {
      name: 'icon name',
      options: IconNames,
    },
    size: {
      name: 'icon size',
      options: IconSizes,
    },
    color: {
      name: 'icon color',
      options: IconColor,
    },
    className: {
      name: 'class name',
    },
  },
} as ComponentMeta<typeof Icon>

export const IconProperties: ComponentStory<typeof Icon> = args => {
  return (
    <CenterLayout>
      <Icon {...args} />
    </CenterLayout>
  )
}

IconProperties.storyName = 'Properties'
