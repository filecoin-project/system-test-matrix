import { RepositoryData } from '@/mocks'
import {
  Button,
  Icon,
  NativeLink,
  PageLayout,
  StackLayout,
  Table,
  Text,
  TreeMap,
  usePageLayout,
} from '@filecoin/ui'
import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'

const Header = props => {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <PageLayout.Header>
      <StackLayout>
        <Text type="heading 5">Systems</Text>
      </StackLayout>
      <PageLayout.Tabs>
        <NavLink to={'/system/overview'}>
          <PageLayout.Tab
            onClick={() => setActiveTab(1)}
            active={activeTab === 1}
          >
            <Icon name="mind_puzzle" />
            <Text>Overview</Text>
          </PageLayout.Tab>
        </NavLink>
        <NavLink to={'/system/detailed-view'}>
          <PageLayout.Tab
            onClick={() => setActiveTab(2)}
            active={activeTab === 2}
          >
            <Icon name="book" />
            <Text>Detailed view</Text>
          </PageLayout.Tab>
        </NavLink>
      </PageLayout.Tabs>
    </PageLayout.Header>
  )
}
const Dashboard = () => {
  const pageLayout = usePageLayout({
    header: <Header />,
    footer: <PageLayout.Footer />,
  })
  const history = useHistory()

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <Table
          variant="default"
          columns={{
            repository: {
              header: 'Repository',
              Cell: ({ data }) => {
                return (
                  <StackLayout>
                    <Text>{data.projectName}</Text>
                    <NativeLink href={data.projectURL} target={'_blank'}>
                      {data.projectURL}
                    </NativeLink>
                  </StackLayout>
                )
              },
            },
            testKinds: {
              header: 'Test Kinds',
              width: 222,
              Cell: ({ data }) => {
                return (
                  <TreeMap
                    onClick={() => history.push('/repository-details')}
                    data={data.testKindsData.map(
                      ({ value, description, color }) => {
                        return { name: description, size: value, color }
                      },
                    )}
                  />
                )
              },
            },
            testStatus: {
              header: 'Test Status',
              width: 222,
              Cell: ({ data }) => {
                return (
                  <TreeMap
                    onClick={() => history.push('/repository-details')}
                    data={data.testStatusData.map(
                      ({ value, description, color }) => {
                        return { name: description, size: value, color }
                      },
                    )}
                  />
                )
              },
            },
            score: {
              header: 'Score',
              width: 155,
              Cell: ({ index }) => {
                //TODO@voja update this when we have some logic
                if (index === 0) {
                  return (
                    <Button
                      onClick={() => history.push('/repository-details')}
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
                      onClick={() => history.push('/repository-details')}
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
                    onClick={() => history.push('/repository-details')}
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
          data={RepositoryData}
        />
      </PageLayout.Section>
    </PageLayout>
  )
}

export default Dashboard
