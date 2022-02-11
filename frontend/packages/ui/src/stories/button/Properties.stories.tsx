import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CenterLayout } from '../..'
import { Button } from '../../Button'

export default {
  title: 'Button/Properties',
  component: Button,
  args: {
    variant: 'rounded',
    size: 'small',
    color: 'success',
  },
  argTypes: {},
} as ComponentMeta<typeof Button>

export const ButtonProperties: ComponentStory<typeof Button> = args => {
  return (
    <CenterLayout>
      <Button {...args}>Button Text</Button>
    </CenterLayout>
  )
}

ButtonProperties.storyName = 'Properties'
