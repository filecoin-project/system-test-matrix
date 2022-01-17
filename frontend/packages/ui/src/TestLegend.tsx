import React from 'react'
import styled from 'styled-components'
import { Colors } from './styles/colors'

export const TestLegend = () => {
  return (
    <Legend>
      <div>
        Untested behavior <div />
      </div>
      <div>
        Tested behavior <div />
      </div>
    </Legend>
  )
}

export const Legend = styled.div`
  display: flex;
  justify-content: end;
  color: ${Colors.textGray};
  margin-top: 1rem;

  > div {
    margin-left: 2rem;
    display: flex;
    align-items: center;

    > div {
      display: inline-block;
      width: 13px;
      height: 13px;
      border-radius: 3px;
      margin-left: 0.5rem;
    }

    &:first-child {
      > div {
        background: ${Colors.grayBtn};
      }
    }

    &:nth-child(2) {
      > div {
        background: ${Colors.greenBtn};
      }
    }
  }
`
