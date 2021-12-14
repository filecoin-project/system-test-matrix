import { darken, lighten } from 'polished'
import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { ButtonProps, ButtonVariant } from './Button'
import { Colors } from './styles/colors'
import { Fonts } from './styles/fonts'
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
  background-color: ${props => getBackgroundColor(props.color)};
  transition: background 0.3s;
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

  &:hover {
    background-color: ${props => darken(0.2, getBackgroundColor(props.color))};
  }

  &:focus {
    background-color: ${props => lighten(0.1, getBackgroundColor(props.color))};
  }
`

const ButtonRounded = styled(ButtonBase)`
  font-family: ${Fonts.NunitoSans};
  font-size: 14px;
  letter-spacing: 0.03rem;
  border-radius: 20px;
  color: ${Colors.white};
`
const ButtonOutline = styled(ButtonBase)`
  border: 1px solid ${Colors.borderColor};
  border-radius: 5px;
  color: ${Colors.ghostBtnText};

  &:hover {
    border: 1px solid ${Colors.secondaryBorder};
    background-color: ${Colors.secondaryHover};
  }
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
