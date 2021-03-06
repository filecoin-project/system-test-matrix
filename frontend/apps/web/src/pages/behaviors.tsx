import { BehaviorModal } from '@/components/behaviors/BehaviorModal'
import ProgressBarWrapper from '@/components/system/ProgressBarWrapper'
import { BreadCrumbs, getButton } from '@/components/system/SystemHeader'
import { PageContainer } from '@/containers/PageContainer'
import { getResultsWithFuseSearch } from '@filecoin/core'
import { Behavior } from '@filecoin/types'
import {
  Button,
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
  Tooltip,
  usePageLayout,
} from '@filecoin/ui'
import qs from 'query-string'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

interface BehaviorQueryParams {
  id?: string
}

const Behaviors = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const { t } = useTranslation()
  const invokedBehaviors = () =>
    model.getAllBehaviors().map(b => ({ ...b, status: b.status }))
  const behaviors = invokedBehaviors()
  const { id: behaviorId }: BehaviorQueryParams = qs.parse(location.search)
  const openedSystemId = behaviors.find(behavior => behavior.id === behaviorId)
  const [modalId, setModalId] = useState<Behavior | undefined>(
    openedSystemId as Behavior,
  )
  const [searchTerm, setSearchTerm] = useState(undefined)
  const [selectedFilter, setSelectedFilter] = useState(undefined)
  const [searchResults, setSearchResults] = useState(null)

  const prepareBehaviorChart = () => {
    return Object.entries(
      behaviors.reduce(
        (d, behavior) => {
          d[behavior.status] += 1
          return d
        },
        {
          untested: 0,
          tested: 0,
          partiallyTested: 0,
        },
      ),
    ).map(([key, count]) => ({
      name: key,
      percentage: (count / behaviors.length) * 100,
      numberOfTests: count,
    }))
  }

  const [behaviorChartData, setBehaviorChartData] = useState(
    prepareBehaviorChart(),
  )

  const navigate = useNavigate()
  const options = {
    threshold: 0.1,
    keys: ['description', 'id', 'feature', 'system', 'subsystem', 'status'],
  }
  const StatusOptions = {
    threshold: 0,
    keys: ['status'],
  }
  const filterOptions = [
    {
      label: 'All statuses',
      value: undefined,
    },
    {
      label: 'Tested',
      value: 'tested',
    },
    {
      label: 'Partially Tested',
      value: 'partiallyTested',
    },
    {
      label: 'Untested',
      value: 'untested',
    },
  ]
  const results = getResultsWithFuseSearch(
    behaviors,
    options,
    StatusOptions,
    searchTerm,
    selectedFilter,
    filterOptions,
  )

  const getPaginationData = (pageNum: number, pageLimit: number) => {
    return (
      searchResults &&
      searchResults.slice(pageNum * pageLimit - pageLimit, pageNum * pageLimit)
    )
  }

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
    header: (
      <PageLayout.Header>
        <HeaderWrapper>
          <BreadCrumbs pageName={t('filecoin.behaviors.title')} />

          <Button
            onClick={() => navigate('/tests')}
            variant="outline"
            size="medium"
          >
            <Text type="text s" semiBold>
              {t('filecoin.allTests.allTests')}
            </Text>
          </Button>
        </HeaderWrapper>
      </PageLayout.Header>
    ),
    footer: <PageLayout.Footer />,
  })

  const tableColumns = {
    id: {
      header: t('filecoin.behaviors.tableHeaders.behaviorId'),
      Cell: ({ data }) => {
        return (
          <Tooltip
            element={
              <NativeLink
                className="u-text--xsmall u-text-truncated"
                appearance="system"
                onClick={() => {
                  setModalId(data)
                  navigate(
                    {
                      search: `?id=${data.id}`,
                    },
                    { replace: true },
                  )
                }}
              >
                {data.id}
              </NativeLink>
            }
          >
            <Text color="textGray">{data.id}</Text>
          </Tooltip>
        )
      },
    },
    name: {
      header: t('filecoin.behaviors.tableHeaders.featureName'),
      Cell: ({ data: { feature } }) => {
        return <Text color="textGray">{feature}</Text>
      },
    },
    path: {
      header: t('filecoin.behaviors.tableHeaders.path'),
      Cell: ({ data: { subsystem } }) => {
        return <Text color="textGray">{subsystem}</Text>
      },
    },
    description: {
      header: t('filecoin.behaviors.tableHeaders.intendedBehavior'),
      Cell: ({ data: { description } }) => {
        return <Text color="textGray">{description}</Text>
      },
    },
    isTested: {
      header: t('filecoin.behaviors.tableHeaders.isTested'),
      width: 175,
      Cell: ({ data: { status } }) => getButton(status),
    },
  }

  useEffect(() => {
    setBehaviorChartData(prepareBehaviorChart())
  }, [])

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <ProgressBarWrapper shadow={false}>
          <StackLayout gap={0.5}>
            <Text type={'subtitle l'} color="textGray" semiBold>
              {t('filecoin.behaviors.behaviorStatus')}
            </Text>
            <ProgressBar data={behaviorChartData} legend />
          </StackLayout>
        </ProgressBarWrapper>
      </PageLayout.Section>

      <PageLayout.Section>
        <Modal
          isOpen={!!modalId}
          onClose={() => {
            setModalId(undefined)
            navigate(
              {
                search: '',
              },
              { replace: true },
            )
          }}
        >
          <BehaviorModal behavior={modalId} />
        </Modal>

        <StackLayout gap={1.25}>
          <StackLayout gap={1}>
            <Text type="subtitle l" color="textGray" semiBold>
              {t('filecoin.behaviors.listOfAllBehaviors')} ({behaviors.length})
            </Text>
            <SearchAndFilterWrapper>
              <SearchInput
                onSearch={value => {
                  setSearchTerm(value)
                }}
                value={searchTerm}
                placeholder="Search behaviors"
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
          <Table data={paginatedData.data} columns={tableColumns} />
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

export default Behaviors

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    margin-top: auto;
    margin-bottom: auto;
  }
`
const SearchAndFilterWrapper = styled.div`
  display: flex;

  [data-element='dropdown'] {
    max-width: 181px;
    margin-left: auto;
  }
`
