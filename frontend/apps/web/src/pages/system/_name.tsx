import { PageContainer } from '@/containers/PageContainer'
import {
  BoxLayout,
  CardLayout,
  Colors,
  ColumnLayout,
  Icon,
  MatrixMap,
  PageLayout,
  ProgressBar,
  StackLayout,
  Text,
  Table,
  NativeLink,
  Button,
  usePageLayout,
} from '@filecoin/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { AllTestKinds, AllTestStatus, Subsystems } from '@/mocks'

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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(1)

  const Header = () => {
    return (
      <PageLayout.Header>
        <StackLayout>
          <Text type="heading 5">Systems</Text>
        </StackLayout>
        <PageLayout.Tabs>
          <PageLayout.Tab
            onClick={() => setActiveTab(1)}
            active={activeTab === 1}
          >
            <Icon name="book" size="small" />
            <Text>Overview</Text>
          </PageLayout.Tab>
          <PageLayout.Tab
            onClick={() => setActiveTab(2)}
            active={activeTab === 2}
          >
            <Icon name="detailed_view" size="small" />
            <Text>Detailed view</Text>
          </PageLayout.Tab>
        </PageLayout.Tabs>
      </PageLayout.Header>
    )
  }
  const pageLayout = usePageLayout({
    header: <Header />,
    footer: <PageLayout.Footer />,
  })

  const renderOverview = () => (
    <Overview>
      <ProgressBarWrapper>
        <ProgressBar
          data={AllTestKinds}
          onClick={() => null}
          legend
        ></ProgressBar>
      </ProgressBarWrapper>
      <ProgressBarWrapper>
        <ProgressBar
          data={AllTestStatus}
          onClick={() => null}
          legend
        ></ProgressBar>
      </ProgressBarWrapper>
      <TableWrapper>
        <Text type={'subtitle l'}>Subsystems (4)</Text>
        <TableStyled
          variant="default"
          columns={{
            Subsystems: {
              header: 'Subsystem',
              width: 150,
              Cell: ({ data }) => <Text type="text s">{data.subsystem}</Text>,
            },
            testKinds: {
              header: 'Test Kinds',
              width: 225,
              Cell: ({ data }) => {
                return (
                  <ProgressBar
                    onClick={() => navigate('/repository-details')}
                    data={data.testKindsData.map(({ kind, percentage }) => ({
                      name: kind,
                      percentage,
                    }))}
                  />
                )
              },
            },
            testStatus: {
              header: 'Test Status',
              width: 225,
              Cell: ({ data }) => {
                return (
                  <ProgressBar
                    onClick={() => navigate('/repository-details')}
                    data={data.testStatusData.map(({ status, percentage }) => ({
                      name: status,
                      percentage,
                    }))}
                  />
                )
              },
            },
            score: {
              header: 'Score',
              width: 150,
              Cell: ({ index }) => {
                //TODO@voja update this when we have some logic
                if (index === 0) {
                  return (
                    <Button
                      onClick={() => navigate('/repository-details')}
                      variant="rounded"
                      size="small"
                      color="success"
                    >
                      Good
                    </Button>
                  )
                }
                if (index === 1) {
                  return (
                    <Button
                      onClick={() => navigate('/repository-details')}
                      variant="rounded"
                      size="small"
                      color="error"
                    >
                      Bad
                    </Button>
                  )
                }
                return (
                  <Button
                    onClick={() => navigate('/repository-details')}
                    variant="rounded"
                    size="small"
                    color="warning"
                  >
                    Mediocre
                  </Button>
                )
              },
            },
          }}
          data={Subsystems}
        />
      </TableWrapper>
    </Overview>
  )

  const renderDetailedView = () => (
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
  )

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <Text type={'subtitle l'} color={'gray80'}>
          {totalTests} {t('filecoin.system.totalTests')}
        </Text>
        {activeTab === 1 ? renderOverview() : renderDetailedView()}
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

const Overview = styled(StackLayout)`
  margin-top: 1.25rem;
`

const ProgressBarWrapper = styled(CardLayout)`
  max-width: 58.75rem;
  margin-bottom: 1rem;
  padding: 2.65rem 3.625rem;
`

const TableWrapper = styled(StackLayout)`
  margin-top: 2rem;
`

const TableStyled = styled(Table)`
  margin-top: 1rem;
`

export default RepositoryDetails
