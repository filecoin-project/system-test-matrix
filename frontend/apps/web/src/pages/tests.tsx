import { PageContainer } from '@/containers/PageContainer'
import { filterItems } from '@filecoin/core'
import { SystemScore, TestStatus } from '@filecoin/types'
import {
  BoxLayout,
  Button,
  CardLayout,
  NativeLink,
  PageLayout,
  ProgressBar,
  SearchInput,
  StackLayout,
  Table,
  Text,
  TruncatedText,
  usePageLayout,
} from '@filecoin/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Header = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <PageLayout.Header>
      <HeaderWrapper>
        <Text type="heading 5" semiBold>
          {t('filecoin.allTests.allTests')}
        </Text>

        <Button
          onClick={() => navigate('/behaviors')}
          variant="outline"
          size="medium"
        >
          <Text type="text s" semiBold>
            {t('filecoin.allTests.allBehaviours')}
          </Text>
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
    <Button
      style={{ pointerEvents: 'none' }}
      variant="rounded"
      size="small"
      color={getColor()}
    >
      <Text color="white" type="text s" bold>
        {t(`filecoin.allTests.${status}`)}
      </Text>
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
  const [searchTerm, setSearchTerm] = useState('')
  const results = !searchTerm
    ? allTests
    : filterItems(allTests, searchTerm, 'functionName')

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
          <CardLayout shadow={false}>
            <BoxLayout gap={2}>
              <StackLayout gap={0.5}>
                <Text type="text xl" color="textGray" semiBold>
                  {t('filecoin.allTests.allKinds')}
                </Text>
                <ProgressBar legend data={allTestsKinds} />
              </StackLayout>
            </BoxLayout>
          </CardLayout>
          <CardLayout shadow={false}>
            <BoxLayout gap={2}>
              <StackLayout gap={0.5}>
                <Text type="text xl" color="textGray" semiBold>
                  {t('filecoin.allTests.allStatus')}
                </Text>
                <ProgressBar legend data={allTestsStatus} />
              </StackLayout>
            </BoxLayout>
          </CardLayout>
        </StackLayout>
      </PageLayout.Section>
      <PageLayout.Section>
        <StackLayout gap={1.25}>
          <StackLayout gap={1}>
            <Text type="text xl" color="textGray" semiBold>
              {t('filecoin.allTests.listOfAllTests')} ({allTests.length})
            </Text>
            <SearchInput
              onSearch={value => {
                setSearchTerm(value)
              }}
              value={searchTerm}
              placeholder="Search tests"
              autoFocus={false}
            />
          </StackLayout>

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
                        <Text type="text s" color="textGray">
                          {data.path}
                        </Text>
                      </StackLayout>
                    </TruncatedText>
                  )
                },
              },
              function: {
                header: t('filecoin.allTests.function'),
                width: 220,
                Cell: ({ data }) => {
                  return (
                    <TruncatedText>
                      <Text type="text s" color="textGray">
                        {data.functionName}
                      </Text>
                    </TruncatedText>
                  )
                },
              },
              repository: {
                header: t('filecoin.allTests.repository'),
                Cell: ({ data }) => {
                  return (
                    <NativeLink
                      href={`https://github.com/filecoin-project/${data.repository}`}
                      appearance="system"
                      target={'_blank'}
                      className={'u-text--xsmall'}
                    >
                      <Text type="text s" color="textGray">
                        {data.repository}
                      </Text>
                    </NativeLink>
                  )
                },
              },
              kinds: {
                header: t('filecoin.allTests.kinds'),
                Cell: ({ data }) => {
                  return (
                    <Text type="text s" color="textGray">
                      {data.kind}
                    </Text>
                  )
                },
              },
              behaviors: {
                header: t('filecoin.behaviors.title'),
                Cell: ({ data }) => {
                  return (
                    <Text type="text s" color="textGray">
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
            data={results}
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
