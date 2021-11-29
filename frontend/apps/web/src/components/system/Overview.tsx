import { getButton } from '@/pages/tests'
import { System } from '@filecoin/types'
import { CardLayout, ProgressBar, StackLayout, Table, Text } from '@filecoin/ui'
import React from 'react'
import styled from 'styled-components'

interface Props {
  system: System
}

export const Overview: React.FC<Props> = ({ system }) => {
  const totalSubsystems = system.subsystems.length

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
        <Text type={'subtitle l'} color="textGray">
          Subsystems ({totalSubsystems})
        </Text>
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
          data={system.subsystems}
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
