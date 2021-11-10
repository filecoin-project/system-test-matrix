import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { ButtonAppearanceType } from '.'
import { ButtonProps } from './Button'
import { Colors } from './styles/colors'
import { FullWidth } from './styles/mixins'

export const Sizing = {
  height: {
    ghost: 39,
    ghostSmall: 39,
    system: 32,
  },
  width: {
    ghost: 131,
    ghostSmall: 92,
    system: 124,
  },
}

export const getBackgroundColor = color => {
  switch (color) {
    case 'green':
      return `${Colors.greenBtn}`
    case 'orange':
      return `${Colors.orangeBtn}`
    case 'red':
      return `${Colors.redBtn}`
    case 'gray':
      return `${Colors.grayBtn}`
    default:
      return `${Colors.greenBtn}`
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
  height: ${props => Sizing.height[props.appearance]}px;
  width: ${props => Sizing.width[props.appearance]}px;
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

const ButtonSystem = styled(ButtonBase)`
  border-radius: 20px;
  background-color: ${props => getBackgroundColor(props.color)};
  color: ${Colors.white};
`
const ButtonGhost = styled(ButtonBase)`
  background-color: ${Colors.ghostBtn};
  border: 1px solid ${Colors.borderColor};
  border-radius: 5px;
  color: ${Colors.ghostBtnText};
`

export const getActiveComponent = (appearance: ButtonAppearanceType) => {
  switch (appearance) {
    case 'system':
      return ButtonSystem
    case 'ghost':
      return ButtonGhost
    case 'ghostSmall':
      return ButtonGhost
    default:
      return ButtonSystem
  }
}
