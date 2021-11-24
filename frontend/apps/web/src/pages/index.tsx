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
              width: 325,

              Cell: ({ data }) => {
                return (
                  <Bar>
                    <Link to={`system/${data.name}`} appearance="system">
                      {data.name}
                    </Link>
                    <Subsystems>{data.subsystems.length} subsystems</Subsystems>
                  </Bar>
                )
              },
            },
            testKinds: {
              header: 'Test Kinds',
              width: 325,
              Cell: ({ data }) => {
                return (
                  <Bar>
                    <ProgressBar
                      onClick={() => navigate(`system/${data.name}`)}
                      data={data.testKindStats.percentages.map(
                        ({ kind, percentage }) => ({ name: kind, percentage }),
                      )}
                    />
                  </Bar>
                )
              },
            },
            testStatus: {
              header: 'Test Status',
              width: 325,
              Cell: ({ data }) => {
                return (
                  <Bar>
                    <ProgressBar
                      onClick={() => navigate(`system/${data.name}`)}
                      data={data.testStatusStats.percentages.map(
                        ({ status, percentage }) => ({
                          name: status,
                          percentage,
                        }),
                      )}
                    />
                  </Bar>
                )
              },
            },
            score: {
              header: 'Score',
              width: 200,
              Cell: ({ data }) => {
                if (data.score === 'good') {
                  return (
                    <Bar>
                      <Button
                        onClick={() => navigate(`system/${data.name}`)}
                        variant="rounded"
                        size="small"
                        color="success"
                      >
                        Good
                      </Button>
                    </Bar>
                  )
                }
                if (data.score === 'bad') {
                  return (
                    <Bar>
                      <Button
                        onClick={() => navigate(`system/${data.name}`)}
                        variant="rounded"
                        size="small"
                        color="error"
                      >
                        Bad
                      </Button>
                    </Bar>
                  )
                }
                if (data.score === 'mediocre') {
                  return (
                    <Bar>
                      <Button
                        onClick={() => navigate(`system/${data.name}`)}
                        variant="rounded"
                        size="small"
                        color="warning"
                      >
                        Bad
                      </Button>
                    </Bar>
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
  color: ${Colors.textGray};
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
  width: 325px;
  padding-right: 135px;
`
