import React from 'react'

import { Box, BoxLayout, BoxLayoutGap } from './BoxLayout'

export default {
  title: 'Layout/BoxLayout',
  component: Box,
  argTypes: {
    gap: {
      name: 'gap',
      defaultValue: 1,
      options: BoxLayoutGap,
      control: {
        type: 'select',
        label: 'gap',
      },
    },
  },
}

function Placeholder({ color }: { color: string }) {
  return (
    <div
      style={{
        background: color,
        minHeight: 120,
      }}
    />
  )
}

export const overview = args => (
  <BoxLayout {...args} style={{ background: '#f9d56e' }}>
    <Placeholder color="#e8505b" />
  </BoxLayout>
)

overview.story = {
  name: 'Overview',
}
