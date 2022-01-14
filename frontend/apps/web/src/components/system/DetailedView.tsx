import { BehaviorModal } from '@/components/behaviors/BehaviorModal'
import { TestModal } from '@/components/tests/TestModal'
import { PageContainer } from '@/containers/PageContainer'
import { useHorizontalScroll } from '@/hooks/useHorisontalScroll'
import {
  Behavior,
  BehaviorStatus,
  System,
  Test,
  TestKind,
  TestQueryParams
} from '@filecoin/types'
import {
  BoxLayout,
  CardLayout,
  ColumnLayout,
  MatrixMap,
  Modal,
  StackLayout, TestLegend, Text
} from '@filecoin/ui'
import { partition } from 'lodash'
import qs from 'query-string'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'


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

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [testKinds])

  const scrollRef = useHorizontalScroll();
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

      <BoxLayout gap={1.5} >
          <MatrixWrapper ref={scrollRef}>
        <StackLayout gap={1}>
          <ColumnLayout
              className={'c-matrix__header'}
              gap={1} >
                
            <span/>
            {testKinds.map(testKind => {
              return (
                <Text key={testKind} color="textGray">
                  {testKind}
                </Text>
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
                
                {testKinds.map(testKind => {
                  // figure out which behaviors are tested for the current test kind
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
                    <MatrixMap
                      key={testKind}
                      data={behaviorData}
                      onClick={(b: Behavior) => {
                        const behavior = allBehaviors.find(
                          behavior => behavior.id === b.id,
                        )

                        if (behavior) {
                          setTestBehavior(
                            allBehaviors.find(behavior => behavior.id === b.id),
                          )

                          navigate(
                            {
                              search: `?${qs.stringify({
                                ...queryParams,
                                behaviorId: behavior.id,
                              })}`,
                            },
                            { replace: true },
                          )
                        }
                      }}
                    />                   
                  )
                })}
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
     display: flex;
      align-items: end;
      }
    }
  }

  .c-matrix__row {
    > span:first-child {
      display: flex;
      align-items: end;
      width: 100px;
      min-width: 100px;
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
