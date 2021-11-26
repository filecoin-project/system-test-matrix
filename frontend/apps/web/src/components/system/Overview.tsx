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
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const DATASCORE = {
  good: 'success',
  bad: 'error',
  mediocre: 'warning',
}

interface Props {
  model: Model
  modelName: string
}

export const Overview: React.FC<Props> = ({ model, modelName }) => {
  const navigate = useNavigate()
  const system = model.findSystemByName(modelName)
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
          onClick={() => null}
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
          onClick={() => null}
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
              width: 225,
              Cell: ({ data }) => (
                <ProgressBar
                  onClick={() => navigate('/repository-details')}
                  data={data.testKindStats.percentages.map(
                    ({ kind, percentage }) => ({ name: kind, percentage }),
                  )}
                />
              ),
            },
            testStatus: {
              header: 'Test Status',
              width: 225,
              Cell: ({ data }) => (
                <ProgressBar
                  onClick={() => navigate('/repository-details')}
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
                  onClick={() => navigate('/repository-details')}
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
