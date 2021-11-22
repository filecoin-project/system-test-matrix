import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import styled from 'styled-components'

import { BoxLayout, ColumnLayout } from '../Layouts'
import { Link, LinkAppearance } from '../Link'

const pathname = 'http://filecoin-fe-dev.s3-website.us-east-2.amazonaws.com/'
export default {
  title: 'Link',
  component: Link,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    icon: {
      name: 'icon',
    },
    appearance: {
      name: 'appearance',
      defaultValue: 'default',
      options: LinkAppearance,
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
}
export const Default = () => (
  <Wrapper>
    <ColumnLayout>
      <Link
        className="u-text--large"
        to={{
          pathname,
        }}
        target="blank"
      >
        Blockchain
      </Link>
      <Link
        className="u-text--large"
        to={{
          pathname,
        }}
        target="blank"
        disabled
      >
        Blockchain
      </Link>
    </ColumnLayout>
  </Wrapper>
)

export const System = () => (
  <Wrapper>
    <ColumnLayout>
      <Link
        className="u-text--medium"
        to={{
          pathname,
        }}
        target="blank"
        appearance="system"
      >
        Blockchain
      </Link>
      <Link
        className="u-text--xsmall"
        to={{
          pathname,
        }}
        target="blank"
        appearance="system"
        icon="link"
      >
        /lotus/miner
      </Link>
      <Link
        className="u-text--xsmall"
        to={{
          pathname,
        }}
        target="blank"
        appearance="system"
        icon="link"
        disabled
      >
        /lotus/miner
      </Link>
    </ColumnLayout>
  </Wrapper>
)

export const Sizing = () => (
  <Wrapper>
    <ColumnLayout>
      <Link
        to={{
          pathname,
        }}
        appearance="brand"
        target="blank"
        className="u-text--large"
      >
        Large
      </Link>
      <Link
        to={{
          pathname,
        }}
        appearance="brand"
        target="blank"
      >
        Regular
      </Link>
      <Link
        to={{
          pathname,
        }}
        appearance="brand"
        target="blank"
        className="u-text--small"
      >
        Small
      </Link>
      <Link
        appearance="brand"
        to={{
          pathname,
        }}
        target="blank"
        className="u-text--xsmall"
      >
        XS Small
      </Link>
    </ColumnLayout>
  </Wrapper>
)

const Wrapper = styled(BoxLayout)`
  margin: 1.3rem 0;
`
