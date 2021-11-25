import { PageContainer } from '@/containers/PageContainer'
import {
  Button,
  Link,
  PageLayout,
  ProgressBar,
  StackLayout,
  Table,
  Text,
  usePageLayout,
} from '@filecoin/ui'
import { styled } from '@storybook/theming'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getButton } from './all-tests'

const Header = props => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <PageLayout.Header>
      <HeaderWrapper>
        <Text type="heading 5">{t('filecoin.systems.systems')}</Text>
        <Buttons>
          <Button
            onClick={() => navigate('/all-tests')}
            variant="outline"
            size="medium"
          >
            {t('filecoin.allTests.allTests')}
          </Button>
          <Button
            onClick={() => navigate('/behaviors')}
            variant="outline"
            size="medium"
          >
            {t('filecoin.allTests.allBehaviours')}
          </Button>
        </Buttons>
      </HeaderWrapper>
    </PageLayout.Header>
  )
}
const Home = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()

  const { t } = useTranslation()
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
            system: {
              header: t('filecoin.systems.system'),
              width: 325,

              Cell: ({ data }) => {
                return (
                  <Bar>
                    <StackLayout>
                      <Link to={`system/${data.name}`} appearance="system">
                        {data.name}
                      </Link>
                      <Text color="textGray">
                        {data.subsystems.length === 1
                          ? `${data.subsystems.length} ${t(
                              'filecoin.systems.subsystem',
                            )}`
                          : `${data.subsystems.length} ${t(
                              'filecoin.systems.subsystems',
                            )}`}
                      </Text>
                    </StackLayout>
                  </Bar>
                )
              },
            },
            testKinds: {
              header: t('filecoin.systems.testKinds'),
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
              header: t('filecoin.systems.testStatus'),
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
              header: t('filecoin.systems.score'),
              width: 200,
              Cell: ({ data }) => getButton(data.score),
            },
          }}
          data={systems}
        />
      </PageLayout.Section>
    </PageLayout>
  )
}

export default Home

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
