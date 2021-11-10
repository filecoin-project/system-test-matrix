import React, { useEffect } from 'react'

import { Card, CardLayout } from './CardLayout'
import { CenterLayout } from './CenterLayout'
import { PageLayout, usePageLayout } from './PageLayout'
import { PageLayoutHeader } from './PageLayoutHeader'

export default {
  title: 'Layout/CardLayout',
  component: Card,
  argTypes: {
    shadow: {
      name: 'shadow',
      defaultValue: true,
      control: {
        type: 'boolean',
      },
    },
    border: {
      name: 'border',
      defaultValue: true,
      control: {
        type: 'boolean',
      },
    },
    background: {
      name: 'background',
      defaultValue: '#fff',
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
    <PageLayout style={{ backgroundColor: '#f9f9fe' }} {...nav}>
      <PageLayout.Section>
        <CenterLayout>
          <CardLayout
            style={{ height: 300, width: 250, textAlign: 'center' }}
            {...args}
          >
            <p>Lorem ipsum dolor sit amet</p>
          </CardLayout>
        </CenterLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}
overview.story = {
  name: 'Overview',
}
