import { CardLayout } from '@filecoin/ui'
import React from 'react'
import styled from 'styled-components'


const ProgressBarWrapper = ({shadow=false,children,...props}) => {
    return (
        <Wrapper shadow={shadow}>
          {children}
        </Wrapper>
    )

}

const Wrapper = styled(CardLayout)`
  max-width: 58.75rem;
  margin-bottom: 1rem;
  padding: 2.65rem 3.625rem;

  &:first-of-type {
    margin-top: 1rem;
  }
`

export default ProgressBarWrapper;