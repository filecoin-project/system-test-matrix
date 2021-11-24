import { PageContainer } from '@/containers/PageContainer'
import {
  Button,
  Colors,
  Link,
  PageLayout,
  ProgressBar,
  Table,
  Text,
  usePageLayout,
} from '@filecoin/ui'
import { styled } from '@storybook/theming'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const allTests = model.getAllTests()
  const navigate = useNavigate()

  const Header = props => {
    const navigate = useNavigate()
    return (
      <PageLayout.Header>
        <HeaderWrapper>
          <Text type="heading 5">All Tests</Text>
          <Buttons>
            <Button
              onClick={() => navigate('/repository-details')}
              variant="outline"
              size="medium"
            >
              All Behaviours
            </Button>
          </Buttons>
        </HeaderWrapper>
      </PageLayout.Header>
    )
  }

  const prepareAllTestsChart = () => {
    return Object.entries(
      allTests.reduce(
        (d, test) => {
          if (test.kind === 'e2e') {
            d.e2e += 1
          } else if (test.kind === 'benchmark') {
            d.benchmark += 1
          } else if (test.kind === 'api') {
            d.api += 1
          } else if (test.kind === 'integration') {
            d.api += 1
          } else if (test.kind === 'unit') {
            d.api += 1
          }
          return d
        },
        {
          e2e: 0,
          benchmark: 0,
          api: 0,
          integration: 0,
          unit: 0,
        },
      ),
    ).map(([key, count]) => ({
      name: key,
      percentage: (count / allTests.length) * 100,
    }))
  }

  const allTestsKinds = prepareAllTestsChart()

  const prepareAllTestsStatus = () => {
    return Object.entries(
      allTests.reduce(
        (d, test) => {
          if (test.status === 'pass') {
            d.pass += 1
          } else if (test.status === 'fail') {
            d.fail += 1
          } else {
            d.missing += 1
          }
          return d
        },
        {
          pass: 0,
          fail: 0,
          missing: 0,
        },
      ),
    ).map(([key, count]) => ({
      name: key,
      percentage: (count / allTests.length) * 100,
    }))
  }
  const allTestsStatus = prepareAllTestsStatus()
  const pageLayout = usePageLayout({
    header: <Header />,
    footer: <PageLayout.Footer />,
  })
  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <BarWrapper>
          <Text type="text xl">All Tests Kinds</Text>
          <ProgressBar
            legend
            onClick={() => navigate('/repository-details')}
            data={allTestsKinds.map(({ name, percentage }) => ({
              name,
              percentage,
            }))}
          />
        </BarWrapper>
        <BarWrapper>
          <Text type="text xl">All Tests Status</Text>
          <ProgressBar
            legend
            onClick={() => navigate('/repository-details')}
            data={allTestsStatus.map(({ name, percentage }) => ({
              name,
              percentage,
            }))}
          />
        </BarWrapper>
        <Heading>
          <Text type="text xl">List of all tests ({allTests.length})</Text>
        </Heading>
        <Table
          variant="default"
          columns={{
            suite: {
              header: 'Suite',
              width: 220,
              Cell: ({ data }) => {
                return (
                  <>
                    <Text type="text s">
                      {data.id.split('/')[0]}
                      <br />
                    </Text>
                    <Link
                      to={data.id.split('/')[1]}
                      appearance="system"
                      icon="link"
                      className="u-text--xsmall"
                    >
                      {data.id.split('/')[1]}
                    </Link>
                  </>
                )
              },
            },
            function: {
              header: 'Function',
              Cell: ({ data }) => {
                return <Text type="text s">{data.functionName}</Text>
              },
            },
            repository: {
              header: 'Repository',

              Cell: ({ data }) => {
                return (
                  <Link
                    to={data.repository}
                    appearance="system"
                    className="u-text--xsmall"
                  >
                    {data.repository}
                  </Link>
                )
              },
            },
            kinds: {
              header: 'Kinds (tags)',

              Cell: ({ data }) => {
                return (
                  <Link
                    to={data.kind}
                    appearance="system"
                    className="u-text--xsmall"
                  >
                    {data.kind}
                  </Link>
                )
              },
            },
            behaviors: {
              header: 'Behaviors',

              Cell: ({ data }) => {
                return (
                  <Text type="text s">
                    {data.linkedBehaviors.length} behaviors
                  </Text>
                )
              },
            },
            status: {
              header: 'Status',
              Cell: ({ data }) => {
                if (data.status === 'pass') {
                  return (
                    <Button
                      onClick={() => navigate('/repository-details')}
                      variant="rounded"
                      size="small"
                      color="success"
                    >
                      Passing
                    </Button>
                  )
                }
                if (data.status === 'fail') {
                  return (
                    <Button
                      onClick={() => navigate('/repository-details')}
                      variant="rounded"
                      size="small"
                      color="error"
                    >
                      Failing
                    </Button>
                  )
                }
                if (data.status === 'missing') {
                  return (
                    <Button
                      onClick={() => navigate('/repository-details')}
                      variant="rounded"
                      size="small"
                      color="secondary"
                    >
                      Missing
                    </Button>
                  )
                }
              },
            },
          }}
          data={allTests}
        />
      </PageLayout.Section>
    </PageLayout>
  )
}

export default Dashboard

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const Buttons = styled.div`
  margin-top: auto;
  margin-bottom: auto;

  button {
    &:first-child {
      margin-right: 10px;
    }
  }
`

const BarWrapper = styled.div`
  min-height: 166px;
  margin-bottom: 1.125rem;
  padding: 1.75rem 3.625rem 0;
  border: 1px solid ${Colors.borderColor};
  border-radius: 0.625rem;

  &:nth-child(2) {
    margin-bottom: 2.875rem;
  }
`
const Heading = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
