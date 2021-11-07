import React from 'react'
import styled from 'styled-components'

import { Loader } from '../Loader'

export default {
  title: 'Loader',
  component: Loader,
}

export const Default = () => (
  <Wrapper>
    <Loader />
  </Wrapper>
)

const Wrapper = styled.div`
  height: 100%;
  padding: 4rem;
`
