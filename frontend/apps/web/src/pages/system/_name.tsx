import React from 'react'
import {
  MatrixMap,
  PageLayout,
  StackLayout,
  Text,
  usePageLayout,
  CardLayout,
  ColumnLayout,
  BoxLayout,
  Colors,
} from '@filecoin/ui'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { PageContainer } from '@/containers/PageContainer'

const RepositoryDetails = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const params: { name: string } = useParams()
  const { t } = useTranslation()
  const system = model.findSystemByName(params.name)
  const testKinds = model.getAllTestKinds()
  const totalTests = system.subsystems.reduce((totalTests, subsystem) => {
    return totalTests + subsystem.tests.length
  }, 0)

  const pageLayout = usePageLayout({
    header: (
      <PageLayout.Header>
        <StackLayout>
          <Text type="heading 5">Systems</Text>
        </StackLayout>
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
        <DetailedView>
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
        </DetailedView>
      </PageLayout.Section>
    </PageLayout>
  )
}

//TODO make it pretty and separate to a component
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

const DetailedView = styled(CardLayout)`
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

export default RepositoryDetails
