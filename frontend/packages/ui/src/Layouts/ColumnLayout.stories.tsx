import React from 'react'

import { ColumnLayout, ColumnLayoutGap, ScreenWidth } from './ColumnLayout'

export default {
  title: 'Layout/ColumnLayout',
  component: ColumnLayout,
  argTypes: {
    gap: {
      name: 'gap',
      defaultValue: 1,
      options: ColumnLayoutGap,
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
    center: {
      name: 'center',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    recursive: {
      name: 'recursive',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    top: {
      name: 'top',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    responsive: {
      name: 'responsive',
      defaultValue: 'mobile-large',
      options: ScreenWidth,
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
        width: 160,
      }}
    />
  )
}

export const overview = args => (
  <ColumnLayout style={{ minHeight: 400 }} {...args}>
    <Placeholder color="#e8505b" />
    <Placeholder color="#00FF00" />
    <Placeholder color="#FF00FF" />
  </ColumnLayout>
)

overview.story = {
  name: 'Overview',
}
