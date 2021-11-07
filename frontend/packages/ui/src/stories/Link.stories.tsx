import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import styled from 'styled-components'

import { BoxLayout } from '../Layouts/BoxLayout'
import { ColumnLayout } from '../Layouts/ColumnLayout'
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
        to={{
          pathname,
        }}
        target="blank"
        icon={'arrow_right'}
      >
        Forgot your password?
      </Link>

      <Link
        to={{
          pathname,
        }}
        target="blank"
      >
        Forgot your password?
      </Link>

      <Link
        to={{
          pathname,
        }}
        target="blank"
        disabled
      >
        Forgot your password?
      </Link>
    </ColumnLayout>
  </Wrapper>
)

export const Brand = () => (
  <Wrapper>
    <ColumnLayout>
      <Link to="#" icon="arrow_right" appearance="brand">
        Learn more
      </Link>

      <Link to="#" appearance="brand">
        Learn more
      </Link>

      <Link to="#" appearance="brand" disabled>
        Learn more
      </Link>
    </ColumnLayout>
  </Wrapper>
)

export const System = () => (
  <Wrapper>
    <ColumnLayout>
      <Link
        to={{
          pathname,
        }}
        target="blank"
        icon={'arrow_right'}
        appearance="system"
      >
        Learn more
      </Link>
      <Link
        to={{
          pathname,
        }}
        target="blank"
        appearance="system"
      >
        Learn more
      </Link>
      <Link
        to={{
          pathname,
        }}
        target="blank"
        appearance="system"
        disabled
      >
        Learn more
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
        icon={'arrow_right'}
      >
        Regular
      </Link>
      <Link
        to={{
          pathname,
        }}
        appearance="brand"
        target="blank"
        icon={'arrow_right'}
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
        icon={'arrow_right'}
        className="u-text--xsmall"
      >
        XS Small
      </Link>
    </ColumnLayout>
  </Wrapper>
)
export const Details = args => (
  <Wrapper>
    <ColumnLayout>
      <Link
        to={{
          pathname,
        }}
        target="blank"
        icon={'arrow_right'}
        {...args}
      >
        Learn more
      </Link>
    </ColumnLayout>
  </Wrapper>
)

const Wrapper = styled(BoxLayout)`
  margin: 1.3rem 0;
`
