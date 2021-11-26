import React from 'react'
import { Model } from '@/model'
import {
  CardLayout,
  ProgressBar,
  StackLayout,
  Text,
  Table,
  Button,
} from '@filecoin/ui'
import styled from 'styled-components'

const DATASCORE = {
  good: 'success',
  bad: 'error',
  mediocre: 'warning',
}

interface Props {
  model: Model
  systemName: string
}

export const Overview: React.FC<Props> = ({ model, systemName }) => {
  const system = model.findSystemByName(systemName)
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
        ></ProgressBar>
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
        ></ProgressBar>
      </ProgressBarWrapper>
      <TableWrapper>
        <Text type={'subtitle l'}>Subsystems ({totalSubsystems})</Text>
        <TableStyled
          variant="default"
          columns={{
            Subsystems: {
              header: 'Subsystem',
              width: 150,
              Cell: ({ data }) => <Text type="text s">{data.name}</Text>,
            },
            testKinds: {
              header: 'Test Kinds',
              Cell: ({ data }) => (
                <ProgressBar
                  data={data.testKindStats.percentages.map(
                    ({ kind, percentage }) => ({ name: kind, percentage }),
                  )}
                />
              ),
            },
            testStatus: {
              header: 'Test Status',
              Cell: ({ data }) => (
                <ProgressBar
                  data={data.testStatusStats.percentages.map(
                    ({ status, percentage }) => ({ name: status, percentage }),
                  )}
                />
              ),
            },
            score: {
              header: 'Score',
              width: 150,
              Cell: ({ data }) => (
                <StyledButton
                  variant="rounded"
                  size="small"
                  color={DATASCORE[data.score]}
                >
                  {data.score}
                </StyledButton>
              ),
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

const StyledButton = styled(Button)`
  text-transform: capitalize;
`
