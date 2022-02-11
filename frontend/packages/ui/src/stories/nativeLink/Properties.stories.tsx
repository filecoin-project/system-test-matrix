import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { CenterLayout, IconNames } from '../..'
import { NativeLink, NativeLinkAppearance } from '../../NativeLink'

const pathname = 'https://lotus.systemtestmatrix.com/'

export default {
  title: 'NativeLink/Properties',
  component: NativeLink,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    icon: 'link',
    appearance: 'system',
    disabled: false,
  },
  argTypes: {
    icon: {
      name: 'icon',
      control: {
        type: 'select',
        options: IconNames,
      },
    },
    appearance: {
      name: 'appearance',
      control: {
        type: 'select',
        options: NativeLinkAppearance,
      },
    },
    className: {
      name: 'className',
      default: 'u-text--regular',
      control: {
        type: 'select',
        options: {
          xsmall: 'u-text--xsmall',
          small: 'u-text--small',
          regular: 'u-text--regular',
          large: 'u-text--large',
        },
      },
    },
    disabled: {
      name: 'disabled',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
  },
} as ComponentMeta<typeof NativeLink>

export const NativeLinkProperties: ComponentStory<typeof NativeLink> = args => {
  return (
    <CenterLayout>
      <NativeLink href={pathname} target="blank" {...args}>
        NativeLink Example
      </NativeLink>
    </CenterLayout>
  )
}

NativeLinkProperties.storyName = 'Properties'
