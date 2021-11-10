import React from 'react'

import { Stack, StackLayout, StackLayoutGap } from './StackLayout'

export default {
  title: 'Layout/StackLayout',
  component: Stack,
  argTypes: {
    center: {
      name: 'center',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    gap: {
      name: 'gap',
      defaultValue: 1,
      options: StackLayoutGap,
      control: {
        type: 'select',
        label: 'gap',
      },
    },
    split: {
      name: 'split',
      options: [-1, 1, 2, 3, 4, [1, 2], [2, -1]],
      control: {
        type: 'select',
      },
    },
  },
}

function Placeholder({ color }: { color: string }) {
  return (
    <div
      style={{
        background: color,
        minHeight: 50,
        width: 300,
      }}
    />
  )
}

export const overview = args => (
  <StackLayout {...args}>
    <Placeholder color="#e8505b" />
    <Placeholder color="#f2aaaa" />
    <Placeholder color="#f9d56e" />
    <Placeholder color="#14b1ab" />
  </StackLayout>
)

export const details = args => (
  <StackLayout {...args}>
    <Placeholder color="#e8505b" />
    <Placeholder color="#f2aaaa" />
    <div>
      <Placeholder color="#f9d56e" />
      <Placeholder color="#f69e7b" />
    </div>
    <Placeholder color="#14b1ab" />
  </StackLayout>
)

details.story = {
  name: 'Details',
}
