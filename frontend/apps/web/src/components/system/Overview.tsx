import { getResultsWithFuseSearch } from '@filecoin/core'
import { System } from '@filecoin/types'
import {
  CardLayout,
  Dropdown,
  Pager,
  Paginator,
  ProgressBar,
  SearchInput,
  StackLayout,
  Table,
  Text,
} from '@filecoin/ui'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { getButton } from '@/pages/tests'

interface Props {
  system: System
}

export const Overview: React.FC<Props> = ({ system }) => {
  const totalSubsystems = system.subsystems.length
  const [searchTerm, setSearchTerm] = useState(undefined)
  const [selectedFilter, setSelectedFilter] = useState(undefined)
  const [searchResults, setSearchResults] = useState(null)
  const { t } = useTranslation()

  const options = {
    threshold: 0.1,
    keys: ['name'],
  }
  const scoreOptions = {
    keys: ['score'],
  }
  const filterOptions = [
    {
      label: 'All scores',
      value: undefined,
    },
    {
      label: 'Good',
      value: 'good',
    },
    {
      label: 'Bad',
      value: 'bad',
    },
    {
      label: 'Mediocre',
      value: 'mediocre',
    },
  ]
  const results = getResultsWithFuseSearch(
    system.subsystems,
    options,
    scoreOptions,
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

  return (
    <Wrapper>
      <ProgressBarWrapper shadow={false}>
        <Text type="text xl">{t('filecoin.allTests.allKinds')}</Text>
        <ProgressBar
          data={system.testKindStats.percentages.map(({ kind, ...rest }) => ({
            name: kind,
            ...rest,
          }))}
          legend
        />
      </ProgressBarWrapper>
      <ProgressBarWrapper shadow={false}>
        <Text type="text xl">{t('filecoin.allTests.allStatus')}</Text>
        <ProgressBar
          data={system.testStatusStats.percentages.map(
            ({ status, ...rest }) => ({
              name: status,
              ...rest,
            }),
          )}
          legend
        />
      </ProgressBarWrapper>

      <TableWrapper>
        <StackLayout gap={1}>
          <Text type="subtitle l">Subsystems ({totalSubsystems})</Text>
          <SearchAndFilterWrapper>
            <SearchInput
              onSearch={value => {
                setSearchTerm(value)
              }}
              value={searchTerm}
              placeholder="Search subsystem"
              width="58.75rem"
              autoFocus={false}
            />
            <Dropdown
              placeholder="All scores"
              name="score"
              options={filterOptions}
              value={selectedFilter}
              onChange={e => {
                setSelectedFilter(e.value)
              }}
            />
          </SearchAndFilterWrapper>
        </StackLayout>
        <TableStyled
          variant="default"
          columns={{
            Subsystems: {
              header: 'Subsystem',
              Cell: ({ data }) => (
                <Text type="text s" color="textGray">
                  {data.name}
                </Text>
              ),
            },
            testKinds: {
              header: 'Test Kinds',
              width: 325,
              Cell: ({ data }) => (
                <Bar>
                  <ProgressBar
                    data={data.testKindStats.percentages.map(
                      ({ kind, ...rest }) => ({ name: kind, ...rest }),
                    )}
                  />
                </Bar>
              ),
            },
            testStatus: {
              header: 'Test Status',
              width: 325,
              Cell: ({ data }) => (
                <Bar>
                  <ProgressBar
                    data={data.testStatusStats.percentages.map(
                      ({ status, ...rest }) => ({
                        name: status,
                        ...rest,
                      }),
                    )}
                  />
                </Bar>
              ),
            },
            score: {
              header: 'Score',
              width: 150,
              Cell: ({ data }) => getButton(data.score),
            },
          }}
          data={paginatedData.data}
        />
      </TableWrapper>
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
    </Wrapper>
  )
}

const Wrapper = styled(StackLayout)`
  margin-top: 1.25rem;
`

const ProgressBarWrapper = styled(CardLayout)`
  max-width: 58.75rem;
  margin-bottom: 1rem;
  padding: 2.65rem 3.625rem;
`

const TableWrapper = styled(StackLayout)`
  margin-top: 2rem;
`

const TableStyled = styled(Table)`
  margin-top: 1rem;
`

const Bar = styled.div`
  padding-right: 2rem;
`
const SearchAndFilterWrapper = styled.div`
  display: flex;

  [data-element='dropdown'] {
    max-width: 181px;
    margin-left: auto;
  }
`
