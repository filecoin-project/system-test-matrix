import { Meta } from '@storybook/react'
import { styled } from '@storybook/theming'
import React from 'react'
import { BoxLayout } from '..'
import { Button, ButtonAppearance } from '../Button'

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    appearance: {
      name: 'system',
      defaultValue: 'brand',
      options: ButtonAppearance,
    },
  },
} as Meta

export const System = () => (
  <Wrapper>
    <Row>System Buttons</Row>
    <Row>
      <Column>
        <Button appearance="system">Good</Button>
      </Column>
      <Column>
        <Button appearance="system" color="red">
          Bad
        </Button>
      </Column>
      <Column>
        <Button appearance="system" color="orange">
          Mediocre
        </Button>
      </Column>
      <Column>
        <Button appearance="system" color="gray">
          Missing
        </Button>
      </Column>
    </Row>
  </Wrapper>
)

export const Ghost = () => (
  <Wrapper>
    <Row>Ghost Buttons</Row>
    <Row>
      <Column>
        <Button appearance="ghost">All Behaviours</Button>
      </Column>
      <Column>
        <Button appearance="ghostSmall">All Tests</Button>
      </Column>
    </Row>
  </Wrapper>
)

const Wrapper = styled(BoxLayout)`
  display: flex;
  align-items: flex-start;
  flex-flow: row wrap;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 1.9rem;
  justify-content: center;
  flex: 1;

  &.badge {
    flex: none;
  }
`
const Row = styled.div`
  display: flex;
  margin: 1.3rem 0;
  width: 100%;
`
