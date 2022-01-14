import { BehaviorModal } from '@/components/behaviors/BehaviorModal'
import { TooltipWrapper } from '@/components/system/DetailedView'
import ProgressBarWrapper from '@/components/system/ProgressBarWrapper'
import { SystemHeader } from '@/components/system/SystemHeader'
import { PageContainer } from '@/containers/PageContainer'
import { Behavior, BehaviorStatus, TestQueryParams } from '@filecoin/types'
import {
  CardLayout, ColumnLayout, MatrixMap, Modal, PageLayout, ProgressBar, StackLayout,
  TestLegend, Text,
  usePageLayout
} from '@filecoin/ui'
import { partition } from 'lodash'
import qs from 'query-string'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
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
      <ReactTooltip
        effect="solid"
        multiline
        getContent={data => {
          const { id, feature, description } = JSON.parse(data) || {}

          return (
            <TooltipWrapper>
              <div>
                <b>Behavior ID</b>: <span>{id}</span>
              </div>

              <div>
                <b>Feature ID</b>: <span>{feature}</span>
              </div>

              <div>
                <b>Description</b>: <span>{description}</span>
              </div>
            </TooltipWrapper>
          )
        }}
      />
      <PageLayout.Section>
        <Text type={'subtitle l'} color={'gray80'}>
          {subsystem.behaviors.length} {t('filecoin.system.totalBehaviors')}
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
            tooltip={false}
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
            tooltip={false}
          />
        </ProgressBarWrapper>
      </PageLayout.Section>
      <PageLayout.Section>
        <TestsWrapper shadow={false}>
          <ColumnLayout
            className={'c-matrix__row'}
            gap={1}
            key={subsystem.name}
          >
            {testKinds.map(testKind => {
              // const behaviors = subsystem.behaviors.filter(b =>
              //   b.tests.find(t => t.kind === testKind),
              // )
              const [testedForKind, untestedForKind] = partition(
                subsystem.behaviors,
                b => b.tests.find(t => t.kind === testKind),
              )

              // behaviors tested for current kind should have status == pass
              const testedBehaviorData = testedForKind.map(b => ({
                ...b,
                statusForKind: BehaviorStatus.pass,
              }))

              // other behaviors have status == untested, except for behaviors in the "unknown" column
              // it doesn't make sense to tell the user that he should write an "unknown" test
              const untestedBehaviorData =
                testKind !== 'unknown'
                  ? untestedForKind.map(b => ({
                      ...b,
                      statusForKind: BehaviorStatus.untested,
                    }))
                  : []

              // sort the behaviors lexicographically, so it's easier to find a specific behavior in the matrix cell
              const behaviorData = testedBehaviorData
                .concat(untestedBehaviorData)
                .sort((a, b) => a.id.localeCompare(b.id))

              return (
                <StackLayout key={testKind}>
                  <Text semiBold>{testKind}</Text>
                  <MatrixMap
                    data={behaviorData}
                    onClick={(behavior: Behavior) => {
                      setTestBehavior(behavior)
                      navigate(
                        {
                          search: `?id=${behavior.id}`,
                        },
                        { replace: true },
                      )
                    }}
                  />
                </StackLayout>
              )
            })}
          </ColumnLayout>
          <TestLegend />
        </TestsWrapper>
      </PageLayout.Section>
    </PageLayout>
  )
}

const TestsWrapper = styled(CardLayout)`
  padding: 2.5rem;
`
export default SubSystem
