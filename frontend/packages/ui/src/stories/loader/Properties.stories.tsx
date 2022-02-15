import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CenterLayout } from '../..'
import { Loader } from '../../Loader'

export default {
  title: 'Loader/Properties',
  component: Loader,
  args: {
    fullScreen: true,
    height: 14,
  },
} as ComponentMeta<typeof Loader>

export const LoaderProperties: ComponentStory<typeof Loader> = args => {
  return (
    <CenterLayout>
      <Loader {...args} />
    </CenterLayout>
  )
}

LoaderProperties.storyName = 'Properties'
