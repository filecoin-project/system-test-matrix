import React from 'react'

import { Grid, GridLayout } from './GridLayout'

export default {
  title: 'Layout/GridLayout',
  component: Grid,
  argTypes: {},
}

function Placeholder({ color }: { color: string }) {
  return (
    <div
      style={{
        background: color,
        minHeight: 50,
      }}
    />
  )
}

export const details = () => (
  <GridLayout>
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <Placeholder color="#199fd5" />
    <GridLayout.Column span={2}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={2}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={2}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={2}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={2}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={2}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={3}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={3}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>{' '}
    <GridLayout.Column span={3}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>{' '}
    <GridLayout.Column span={3}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={3}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={4}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>{' '}
    <GridLayout.Column span={4}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>{' '}
    <GridLayout.Column span={6}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={6}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
    <GridLayout.Column span={12}>
      <Placeholder color="#199fd5" />
    </GridLayout.Column>
  </GridLayout>
)

details.story = {
  name: 'Details',
}
