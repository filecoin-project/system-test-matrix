import {
  Behavior,
  BehaviorStatus,
  System,
  Test,
  TestKind,
  TestQueryParams,
} from '@filecoin/types'
import {
  BoxLayout,
  CardLayout,
  ColumnLayout,
  MatrixMap,
  Modal,
  StackLayout,
  Text,
  TestLegend,
} from '@filecoin/ui'
import qs from 'query-string'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { partition } from 'lodash'

import { PageContainer } from '@/containers/PageContainer'
import { TestModal } from '@/components/tests/TestModal'
import { BehaviorModal } from '@/components/behaviors/BehaviorModal'

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

      <BoxLayout gap={1.5}>
        <StackLayout gap={1}>
          <ColumnLayout className={'c-matrix__header'} gap={1.5}>
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
                  const behaviors = subsystem.behaviors
                    .filter(behavior =>
                      behavior.expectedTestKinds.includes(testKind),
                    )
                    .map(b => ({ ...b, statusForKind: b.status }))
                    .sort((a, b) => a.id.localeCompare(b.id))

                  return (
                    <MatrixMap
                      key={testKind}
                      data={behaviors}
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

          <TestLegend />
        </StackLayout>
      </BoxLayout>
    </Wrapper>
  )
}

const Wrapper = styled(CardLayout)`
  margin-top: 1.25rem;

  .c-matrix__header {
    padding-left: 134px;

    > * {
      width: 160px;
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

export const TooltipWrapper = styled.div`
  max-width: 400px;
`
