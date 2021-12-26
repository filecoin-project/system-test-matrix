import { getButton } from '@/components/system/SystemHeader'
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
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <PageLayout.Header>
      <HeaderWrapper>
        <Text type="heading 5" semiBold>
          {t('filecoin.systems.systems')}
        </Text>
        <Buttons>
          <Button
            onClick={() => navigate('/tests')}
            variant="outline"
            size="medium"
          >
            <Text type="text s" semiBold>
              {t('filecoin.allTests.allTests')}
            </Text>
          </Button>
          <Button
            onClick={() => navigate('/behaviors')}
            variant="outline"
            size="medium"
          >
            <Text type="text s" semiBold>
              {t('filecoin.allTests.allBehaviours')}
            </Text>
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
              Cell: ({ data }) => {
                return (
                  <StackLayout gap={0.5}>
                    <Link to={`system/${data.name}`} appearance="system">
                      {data.name}
                    </Link>
                    <Text color="textGray">
                      {t('filecoin.systems.keyWithCount', {
                        count: data.subsystems.length,
                      })}
                    </Text>
                  </StackLayout>
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
                        ({ kind, ...rest }) => ({
                          name: kind,
                          ...rest,
                        }),
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
                        ({ status, ...rest }) => ({
                          name: status,
                          ...rest,
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
  button {
    &:first-child {
      margin-right: 10px;
    }
  }
`
const Bar = styled.div`
  width: 190px;
`
