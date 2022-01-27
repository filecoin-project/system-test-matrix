import { BehaviorModal } from '@/components/behaviors/BehaviorModal'
import MatrixReactTooltip from '@/components/system/MatrixReactTooltip'
import MatrixTestKindsMapper from '@/components/system/MatrixTestKindsMapper'
import ProgressBarWrapper from '@/components/system/ProgressBarWrapper'
import { SystemHeader } from '@/components/system/SystemHeader'
import { PageContainer } from '@/containers/PageContainer'
import { useHorizontalScroll } from '@/hooks/useHorisontalScroll'
import { Behavior, TestQueryParams } from '@filecoin/types'
import {
  CardLayout,
  ColumnLayout,
  Modal,
  PageLayout,
  ProgressBar,
  StackLayout,
  TestLegend,
  Text,
  usePageLayout,
} from '@filecoin/ui'
import qs from 'query-string'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

const SubSystem = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams<{ system: string; subsystem: string }>()
  const system = model.findSystemByName(params.system)
  const subsystem = system.subsystems.find(
    subsystem => subsystem.name === params.subsystem,
  )
  const testKinds = model.getAllTestKinds()
  const { id: behaviorId }: TestQueryParams = qs.parse(location.search)
  const allBehaviors = model.getAllBehaviors()
  const [testBehavior, setTestBehavior] = useState<Behavior | undefined>(
    behaviorId
      ? allBehaviors.find(behavior => behavior.id === behaviorId)
      : undefined,
  )

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
  const scrollRef = useHorizontalScroll()

  return (
    <PageLayout {...pageLayout}>
      <Modal
        isOpen={!!testBehavior}
        onClose={() => {
          setTestBehavior(undefined)
          navigate(
            {
              search: '',
            },
            { replace: true },
          )
        }}
      >
        <BehaviorModal behavior={testBehavior} />
      </Modal>
      <MatrixReactTooltip />
      <PageLayout.Section>
        <Text type={'subtitle l'} color={'gray80'}>
          {subsystem.behaviors.length} {t('filecoin.system.totalBehaviors')}
        </Text>
        <ProgressBarWrapper shadow={false}>
          <Text type="text xl">{t('filecoin.allTests.allKinds')}</Text>
          <ProgressBar
            data={subsystem.testStatistics.percentages.map(
              ({ kind, ...rest }) => ({
                name: kind,
                ...rest,
              }),
            )}
            legend
            tooltip={false}
          />
        </ProgressBarWrapper>
        <ProgressBarWrapper shadow={false}>
          <Text type="text xl">{t('filecoin.allTests.allStatus')}</Text>
          <ProgressBar
            data={subsystem.behaviorStatistics.percentages.map(
              ({ status, ...rest }) => ({
                name: status,
                ...rest,
              }),
            )}
            legend
            tooltip={false}
          />
        </ProgressBarWrapper>
      </PageLayout.Section>
      <PageLayout.Section>
        <TestsWrapper shadow={false}>
          <MatrixWrapper data-element="matrix-wrapper" ref={scrollRef}>
            <Wrapper gap={1}>
              <ColumnLayout className={'c-matrix__header'} gap={1}>
                {testKinds.map(testKind => {
                  return (
                    <Text key={testKind} color="textGray">
                      {testKind}
                    </Text>
                  )
                })}
              </ColumnLayout>
              <ColumnLayout gap={1}>
                <MatrixTestKindsMapper
                  testKinds={testKinds}
                  system={system}
                  subsystem={subsystem}
                  setTestBehavior={setTestBehavior}
                />
              </ColumnLayout>
            </Wrapper>
          </MatrixWrapper>
          <TestLegend />
        </TestsWrapper>
      </PageLayout.Section>
    </PageLayout>
  )
}
const Wrapper = styled(StackLayout)`
  .c-matrix__header {
    > * {
      min-width: 160px;
      width: 250px;
    }
  }
`
const MatrixWrapper = styled.div`
  display: flex;
  overflow-y: auto;
  padding-bottom: 2rem;
`
const TestsWrapper = styled(CardLayout)`
  padding: 2.5rem;
`
export default SubSystem
