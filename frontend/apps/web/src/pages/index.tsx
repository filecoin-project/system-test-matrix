import {
  Button,
  NativeLink,
  PageLayout,
  StackLayout,
  Table,
  Text,
  TreeMap,
  usePageLayout,
} from '@filecoin/ui'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { RepositoryData } from '@/mocks'

const Dashboard = () => {
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
  const navigate = useNavigate()

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
                    onClick={() => navigate('/repository-details')}
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
                    onClick={() => navigate('/repository-details')}
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
          data={RepositoryData}
        />
      </PageLayout.Section>
    </PageLayout>
  )
}

export default Dashboard
