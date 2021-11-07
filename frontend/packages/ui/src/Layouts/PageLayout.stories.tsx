import React, { useEffect } from 'react'

import { PageLayout, Page, usePageLayout } from './PageLayout'
import { PageLayoutHeader } from './PageLayoutHeader'
import { StackLayout } from './StackLayout'

export default {
  title: 'Layout/PageLayout',
  component: Page,
  argTypes: {
    header: {
      defaultValue: true,
      control: 'boolean',
    },
  },
}

export const overview = args => {
  const nav = usePageLayout()

  useEffect(() => {
    if (args.header) {
      nav.setHeader(<PageLayoutHeader>Header</PageLayoutHeader>)
    } else {
      nav.setHeader(null)
    }
  }, [args.header])

  return (
    <PageLayout {...nav}>
      <PageLayout.Section>
        <StackLayout center>Some Content</StackLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}
