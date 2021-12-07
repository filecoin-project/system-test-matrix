import { getButton } from '@/pages/tests'
import { filterItems } from '@filecoin/core'
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
import styled from 'styled-components'
interface Props {
  system: System
}

export const Overview: React.FC<Props> = ({ system }) => {
  const totalSubsystems = system.subsystems.length
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState(undefined)
  const [searchResults, setSearchResults] = useState(null)

  const calculateResults = () => {
    if (searchTerm) {
      const searchTermResult = filterItems(
        system.subsystems,
        searchTerm,
        'name',
      )
      if (selectedFilter) {
        return filterItems(searchTermResult, selectedFilter, 'score')
      } else {
        return searchTermResult
      }
    }
    if (selectedFilter) {
      return filterItems(system.subsystems, selectedFilter, 'score')
    } else {
      return system.subsystems
    }
  }

  const results = calculateResults()

  useEffect(() => {
    setSearchResults(results)
  }, [])

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

  const [filteredData, setFilteredData] = useState(system.subsystems)
  const getPaginationData = (pageNum: number, pageLimit: number) =>
    filteredData.slice(pageNum * pageLimit - pageLimit, pageNum * pageLimit)

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

  return (
    <Wrapper>
      <ProgressBarWrapper shadow={false}>
        <ProgressBar
          data={system.testKindStats.percentages.map(
            ({ kind, percentage }) => ({
              name: kind,
              percentage,
            }),
          )}
          legend
        />
      </ProgressBarWrapper>
      <ProgressBarWrapper shadow={false}>
        <ProgressBar
          data={system.testStatusStats.percentages.map(
            ({ status, percentage }) => ({
              name: status,
              percentage: percentage,
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
              onClearFilter={() => setSelectedFilter(undefined)}
            />
          </SearchAndFilterWrapper>
        </StackLayout>
        <Text type="subtitle l">Subsystems ({totalSubsystems})</Text>
        <TableStyled
          variant="default"
          columns={{
            Subsystems: {
              header: 'Subsystem',
              Cell: ({ data }) => <Text type="text s">{data.name}</Text>,
            },
            testKinds: {
              header: 'Test Kinds',
              width: 325,
              Cell: ({ data }) => (
                <Bar>
                  <ProgressBar
                    data={data.testKindStats.percentages.map(
                      ({ kind, percentage }) => ({ name: kind, percentage }),
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
                      ({ status, percentage }) => ({
                        name: status,
                        percentage,
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
          data={results}
        />
      </TableWrapper>
      <Pager
        currentPage={paginatedData.pageNum}
        totalRecords={totalSubsystems}
        pageLimit={paginatedData.pageLimit}
        onChange={onPageLimitChange}
      />
      <Paginator
        onPagination={onPagination}
        currentPage={paginatedData.pageNum}
        totalRecords={totalSubsystems}
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
