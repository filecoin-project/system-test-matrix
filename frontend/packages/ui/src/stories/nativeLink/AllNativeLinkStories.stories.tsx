import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import { BoxLayout } from '../../Layouts/BoxLayout'
import { ColumnLayout } from '../../Layouts/ColumnLayout'
import { NativeLink } from '../../NativeLink'

export default {
  title: 'NativeLink/All NativeLink Stories',
  component: NativeLink,
  parameters: {
    controls: {
      disable: true,
    },
  },
} as ComponentMeta<typeof NativeLink>
export const Default: ComponentStory<typeof NativeLink> = () => (
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

export const System: ComponentStory<typeof NativeLink> = () => (
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

export const Sizing: ComponentStory<typeof NativeLink> = () => (
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
