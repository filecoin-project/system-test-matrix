import { getButton } from '@/pages/tests'
import { filterItems } from '@filecoin/core'
import { System } from '@filecoin/types'
import {
  CardLayout,
  ProgressBar,
  SearchInput,
  StackLayout,
  Table,
  Text,
} from '@filecoin/ui'
import React, { useState } from 'react'
import styled from 'styled-components'
interface Props {
  system: System
}

export const Overview: React.FC<Props> = ({ system }) => {
  const totalSubsystems = system.subsystems.length
  const [searchTerm, setSearchTerm] = useState('')
  const results = !searchTerm
    ? system.subsystems
    : filterItems(system.subsystems, searchTerm, 'name')

  return (
    <Wrapper>
      <ProgressBarWrapper>
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
      <ProgressBarWrapper>
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

          <SearchInput
            onSearch={value => {
              setSearchTerm(value)
            }}
            value={searchTerm}
            placeholder="Search subsystem"
            width="58.75rem"
            autoFocus={false}
          />
        </StackLayout>
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
