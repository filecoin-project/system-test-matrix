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
import { TestModal } from '@/components/tests/TestModal'
import { PageContainer } from '@/containers/PageContainer'
import { useNavigate } from 'react-router-dom'
import qs from 'query-string'

interface Props {
  testKinds: TestKind[]
  system: System
}

export const DetailedView: React.FC<Props> = ({ testKinds, system }) => {
  const navigate = useNavigate()
  const {
    state: { model },
  } = PageContainer.useContainer()
  const allTests = model.getAllTests()
  const { id: testId }: TestQueryParams = qs.parse(location.search)
  const openedTest = allTests.find(test => test.id === testId)
  const [testModal, setTestModal] = useState<Test | undefined>(openedTest)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [testKinds])

  return (
    <Wrapper>
      <Modal
        isOpen={!!testModal}
        onClose={() => {
          setTestModal(undefined)
          navigate({
            search: '?tab=detailedView',
          })
        }}
      >
        <TestModal test={testModal} />
      </Modal>
      <ReactTooltip
        effect="solid"
        getContent={data => {
          const { functionName, path, repository } = JSON.parse(data) || {}
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
        }}
      />

      <BoxLayout gap={1.5}>
        <StackLayout gap={1}>
          <ColumnLayout className={'c-matrix__header'} gap={1}>
            {testKinds.map(testKind => {
              return <Text key={testKind}>{testKind}</Text>
            })}
          </ColumnLayout>

          {system.subsystems.map(subsystem => {
            return (
              <ColumnLayout
                className={'c-matrix__row'}
                gap={1}
                key={subsystem.name}
              >
                <Text>{subsystem.name}</Text>

                {testKinds.map(testKind => {
                  const tests = subsystem.tests.filter(
                    test => test.kind === testKind,
                  )

                  return (
                    <MatrixMap
                      key={testKind}
                      data={tests}
                      openModal={(test: Test) => {
                        setTestModal(test)
                        navigate({
                          search: `?tab=detailedView&id=${test.id}`,
                        })
                      }}
                      onClick={() => null}
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
