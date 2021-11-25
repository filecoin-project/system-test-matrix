import { PageContainer } from '@/containers/PageContainer'
import { SystemScore, TestStatus } from '@filecoin/types'
import {
  BoxLayout,
  Button,
  CardLayout,
  Link,
  PageLayout,
  ProgressBar,
  StackLayout,
  Table,
  Text,
  TruncatedText,
  usePageLayout,
} from '@filecoin/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Header = props => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <PageLayout.Header>
      <HeaderWrapper>
        <Text type="heading 5">{t('filecoin.allTests.allTests')}</Text>

        <Button
          onClick={() => navigate('/behaviors')}
          variant="outline"
          size="medium"
        >
          {t('filecoin.allTests.allBehaviours')}
        </Button>
      </HeaderWrapper>
    </PageLayout.Header>
  )
}
export const getButton = (status: TestStatus | SystemScore) => {
  const { t } = useTranslation()

  const getColor = () => {
    if (Object.keys(TestStatus).includes(status)) {
      switch (status) {
        case TestStatus.pass: {
          return 'success'
        }
        case TestStatus.fail: {
          return 'error'
        }
        case TestStatus.missing: {
          return 'secondary'
        }
      }
    } else if (Object.keys(SystemScore).includes(status)) {
      switch (status) {
        case SystemScore.good: {
          return 'success'
        }
        case SystemScore.bad: {
          return 'error'
        }
        case SystemScore.mediocre: {
          return 'warning'
        }
      }
    }
  }

  return (
    <Button variant="rounded" size="small" color={getColor()}>
      {t(`filecoin.allTests.${status}`)}
    </Button>
  )
}
const AllTests = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const allTests = model.getAllTests()
  const { t } = useTranslation()

  const prepareAllTestsChart = () => {
    return Object.entries(
      allTests.reduce((d, test) => {
        d[test.kind] = (d[test.kind] || 0) + 1
        return d
      }, {}),
    ).map(([key, count]: any) => ({
      name: key,
      percentage: (count / allTests.length) * 100,
    }))
  }

  const allTestsKinds = prepareAllTestsChart()

  const prepareAllTestsStatus = () => {
    return Object.entries(
      allTests.reduce((d, test) => {
        d[test.status] = (d[test.status] || 0) + 1
        return d
      }, {}),
    ).map(([key, count]: any) => ({
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
        <StackLayout gap={1}>
          <CardLayout>
            <BoxLayout gap={2}>
              <StackLayout gap={0.5}>
                <Text type="text xl">{t('filecoin.allTests.allKinds')}</Text>
                <ProgressBar legend data={allTestsKinds} />
              </StackLayout>
            </BoxLayout>
          </CardLayout>
          <CardLayout>
            <BoxLayout gap={2}>
              <StackLayout gap={0.5}>
                <Text type="text xl">{t('filecoin.allTests.allStatus')}</Text>
                <ProgressBar legend data={allTestsStatus} />
              </StackLayout>
            </BoxLayout>
          </CardLayout>
        </StackLayout>
      </PageLayout.Section>
      <PageLayout.Section>
        <StackLayout gap={1.25}>
          <Text type="text xl">
            {t('filecoin.allTests.listOfAllTests')} ({allTests.length})
          </Text>

          <Table
            variant="default"
            columns={{
              suite: {
                header: t('filecoin.allTests.suite'),
                width: 220,
                Cell: ({ data }) => {
                  return (
                    <TruncatedText>
                      <StackLayout>
                        <Text type="text s">{data.path}</Text>
                        <Link
                          to={data.functionName}
                          appearance="system"
                          icon="link"
                          className="u-text--xsmall"
                        >
                          {data.functionName}
                        </Link>
                      </StackLayout>
                    </TruncatedText>
                  )
                },
              },
              function: {
                header: t('filecoin.allTests.function'),
                Cell: ({ data }) => {
                  return (
                    <TruncatedText>
                      <Text type="text s">{data.functionName}</Text>
                    </TruncatedText>
                  )
                },
              },
              repository: {
                header: t('filecoin.allTests.repository'),

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
                header: t('filecoin.allTests.kinds'),

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
                header: t('filecoin.behaviors.title'),

                Cell: ({ data }) => {
                  return (
                    <Text type="text s">
                      {data.linkedBehaviors.length}{' '}
                      {t('filecoin.allTests.behaviors')}
                    </Text>
                  )
                },
              },
              status: {
                header: t('filecoin.allTests.status'),
                Cell: ({ data }) => getButton(data.status),
              },
            }}
            data={allTests}
          />
        </StackLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}

export default AllTests

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    margin-top: auto;
    margin-bottom: auto;
  }
`
