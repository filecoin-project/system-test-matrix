import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CenterLayout } from '../..'
import { Loader } from '../../Loader'

export default {
  title: 'Loader/All loader stories',
  component: Loader,
} as ComponentMeta<typeof Loader>

export const SearchInputLoader: ComponentStory<typeof Loader> = () => (
  <CenterLayout>
    <Loader height={14} />
  </CenterLayout>
)
export const RouterSuspenseLoader: ComponentStory<typeof Loader> = () => (
  <CenterLayout>
    <Loader fullScreen />
  </CenterLayout>
)
