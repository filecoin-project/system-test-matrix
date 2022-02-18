import React, { FunctionComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { Colors } from './styles/colors'

interface Props {
  fullScreen?: boolean
  height?: number
}
export const Loader: FunctionComponent<Props> = ({
  fullScreen,
  height = 300,
  ...props
}) => {
  return fullScreen ? (
    <Wrapper height={height}>
      <Element data-element="loader" height={height} {...props} />
    </Wrapper>
  ) : (
    <Element data-element="loader" height={height} {...props} />
  )
}

const loaderKeyframe = keyframes`
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div<Pick<Props, 'height'>>`
  width: 100%;
  ${props => `height: ${props.height}px`};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Element = styled.div<Pick<Props, 'height'>>`
  width: ${({ height }) => `${height || 72}px`};
  height: ${({ height }) => `${height || 72}px`};
  border-radius: 50%;
  font-size: 10px;
  position: relative;
  border: 4px solid transparent;
  border-left-color: ${Colors.darkBlue};
  transform: translateZ(0);
  animation: ${loaderKeyframe} 1.1s infinite linear;

  ::after {
    width: ${({ height }) => `${height || 72}px`};
    height: ${({ height }) => `${height || 72}px`};
    border-radius: 50%;
  }
`
