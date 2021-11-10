import React from 'react'

import { PageLayout, usePageLayout } from './PageLayout'
import { CoverLayout } from './CoverLayout'

export default {
  title: 'Layout/CoverLayout',
  component: CoverLayout,
  argTypes: {},
}

function Placeholder({ color }: { color: string }) {
  return (
    <div
      style={{
        background: color,
        minHeight: 120,
        minWidth: 240,
      }}
    />
  )
}

export const overview = () => (
  <PageLayout {...usePageLayout()}>
    <CoverLayout style={{ background: '#f9d56e' }}>
      <Placeholder color="#e8505b" />
    </CoverLayout>
  </PageLayout>
)

overview.story = {
  name: 'Overview',
}
