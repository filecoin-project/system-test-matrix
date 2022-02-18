import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CenterLayout, StackLayout, Text } from '../..'
import { Button } from '../../Button'

export default {
  title: 'Button/All Button Stories',
  component: Button,
  parameters: {
    controls: {
      disable: true,
    },
  },
} as ComponentMeta<typeof Button>

export const System: ComponentStory<typeof Button> = () => (
  <CenterLayout>
    <StackLayout gap={2}>
      <Text type="text m" align="center">
        Rounded Buttons
      </Text>

      <Button variant="rounded" size="small" color="success">
        Good
      </Button>

      <Button variant="rounded" size="small" color="error">
        Bad
      </Button>

      <Button variant="rounded" size="small" color="warning">
        Mediocre
      </Button>

      <Button variant="rounded" size="small" color="secondary">
        Missing
      </Button>
    </StackLayout>
  </CenterLayout>
)

export const Ghost: ComponentStory<typeof Button> = () => (
  <CenterLayout>
    <StackLayout gap={2}>
      <Text type="text m" align="center">
        Ghost Buttons
      </Text>

      <Button variant="outline" size="medium">
        All Behaviours
      </Button>

      <Button variant="outline" size="medium">
        All Tests
      </Button>
    </StackLayout>
  </CenterLayout>
)
