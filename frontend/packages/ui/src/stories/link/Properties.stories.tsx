import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { CenterLayout, IconNames } from '../..'
import { Link, LinkAppearance } from '../../Link'

const pathname = 'https://lotus.systemtestmatrix.com/'

export default {
  title: 'Link/Properties',
  component: Link,
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
      control: {
        type: 'select',
        options: IconNames,
      },
    },
    appearance: {
      control: {
        type: 'select',
        options: LinkAppearance,
      },
    },
    className: {
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
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
  },
} as ComponentMeta<typeof Link>

export const LinkProperties: ComponentStory<typeof Link> = args => {
  return (
    <CenterLayout>
      <Link to={pathname} target="blank" {...args}>
        Link Example
      </Link>
    </CenterLayout>
  )
}

LinkProperties.storyName = 'Properties'
