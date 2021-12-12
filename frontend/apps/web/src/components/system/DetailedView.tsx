import React, { useEffect, useState } from 'react'
import {
  BoxLayout,
  CardLayout,
  Colors,
  ColumnLayout,
  MatrixMap,
  StackLayout,
  Text,
  Modal,
} from '@filecoin/ui'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { System, TestKind, TestQueryParams, Test } from '@filecoin/types'
import { useNavigate } from 'react-router-dom'
import qs from 'query-string'

import { TestModal } from '@/components/tests/TestModal'
import { PageContainer } from '@/containers/PageContainer'
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
  const openedTest = allTests.find(
    test =>
      (behaviorId &&
        test.id === 'missing' &&
        test.linkedBehaviors[0].id === behaviorId) ||
      (testId && test.id === testId),
  )
  const [testModal, setTestModal] = useState<Test | undefined>(openedTest)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [testKinds])

  return (
    <Wrapper shadow={false}>
      <Modal
        isOpen={!!testModal}
        onClose={() => {
          setTestModal(undefined)
          navigate(
            {
              search: `?${qs.stringify(queryParams)}`,
            },
            { replace: true },
          )
        }}
      >
        {testModal?.id !== 'missing' ? (
          <TestModal test={testModal} />
        ) : (
          <BehaviorModal
            behavior={allBehaviors.find(
              behavior => behavior?.id && testModal?.linkedBehaviors[0]?.id,
            )}
          />
        )}
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

      <BoxLayout gap={1.5}>
        <StackLayout gap={1}>
          <ColumnLayout className={'c-matrix__header'} gap={1}>
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
                  const tests = subsystem.tests.filter(
                    test => test.kind === testKind,
                  )

                  return (
                    <MatrixMap
                      key={testKind}
                      data={tests}
                      onClick={(test: Test) => {
                        setTestModal(test)
                        navigate(
                          {
                            search: `?${qs.stringify({
                              ...queryParams,
                              behaviorId:
                                test.id === 'missing'
                                  ? test.linkedBehaviors[0].id
                                  : null,
                              id: test.id === 'missing' ? null : test.id,
                            })}`,
                          },
                          { replace: true },
                        )
                      }}
                    />
                  )
                })}
              </ColumnLayout>
            )
          })}

          <Legend>
            <div>
              Missing tests <div />
            </div>
            <div>
              Passing tests <div />
            </div>
            <div>
              Failing tests <div />
            </div>
          </Legend>
        </StackLayout>
      </BoxLayout>
    </Wrapper>
  )
}

const Wrapper = styled(CardLayout)`
  margin-top: 1.25rem;

  .c-matrix__header {
    padding-left: 116px;

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

const Legend = styled.div`
  display: flex;
  justify-content: end;
  color: ${Colors.textGray};

  > div {
    margin-left: 2rem;
    display: flex;
    align-items: center;

    > div {
      display: inline-block;
      width: 13px;
      height: 13px;
      border-radius: 3px;
      margin-left: 0.5rem;
    }

    &:first-child {
      > div {
        background: ${Colors.grayBtn};
      }
    }

    &:nth-child(2) {
      > div {
        background: ${Colors.greenBtn};
      }
    }

    &:last-child {
      > div {
        background: ${Colors.redBtn};
      }
    }
  }
`
