import React, { ClassicComponentClass, FunctionComponent } from 'react'
import styled from 'styled-components'

export interface Step {
  tabName?: string
  name: string
  Component: ClassicComponentClass | FunctionComponent
}

interface StepperProps {
  steps: Array<Step>
  activeStep?: number
  className?: string
}
const Stepper: FunctionComponent<StepperProps> = ({
  steps,
  activeStep = 0,
  className = '',
}) => {
  const { Component } = steps[activeStep]
  return (
    <Wrapper className={className}>
      <ContentWrapper>
        <Component />
      </ContentWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
`

const ContentWrapper = styled.div``

export default Stepper
