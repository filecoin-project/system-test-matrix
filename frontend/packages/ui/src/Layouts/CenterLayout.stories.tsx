import React from 'react'

import { CenterLayout, Center, CenterLayoutGap } from './CenterLayout'

export default {
  title: 'Layout/CenterLayout',
  component: Center,
  argTypes: {
    centerText: {
      name: 'centerText',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    stretch: {
      name: 'stretch',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    gap: {
      name: 'gap',
      defaultValue: 1,
      options: CenterLayoutGap,
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
        minWidth: 300,
        minHeight: 100,
        color: '#fff',
      }}
    >
      Lorem ipsum dolor sit amet
    </div>
  )
}

export const overview = () => (
  <CenterLayout centerText style={{ background: '#f9d56e' }}>
    <Placeholder color="#e8505b" />
  </CenterLayout>
)

export const details = args => (
  <CenterLayout {...args} style={{ background: '#f9d56e' }}>
    <Placeholder color="#e8505b" />
    <Placeholder color="#e8505b" />
    <Placeholder color="#e8505b" />
  </CenterLayout>
)

details.story = {
  name: 'Details',
}
