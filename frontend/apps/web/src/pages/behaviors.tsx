import { BehaviorModal } from '@/components/behaviors/BehaviorModal'
import { PageContainer } from '@/containers/PageContainer'
import { getResultsWithFuseSearch } from '@filecoin/core'
import { Behavior } from '@filecoin/types'
import {
  Button,
  CardLayout,
  CenterLayout,
  Dropdown,
  Icon,
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
  usePageLayout,
} from '@filecoin/ui'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Behaviors = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const { t } = useTranslation()
  const behaviors = model.getAllBehaviors()
  const [modalId, setModalId] = useState<Behavior | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState(undefined)
  const [selectedFilter, setSelectedFilter] = useState(undefined)
  const [searchResults, setSearchResults] = useState(null)

  const prepareBehaviorChart = () => {
    return Object.entries(
      behaviors.reduce(
        (d, behavior) => {
          if (behavior.tested === true) {
            d.tested += 1
          } else if (behavior.tested === false) {
            d.untested += 1
          } else {
            d.unknown += 1
          }
          return d
        },
        {
          untested: 0,
          tested: 0,
          unknown: 0,
        },
      ),
    ).map(([key, count]) => ({
      name: key,
      percentage: (count / behaviors.length) * 100,
    }))
  }

  const [behaviorChartData, setBehaviorChartData] = useState(
    prepareBehaviorChart(),
  )
  const navigate = useNavigate()
  const options = {
    threshold: 0.1,
    keys: ['description', 'id', 'parentFeatureName'],
  }
  const testedOptions = {
    keys: ['tested'],
  }
  const filterOptions = [
    {
      label: 'All statuses',
      value: undefined,
    },
    {
      label: 'Tested',
      value: 'true',
    },
    {
      label: 'Untested',
      value: 'false',
    },
  ]
  const results = getResultsWithFuseSearch(
    behaviors,
    options,
    testedOptions,
    searchTerm,
    selectedFilter,
    filterOptions,
  )

  useEffect(() => {
    setSearchResults(results)
  }, [selectedFilter, searchTerm])

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
          <Text type="heading 5" semiBold>
            {t('filecoin.behaviors.title')}
          </Text>
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
          <>
            {data.tested ? (
              <NativeLink
                className={'u-text--xsmall'}
                appearance={'system'}
                onClick={() => setModalId(data)}
              >
                {data.id}
              </NativeLink>
            ) : (
              <Text color="textGray">{data.id}</Text>
            )}
          </>
        )
      },
    },
    name: {
      header: t('filecoin.behaviors.tableHeaders.featureName'),
      Cell: ({ data: { parentFeatureName } }) => {
        return <Text color="textGray">{parentFeatureName}</Text>
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
      width: 100,
      Cell: ({ data: { tested } }) => {
        return (
          <CenterLayout>
            {tested ? (
              <Icon name={'check_mark'} color={'green'} />
            ) : (
              <Icon name={'minus'} color={'red'} />
            )}
          </CenterLayout>
        )
      },
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
        <Modal isOpen={!!modalId} onClose={() => setModalId(undefined)}>
          <BehaviorModal behavior={modalId} />
        </Modal>

        <StackLayout gap={1.25}>
          <StackLayout gap={1}>
            <Text type={'subtitle l'} color="textGray" semiBold>
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
                onClearFilter={() => setSelectedFilter(undefined)}
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
const ProgressBarWrapper = styled(CardLayout)`
  max-width: 58.75rem;
  margin-bottom: 1rem;
  padding: 2.65rem 3.625rem;
`
