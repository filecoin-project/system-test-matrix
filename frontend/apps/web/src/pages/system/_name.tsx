import { PageContainer } from '@/containers/PageContainer'
import {
  PageLayout,
  StackLayout,
  Text,
  Icon,
  usePageLayout,
} from '@filecoin/ui'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { DetailedView } from '@/components/system/DetailedView'
import { Overview } from '@/components/system/Overview'

const RepositoryDetails = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const params: { name: string } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const system = model.findSystemByName(params.name)
  const totalTests = system.subsystems.reduce((totalTests, subsystem) => {
    return totalTests + subsystem.tests.length
  }, 0)

  const [activeTab, setActiveTab] = useState(
    new URLSearchParams(window.location.search).get('tab') || 'overview',
  )

  useEffect(() => {
    navigate({
      pathname: '/system/Blockchain/',
      search: `?tab=${activeTab}`,
    })
  }, [activeTab])

  const pageLayout = usePageLayout({
    header: (
      <PageLayout.Header>
        <StackLayout>
          <Text type="heading 5">Systems</Text>
        </StackLayout>
        <PageLayout.Tabs>
          <PageLayout.Tab
            onClick={() => setActiveTab('overview')}
            active={activeTab === 'overview'}
          >
            <Icon name="book" size="small" />
            <Text>Overview</Text>
          </PageLayout.Tab>
          <PageLayout.Tab
            onClick={() => setActiveTab('detailedView')}
            active={activeTab === 'detailedView'}
          >
            <Icon name="detailed_view" size="small" />
            <Text>Detailed view</Text>
          </PageLayout.Tab>
        </PageLayout.Tabs>
      </PageLayout.Header>
    ),
    footer: <PageLayout.Footer />,
  })

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <Text type={'subtitle l'} color={'gray80'}>
          {totalTests} {t('filecoin.system.totalTests')}
        </Text>
        {activeTab === 'overview' ? (
          <Overview model={model} modelName={params.name} />
        ) : (
          <DetailedView model={model} modelName={params.name} />
        )}
      </PageLayout.Section>
    </PageLayout>
  )
}

export default RepositoryDetails
