import { PageLayout, Text, usePageLayout } from '@filecoin/ui'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import qs from 'query-string'
import { TestQueryParams } from '@filecoin/types'

import { PageContainer } from '@/containers/PageContainer'
import { SystemHeader } from '@/components/system/SystemHeader'
import { Overview } from '@/components/system/Overview'
import { DetailedView as ChartView } from '@/components/system/DetailedView'

const TABS = ['overview', 'detailedView'] as const
type Tab = typeof TABS[number]

const RepositoryDetails = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const params = useParams<{ name: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const system = model.findSystemByName(params.name)
  const testKinds = model.getAllTestKinds()

  const numberOfBehaviors = system.subsystems.reduce(
    (prevValue, { behaviors = [] }) => [...prevValue, ...behaviors],
    [],
  ).length

  const { tab: tabQueryParam, ...queryParams }: TestQueryParams = qs.parse(
    location.search,
  )
  const [activeTab, setActiveTab] = useState<Tab>(tabQueryParam)

  const pageLayout = usePageLayout({
    header: (
      <SystemHeader
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        score={system.score}
        pageName={params.name}
      />
    ),
    footer: <PageLayout.Footer />,
  })

  useEffect(() => {
    if (!TABS.includes(activeTab)) {
      setActiveTab('overview')
    } else {
      navigate(
        {
          search: `?${qs.stringify({ ...queryParams, tab: activeTab })}`,
        },
        { replace: true },
      )

      pageLayout.setHeader(
        <SystemHeader
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
          score={system.score}
          pageName={params.name}
        />,
      )
    }
  }, [activeTab])

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <Text type={'subtitle l'} color={'gray80'}>
          {numberOfBehaviors} {t('filecoin.system.totalBehaviors')}
        </Text>
        {activeTab === 'overview' ? (
          <Overview system={system} />
        ) : activeTab === 'detailedView' ? (
          <ChartView testKinds={testKinds} system={system} />
        ) : null}
      </PageLayout.Section>
    </PageLayout>
  )
}

export default RepositoryDetails
