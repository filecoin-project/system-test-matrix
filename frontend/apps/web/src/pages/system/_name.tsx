import { PageLayout, Text, usePageLayout } from '@filecoin/ui'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'

import { PageContainer } from '@/containers/PageContainer'
import { DetailedView as ChartView } from '@/components/system/DetailedView'
import { Overview } from '@/components/system/Overview'
import { SystemHeader } from '@/components/system/SystemHeader'
import qs from 'query-string'

const TABS = ['overview', 'detailedView'] as const
type Tab = typeof TABS[number]

interface SystemQueryParams {
  tab?: 'overview' | 'detailedView'
  id?: string
}

const RepositoryDetails = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const params: { name: string } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const system = model.findSystemByName(params.name)
  const testKinds = model.getAllTestKinds()
  const totalTests = system.subsystems.reduce((totalTests, subsystem) => {
    return totalTests + subsystem.tests.length
  }, 0)

  const { id: testIdQueryParam, tab: tabQueryParam }: SystemQueryParams =
    qs.parse(location.search)
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
      navigate({
        search: `?tab=${activeTab}${
          testIdQueryParam ? `&id=${testIdQueryParam}` : ''
        }`,
      })

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
          {totalTests} {t('filecoin.system.totalTests')}
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
