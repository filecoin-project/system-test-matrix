import React from 'react'
import styled from 'styled-components'

import { BoxLayout } from '../Layouts/BoxLayout'
import { ColumnLayout } from '../Layouts/ColumnLayout'
import { NativeLink, NativeLinkAppearance } from '../NativeLink'

export default {
  title: 'NativeLink',
  component: NativeLink,
  argTypes: {
    icon: {
      name: 'icon',
    },
    appearance: {
      name: 'appearance',
      defaultValue: 'default',
      options: NativeLinkAppearance,
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
      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        icon="arrow_right"
      >
        Forgot your password?
      </NativeLink>

      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Forgot your password?
      </NativeLink>

      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        disabled
      >
        Forgot your password?
      </NativeLink>
    </ColumnLayout>
  </Wrapper>
)

export const Brand = () => (
  <Wrapper>
    <ColumnLayout>
      <NativeLink href="https://www.google.com/" appearance="brand">
        Learn more
      </NativeLink>

      <NativeLink href="https://www.google.com/">Learn more</NativeLink>

      <NativeLink href="https://www.google.com/">Learn more</NativeLink>
    </ColumnLayout>
  </Wrapper>
)

export const System = () => (
  <Wrapper>
    <ColumnLayout>
      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        icon="arrow_right"
        appearance="system"
      >
        Learn more
      </NativeLink>
      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        appearance="system"
      >
        Learn more
      </NativeLink>
      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        appearance="system"
        disabled
      >
        Learn more
      </NativeLink>
    </ColumnLayout>
  </Wrapper>
)

export const Sizing = () => (
  <Wrapper>
    <ColumnLayout>
      <NativeLink
        href="https://www.google.com/"
        appearance="brand"
        target="_blank"
        rel="noopener noreferrer"
        icon="arrow_right"
      >
        Regular
      </NativeLink>
      <NativeLink
        href="https://www.google.com/"
        appearance="brand"
        target="_blank"
        rel="noopener noreferrer"
        icon="arrow_right"
        className="u-text--small"
      >
        Small
      </NativeLink>
      <NativeLink
        appearance="brand"
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        icon="arrow_right"
        className="u-text--xsmall"
      >
        XS Small
      </NativeLink>
    </ColumnLayout>
  </Wrapper>
)
export const Details = args => (
  <Wrapper>
    <ColumnLayout>
      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        icon="arrow_right"
        {...args}
      >
        Learn more
      </NativeLink>
    </ColumnLayout>
  </Wrapper>
)

const Wrapper = styled(BoxLayout)`
  margin: 1.3rem 0;
`
