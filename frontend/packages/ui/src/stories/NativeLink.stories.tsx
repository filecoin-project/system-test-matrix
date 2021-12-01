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
        className="u-text--large"
      >
        Blockchain
      </NativeLink>
      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="u-text--large"
        disabled
      >
        Blockchain
      </NativeLink>
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
        appearance="system"
        className="u-text--medium"
      >
        Blockchain
      </NativeLink>
      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        appearance="system"
        icon="link"
        className="u-text--xsmall"
      >
        /lotus/miner
      </NativeLink>
      <NativeLink
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        appearance="system"
        icon="link"
        className="u-text--xsmall"
        disabled
      >
        /lotus/miner
      </NativeLink>
    </ColumnLayout>
  </Wrapper>
)

export const Sizing = () => (
  <Wrapper>
    <ColumnLayout>
      <NativeLink
        href="https://www.google.com/"
        appearance="default"
        target="_blank"
        rel="noopener noreferrer"
        className="u-text--large"
      >
        Large
      </NativeLink>
      <NativeLink
        href="https://www.google.com/"
        appearance="default"
        target="_blank"
        rel="noopener noreferrer"
      >
        Regular
      </NativeLink>
      <NativeLink
        href="https://www.google.com/"
        appearance="default"
        target="_blank"
        rel="noopener noreferrer"
        className="u-text--small"
      >
        Small
      </NativeLink>
      <NativeLink
        appearance="default"
        href="https://www.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="u-text--xsmall"
      >
        XS Small
      </NativeLink>
    </ColumnLayout>
  </Wrapper>
)

const Wrapper = styled(BoxLayout)`
  margin: 1.3rem 0;
`
