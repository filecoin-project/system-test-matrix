import { Colors } from '@filecoin/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Header = () => {
  return (
    <Wrapper>
      <Link to="/">FILECOIN</Link>
    </Wrapper>
  )
}

const Wrapper = styled.header`
  padding: 0.75rem 1.5rem;
  width: 100%;
  max-height: 70px;
  display: flex;
  justify-content: space-between;
  background: ${Colors.white};
  border-bottom: 1px solid ${Colors.borderColor};
`
