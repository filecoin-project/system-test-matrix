import { BehaviorModal } from '@/components/behaviors/BehaviorModal'
import { TestModal } from '@/components/tests/TestModal'
import { PageContainer } from '@/containers/PageContainer'
import { useHorizontalScroll } from '@/hooks/useHorisontalScroll'
import {
  Behavior,
  System,
  Test,
  TestKind,
  TestQueryParams,
} from '@filecoin/types'
import {
  BoxLayout,
  CardLayout,
  ColumnLayout,
  Modal,
  StackLayout,
  TestLegend,
  Text,
} from '@filecoin/ui'
import qs from 'query-string'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import MatrixReactTooltip from './MatrixReactTooltip'
import MatrixTestKindsMapper from './MatrixTestKindsMapper'

interface Props {
  testKinds: TestKind[]
  system: System
}

export const DetailedView: React.FC<Props> = ({ testKinds, system }) => {
  const navigate = useNavigate()
  const {
    state: { model },
  } = PageContainer.useContainer()

  const allTests = system?.subsystems.reduce((allTests, subsystem) => {
    return [...allTests, ...subsystem.tests]
  }, [])

  const allBehaviors = model.getAllBehaviors()

  const {
    id: testId,
    behaviorId,
    ...queryParams
  }: TestQueryParams = qs.parse(location.search)
  const openedTest =
    testId && testId !== 'missing'
      ? allTests.find(test => testId && test.id === testId)
      : undefined

  const [testModal, setTestModal] = useState<Test | undefined>(openedTest)
  const [testBehavior, setTestBehavior] = useState<Behavior | undefined>(
    behaviorId
      ? allBehaviors.find(behavior => behavior.id === behaviorId)
      : undefined,
  )

  const scrollRef = useHorizontalScroll()
  return (
    <Wrapper shadow={false}>
      <Modal
        isOpen={!!(testModal || testBehavior)}
        onClose={() => {
          setTestModal(undefined)
          setTestBehavior(undefined)
          navigate(
            {
              search: `?${qs.stringify(queryParams)}`,
            },
            { replace: true },
          )
        }}
      >
        {testModal ? (
          <TestModal test={testModal} />
        ) : (
          <BehaviorModal behavior={testBehavior} />
        )}
      </Modal>
      <MatrixReactTooltip />
      <BoxLayout gap={1.5}>
        <MatrixWrapper ref={scrollRef}>
          <StackLayout gap={1}>
            <ColumnLayout className={'c-matrix__header'} gap={1}>
              <span />
              {testKinds.map(testKind => {
                return (
                  <>
                    <Text key={testKind} color="textGray">
                      {testKind}
                    </Text>
                  </>
                )
              })}
            </ColumnLayout>

            {system.subsystems.map(subsystem => {
              return (
                <ColumnLayout
                  className={'c-matrix__row'}
                  gap={1}
                  key={subsystem.name}
                >
                  <Text color="textGray" semiBold>
                    {subsystem.name}
                  </Text>
                  <MatrixTestKindsMapper
                    testKinds={testKinds}
                    system={system}
                    subsystem={subsystem}
                    setTestBehavior={setTestBehavior}
                  />
                </ColumnLayout>
              )
            })}
          </StackLayout>
        </MatrixWrapper>
        <TestLegend />
      </BoxLayout>
    </Wrapper>
  )
}

const Wrapper = styled(CardLayout)`
  margin-top: 1.25rem;

  .c-matrix__header {
    > * {
      min-width: 160px;
      width: 217px;

      &:first-child {
        width: 157px;
        min-width: 100px;
        position: sticky;
        left: 0;
        z-index: 1;
        background-color: white;
        display: flex;
        align-items: end;
      }
    }
  }

  .c-matrix__row {
    position: relative;

    > span:first-child {
      width: 100px;
      min-width: 100px;
      position: sticky;
      left: 0;
      z-index: 1;
      display: flex;
      align-items: end;
      background-color: white;
    }
  }
`
const MatrixWrapper = styled.div`
  display: flex;
  overflow-y: auto;
  padding-bottom: 2rem;
`

export const TooltipWrapper = styled.div`
  max-width: 400px;
`
