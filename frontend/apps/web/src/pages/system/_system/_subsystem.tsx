import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  PageLayout,
  Text,
  usePageLayout,
  ProgressBar,
  CardLayout,
  MatrixMap,
  ColumnLayout,
  StackLayout,
  TestLegend,
  Modal,
} from '@filecoin/ui'
import { Test, TestQueryParams } from '@filecoin/types'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import qs from 'query-string'
import ReactTooltip from 'react-tooltip'

import { TestModal } from '@/components/tests/TestModal'
import { SystemHeader } from '@/components/system/SystemHeader'
import { PageContainer } from '@/containers/PageContainer'

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
  const { id: testId }: TestQueryParams = qs.parse(location.search)
  const openedTest = testId
    ? subsystem.tests.find(test => testId && test.id === testId)
    : undefined

  const [testModal, setTestModal] = useState<Test | undefined>(openedTest)

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
        isOpen={!!testModal}
        onClose={() => {
          setTestModal(undefined)
          navigate(
            {
              search: '',
            },
            { replace: true },
          )
        }}
      >
        <TestModal test={testModal} />
      </Modal>
      <ReactTooltip
        effect="solid"
        getContent={data => {
          const { functionName, path, repository, linkedBehaviors } =
            JSON.parse(data) || {}

          if (functionName !== 'missing') {
            return (
              <>
                <div>
                  <b>Name</b>: <span>{functionName}</span>
                </div>

                <div>
                  <b>Path</b>: <span>{path}</span>
                </div>

                <div>
                  <b>Repository</b>: <span>{repository}</span>
                </div>
              </>
            )
          } else {
            return (
              <>
                <div>
                  <b>Untested behavior ID</b>:{' '}
                  <span>{linkedBehaviors[0].id}</span>
                </div>
                <div>
                  <b>Description</b>:{' '}
                  <span>{linkedBehaviors[0].description}</span>
                </div>
              </>
            )
          }
        }}
      />
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
              const behaviors = subsystem.behaviors.filter(b => b.tests.find(t => t.kind === testKind))
              return (
                <StackLayout key={testKind}>
                  <Text semiBold>{testKind}</Text>
                  <MatrixMap data={behaviors} onClick={() => null} />
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

const ProgressBarWrapper = styled(CardLayout)`
  max-width: 58.75rem;
  margin-bottom: 1rem;
  padding: 2.65rem 3.625rem;

  &:first-of-type {
    margin-top: 1rem;
  }
`

const TestsWrapper = styled(CardLayout)`
  padding: 2.5rem;
`
export default SubSystem
