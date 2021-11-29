import { DetailedView as ChartView } from '@/components/system/DetailedView'
import { Overview } from '@/components/system/Overview'
import { PageContainer } from '@/containers/PageContainer'
import { Icon, PageLayout, Text, usePageLayout } from '@filecoin/ui'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

const TABS = ['overview', 'detailedView'] as const
type Tab = typeof TABS[number]

interface HeaderProps {
  activeTab: Tab
  onTabChange: (Tab) => void
}

const Header = (props: HeaderProps) => {
  const { t } = useTranslation()
  return (
    <PageLayout.Header>
      <Text type="heading 5" bold>
        {t('filecoin.systems.systems')}
      </Text>
      <PageLayout.Tabs>
        <PageLayout.Tab
          onClick={() => {
            props.onTabChange('overview')
          }}
          active={props.activeTab === 'overview'}
        >
          <Icon name="book" size="small" />
          <Text color="textGray">Overview</Text>
        </PageLayout.Tab>
        <PageLayout.Tab
          onClick={() => props.onTabChange('detailedView')}
          active={props.activeTab === 'detailedView'}
        >
          <Icon name="detailed_view" size="small" />
          <Text color="textGray">Detailed view</Text>
        </PageLayout.Tab>
      </PageLayout.Tabs>
    </PageLayout.Header>
  )
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

  const [activeTab, setActiveTab] = useState<Tab>(
    new URLSearchParams(window.location.search).get('tab') as Tab,
  )

  const pageLayout = usePageLayout({
    header: (
      <Header activeTab={activeTab} onTabChange={tab => setActiveTab(tab)} />
    ),
    footer: <PageLayout.Footer />,
  })

  useEffect(() => {
    if (!TABS.includes(activeTab)) {
      setActiveTab('overview')
    } else {
      navigate({
        search: `?tab=${activeTab}`,
      })

      pageLayout.setHeader(
        <Header activeTab={activeTab} onTabChange={tab => setActiveTab(tab)} />,
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
