import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { ButtonProps, ButtonVariant } from './Button'
import { Colors } from './styles/colors'
import { FullWidth } from './styles/mixins'

export const Sizing = {
  height: {
    medium: 38,
    small: 32,
  },
  width: {
    medium: 131,
    small: 124,
  },
}

export const getBackgroundColor = color => {
  switch (color) {
    case 'success':
      return `${Colors.greenBtn}`
    case 'warning':
      return `${Colors.orangeBtn}`
    case 'error':
      return `${Colors.redBtn}`
    case 'primary':
      return `${Colors.ghostBtn}`
    case 'secondary':
      return `${Colors.grayBtn}`
    default:
      return `${Colors.ghostBtn}`
  }
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return (
      <button ref={ref} data-element="button" {...props}>
        {props.children}
      </button>
    )
  },
)

export const ButtonBase = styled(ButtonComponent)`
  position: relative;
  height: ${props => Sizing.height[props.size]}px;
  width: ${props => Sizing.width[props.size]}px;
  ${props => FullWidth({ className: props.className })};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 0;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  &[disabled] {
    pointer-events: none;
    border: 0;
  }

  > span {
    line-height: 1rem;
    letter-spacing: 0.2px;
  }

  &:focus {
    outline: 0;
  }
`

const ButtonRounded = styled(ButtonBase)`
  border-radius: 20px;
  background-color: ${props => getBackgroundColor(props.color)};
  color: ${Colors.white};
`
const ButtonOutline = styled(ButtonBase)`
  background-color: ${props => getBackgroundColor(props.color)};
  border: 1px solid ${Colors.borderColor};
  border-radius: 5px;
  color: ${Colors.ghostBtnText};
`

export const getActiveComponent = (variant: ButtonVariant) => {
  switch (variant) {
    case 'rounded':
      return ButtonRounded
    case 'outline':
      return ButtonOutline
    default:
      return ButtonRounded
  }
}
