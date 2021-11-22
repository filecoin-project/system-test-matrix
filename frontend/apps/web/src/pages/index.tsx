import { PageContainer } from '@/containers/PageContainer'
import {
  Button,
  Colors,
  Link,
  PageLayout,
  StackLayout,
  Table,
  Text,
  usePageLayout,
} from '@filecoin/ui'
import { styled } from '@storybook/theming'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = props => {
  // const [activeTab, setActiveTab] = useState(1)
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
    // <PageLayout.Header>
    //   <StackLayout>
    //     <Text type="heading 5">Systems</Text>
    //   </StackLayout>
    //   <PageLayout.Tabs>
    //     <NavLink to={'/system/overview'}>
    //       <PageLayout.Tab
    //         onClick={() => setActiveTab(1)}
    //         active={activeTab === 1}
    //       >
    //         <Icon name="book" size="small" />
    //         <Text>Overview</Text>
    //       </PageLayout.Tab>
    //     </NavLink>
    //     <NavLink to={'/system/detailed-view'}>
    //       <PageLayout.Tab
    //         onClick={() => setActiveTab(2)}
    //         active={activeTab === 2}
    //       >
    //         <Icon name="detailed_view" size="small" />
    //         <Text>Detailed view</Text>
    //       </PageLayout.Tab>
    //     </NavLink>
    //   </PageLayout.Tabs>
    // </PageLayout.Header>
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
              Cell: ({ data }) => {
                return (
                  <StackLayout>
                    <Link to="/system/Blockchain" appearance="system">
                      {data.name}
                    </Link>
                    <Subsystems>{data.subsystems.length} subsystems</Subsystems>
                  </StackLayout>
                )
              },
            },
            // testKinds: {
            //   header: 'Test Kinds',
            //   width: 222,
            //   Cell: ({ data }) => {
            //     return (
            //       <TreeMap
            //         onClick={() => navigate('/repository-details')}
            //         data={data.testKindStats.map(
            //           ({ value, description, color }) => {
            //             return { name: description, size: value, color }
            //           },
            //         )}
            //       />
            //     )
            //   },
            // },
            // testStatus: {
            //   header: 'Test Status',
            //   width: 222,
            //   Cell: ({ data }) => {
            //     return (
            //       <TreeMap
            //         onClick={() => navigate('/repository-details')}
            //         data={data.testStatusStats.map(
            //           ({ value, description, color }) => {
            //             return { name: description, size: value, color }
            //           },
            //         )}
            //       />
            //     )
            //   },
            // },
            score: {
              header: 'Score',
              width: 155,
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
