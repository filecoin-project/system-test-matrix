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

const Header = props => {
  const navigate = useNavigate()
  return (
    <PageLayout.Header>
      <HeaderWrapper>
        <Text type="heading 5">Systems</Text>
        <Buttons>
          <Button
            onClick={() => navigate('/repository-details')}
            variant="outline"
            size="medium"
          >
            All Tests
          </Button>
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
const Dashboard = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()

  const systems = model.getAllSystems()
  const navigate = useNavigate()
  const pageLayout = usePageLayout({
    header: <Header />,
    footer: <PageLayout.Footer />,
  })

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <Table
          variant="subtle"
          columns={{
            repository: {
              header: 'System',
              width: 225,
              padding: 4,

              Cell: ({ data }) => {
                return (
                  <>
                    <Link to="/system/Blockchain" appearance="system">
                      {data.name}
                    </Link>
                    <Subsystems>{data.subsystems.length} subsystems</Subsystems>
                  </>
                )
              },
            },
            testKinds: {
              header: 'Test Kinds',
              width: 350,
              padding: 4,
              Cell: ({ data }) => {
                return (
                  <ProgressBar
                    onClick={() => navigate('/repository-details')}
                    data={data.testKindStats.percentages.map(
                      ({ kind, percentage }) => ({ name: kind, percentage }),
                    )}
                  />
                )
              },
            },
            testStatus: {
              header: 'Test Status',
              width: 350,
              padding: 5,
              Cell: ({ data }) => {
                return (
                  <ProgressBar
                    onClick={() => navigate('/repository-details')}
                    data={data.testStatusStats.percentages.map(
                      ({ status, percentage }) => ({
                        name: status,
                        percentage,
                      }),
                    )}
                  />
                )
              },
            },
            score: {
              header: 'Score',
              width: 200,
              Cell: ({ data }) => {
                if (data.score === 'good') {
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
                if (data.score === 'bad') {
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
                if (data.score === 'mediocre') {
                  return (
                    <Button
                      onClick={() => navigate('/repository-details')}
                      variant="rounded"
                      size="small"
                      color="warning"
                    >
                      Bad
                    </Button>
                  )
                }
              },
            },
          }}
          data={systems}
        />
      </PageLayout.Section>
    </PageLayout>
  )
}

export default Dashboard

const Subsystems = styled.div`
  color: ${Colors.tableHeaderText};
`
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
const Bar = styled.div`
  width: 350px;
  padding-left: 80px;
  padding-right: 80px;
`
