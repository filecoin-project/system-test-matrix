import { TestModal } from '@/components/tests/TestModal'
import { PageContainer } from '@/containers/PageContainer'
import { getResultsWithFuseSearch } from '@filecoin/core'
import { SystemScore, Test, TestQueryParams, TestStatus } from '@filecoin/types'
import {
  Button,
  CardLayout,
  Dropdown,
  Modal,
  NativeLink,
  PageLayout,
  Pager,
  Paginator,
  ProgressBar,
  SearchInput,
  StackLayout,
  Table,
  Text,
  TruncatedText,
  usePageLayout,
} from '@filecoin/ui'
import qs from 'query-string'
import React, { useEffect, useState } from 'react'
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

const AllTests: React.FC = () => {
  const navigate = useNavigate()
  const {
    state: { model },
  } = PageContainer.useContainer()
  const allTests = model.getAllTests()
  const { t } = useTranslation()
  const { id: testId }: TestQueryParams = qs.parse(location.search)
  const openedTest = allTests.find(test => test.id === testId)
  const [testModal, setTestModal] = useState<Test | undefined>(openedTest)

  const prepareAllTestsChart = () => {
    return Object.entries(
      allTests.reduce((d, test) => {
        d[test.kind] = (d[test.kind] || 0) + 1
        return d
      }, {}),
    ).map(([key, count]: any) => ({
      name: key,
      percentage: (count / allTests.length) * 100,
      numberOfTests: count,
    }))
  }

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
      numberOfTests: count,
    }))
  }

  const allTestsStatus = prepareAllTestsStatus()
  const allTestsKinds = prepareAllTestsChart()

  const [searchTerm, setSearchTerm] = useState(undefined)
  const [selectedFilter, setSelectedFilter] = useState(undefined)
  const [searchResults, setSearchResults] = useState(null)

  const options = {
    threshold: 0.1,
    keys: ['functionName', 'id', 'kind', 'path', 'repository', 'status'],
  }
  const StatusOptions = {
    keys: ['status'],
  }

  const filterOptions = [
    {
      label: 'All statuses',
      value: undefined,
    },
    {
      label: 'Passing',
      value: 'pass',
    },
    {
      label: 'Failing',
      value: 'fail',
    },
    {
      label: 'Missing',
      value: 'missing',
    },
  ]

  const results = getResultsWithFuseSearch(
    allTests,
    options,
    StatusOptions,
    searchTerm,
    selectedFilter,
    filterOptions,
  )

  const getPaginationData = (pageNum: number, pageLimit: number) =>
    searchResults &&
    searchResults.slice(pageNum * pageLimit - pageLimit, pageNum * pageLimit)

  const [paginatedData, setPaginatedData] = useState({
    data: getPaginationData(1, 5),
    pageNum: 1,
    pageLimit: 5,
  })

  const onPagination = (pageNum: number) =>
    setPaginatedData({
      data: getPaginationData(pageNum, paginatedData.pageLimit),
      pageNum,
      pageLimit: paginatedData.pageLimit,
    })

  const onPageLimitChange = (dataPerPage: number) => {
    setPaginatedData({
      data: getPaginationData(1, dataPerPage),
      pageNum: 1,
      pageLimit: dataPerPage,
    })
  }
  useEffect(() => {
    setSearchResults(results)
  }, [selectedFilter, searchTerm])

  useEffect(() => {
    setPaginatedData({
      data: getPaginationData(1, 5),
      pageNum: 1,
      pageLimit: 5,
    })
  }, [searchResults])

  const pageLayout = usePageLayout({
    header: <Header />,
    footer: <PageLayout.Footer />,
  })

  return (
    <PageLayout {...pageLayout}>
      <Modal
        isOpen={!!testModal}
        onClose={() => {
          setTestModal(undefined)
          navigate(
            {
              search: '',
            },
            { replace: true },
          )
        }}
      >
        <TestModal test={testModal} />
      </Modal>
      <PageLayout.Section>
        <StackLayout gap={1}>
          <ProgressBarWrapper shadow={false}>
            <StackLayout gap={0.5}>
              <Text type="text xl" color="textGray" semiBold>
                {t('filecoin.allTests.allKinds')}
              </Text>
              <ProgressBar legend data={allTestsKinds} />
            </StackLayout>
          </ProgressBarWrapper>
          <ProgressBarWrapper shadow={false}>
            <StackLayout gap={0.5}>
              <Text type="text xl" color="textGray" semiBold>
                {t('filecoin.allTests.allStatus')}
              </Text>
              <ProgressBar legend data={allTestsStatus} />
            </StackLayout>
          </ProgressBarWrapper>
        </StackLayout>
      </PageLayout.Section>
      <PageLayout.Section>
        <StackLayout gap={1.25}>
          <StackLayout gap={1}>
            <Text type="text xl" color="textGray" semiBold>
              {t('filecoin.allTests.listOfAllTests')} ({allTests.length})
            </Text>
            <SearchAndFilterWrapper>
              <SearchInput
                onSearch={value => {
                  setSearchTerm(value)
                }}
                value={searchTerm}
                placeholder="Search tests"
                width="58.75rem"
                autoFocus={false}
              />
              <Dropdown
                placeholder="All statuses"
                name="score"
                options={filterOptions}
                value={selectedFilter}
                onChange={e => {
                  setSelectedFilter(e.value)
                }}
              />
            </SearchAndFilterWrapper>
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
                      <NativeLink
                        className={'u-text--xsmall'}
                        appearance={'system'}
                        onClick={() => {
                          setTestModal(data as Test)
                          navigate(
                            {
                              search: `?id=${data.id}`,
                            },
                            { replace: true },
                          )
                        }}
                      >
                        <Text type="text s" color="blue">
                          {data.path}
                        </Text>
                      </NativeLink>
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
                      {data.kind || 'unknown'}
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
            data={paginatedData.data}
          />
        </StackLayout>
        <Pager
          currentPage={paginatedData.pageNum}
          totalRecords={searchResults && searchResults.length}
          pageLimit={paginatedData.pageLimit}
          onChange={onPageLimitChange}
        />
        <Paginator
          onPagination={onPagination}
          currentPage={paginatedData.pageNum}
          totalRecords={searchResults && searchResults.length}
          pageLimit={paginatedData.pageLimit}
          isFetching={false}
        />
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
const ProgressBarWrapper = styled(CardLayout)`
  max-width: 58.75rem;
  margin-bottom: 1rem;
  padding: 2.65rem 3.625rem;
`
const SearchAndFilterWrapper = styled.div`
  display: flex;

  [data-element='dropdown'] {
    max-width: 181px;
    margin-left: auto;
  }
`
