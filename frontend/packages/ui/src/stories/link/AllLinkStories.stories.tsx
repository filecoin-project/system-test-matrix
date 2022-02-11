import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ColumnLayout } from '../../Layouts'
import { Link } from '../../Link'

const pathname = 'https://lotus.systemtestmatrix.com/'
export default {
  title: 'Link/All Link Stories',
  component: Link,
  parameters: {
    controls: {
      disable: true,
    },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Link>

export const Default: ComponentStory<typeof Link> = () => (
  <ColumnLayout>
    <Link className="u-text--large" to={pathname} target="blank">
      Blockchain
    </Link>
    <Link className="u-text--large" to={pathname} target="blank" disabled>
      Blockchain
    </Link>
  </ColumnLayout>
)

export const System: ComponentStory<typeof Link> = () => (
  <ColumnLayout>
    <Link
      className="u-text--medium"
      to={pathname}
      target="blank"
      appearance="system"
    >
      Blockchain
    </Link>
    <Link
      className="u-text--xsmall"
      to={pathname}
      target="blank"
      appearance="system"
      icon="link"
    >
      /lotus/miner
    </Link>
    <Link
      className="u-text--xsmall"
      to={pathname}
      target="blank"
      appearance="system"
      icon="link"
      disabled
    >
      /lotus/miner
    </Link>
  </ColumnLayout>
)

export const Sizing: ComponentStory<typeof Link> = () => (
  <ColumnLayout>
    <Link
      to={pathname}
      appearance="default"
      target="blank"
      className="u-text--large"
    >
      Large
    </Link>
    <Link to={pathname} appearance="default" target="blank">
      Regular
    </Link>
    <Link
      to={pathname}
      appearance="default"
      target="blank"
      className="u-text--small"
    >
      Small
    </Link>
    <Link
      appearance="default"
      to={pathname}
      target="blank"
      className="u-text--xsmall"
    >
      XS Small
    </Link>
  </ColumnLayout>
)
