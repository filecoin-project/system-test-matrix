import { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import { BoxLayout } from '..'
import { Button } from '../Button'

export default {
  title: 'Button',
  component: Button,
  argTypes: {},
} as Meta

export const System = () => (
  <Wrapper>
    <Row>Rounded Buttons</Row>
    <Row>
      <Column>
        <Button variant="rounded" size="small" color="success">
          Good
        </Button>
      </Column>
      <Column>
        <Button variant="rounded" size="small" color="error">
          Bad
        </Button>
      </Column>
      <Column>
        <Button variant="rounded" size="small" color="warning">
          Mediocre
        </Button>
      </Column>
      <Column>
        <Button variant="rounded" size="small" color="secondary">
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
        <Button variant="outline" size="medium">
          All Behaviours
        </Button>
      </Column>
      <Column>
        <Button variant="outline" size="medium">
          All Tests
        </Button>
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
`
const Row = styled.div`
  display: flex;
  margin: 1.3rem 0;
  width: 100%;
`
