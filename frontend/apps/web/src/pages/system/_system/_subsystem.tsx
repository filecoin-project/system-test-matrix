import React from 'react'
import { useParams } from 'react-router-dom'
import {
  PageLayout,
  Text,
  usePageLayout,
  ProgressBar,
  CardLayout,
  MatrixMap,
  ColumnLayout,
  BoxLayout,
  StackLayout,
  TestLegend,
} from '@filecoin/ui'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SystemHeader } from '@/components/system/SystemHeader'
import { PageContainer } from '@/containers/PageContainer'

const SubSystem = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const { t } = useTranslation()
  const params = useParams<{ system: string; subsystem: string }>()
  const system = model.findSystemByName(params.system)
  const subsystem = system.subsystems.find(
    subsystem => subsystem.name === params.subsystem,
  )
  const testKinds = model.getAllTestKinds()

  const pageLayout = usePageLayout({
    header: (
      <SystemHeader
        score={subsystem.score}
        pageName={subsystem.name}
        pageAncestors={[{ path: `/system/${system.name}`, name: system.name }]}
        hideTabs
      />
    ),
    footer: <PageLayout.Footer />,
  })

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <Text type={'subtitle l'} color={'gray80'}>
          {subsystem.tests.length} {t('filecoin.subsystem.totalTests')}
        </Text>
        <ProgressBarWrapper shadow={false}>
          <Text type="text xl">{t('filecoin.allTests.allKinds')}</Text>
          <ProgressBar
            data={subsystem.testKindStats.percentages.map(
              ({ kind, ...rest }) => ({
                name: kind,
                ...rest,
              }),
            )}
            legend
          />
        </ProgressBarWrapper>
        <ProgressBarWrapper shadow={false}>
          <Text type="text xl">{t('filecoin.allTests.allStatus')}</Text>
          <ProgressBar
            data={subsystem.testStatusStats.percentages.map(
              ({ status, ...rest }) => ({
                name: status,
                ...rest,
              }),
            )}
            legend
          />
        </ProgressBarWrapper>
      </PageLayout.Section>
      <PageLayout.Section>
        <BoxLayout gap={1.5}>
          <StackLayout gap={1.5}>
            <ColumnLayout
              className={'c-matrix__row'}
              gap={1}
              key={subsystem.name}
            >
              {testKinds.map(testKind => {
                const tests = subsystem.tests.filter(
                  test => test.kind === testKind,
                )
                return (
                  <StackLayout key={testKind}>
                    <Text semiBold>{testKind}</Text>
                    <MatrixMap data={tests} onClick={() => null} />
                  </StackLayout>
                )
              })}
            </ColumnLayout>
            <TestLegend />
          </StackLayout>
        </BoxLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}

const ProgressBarWrapper = styled(CardLayout)`
  max-width: 58.75rem;
  margin-bottom: 1rem;
  padding: 2.65rem 3.625rem;

  &:first-of-type {
    margin-top: 1rem;
  }
`

export default SubSystem
