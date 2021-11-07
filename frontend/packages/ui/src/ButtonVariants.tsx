import React, { forwardRef } from 'react'
import styled from 'styled-components'

import { ButtonProps } from './Button'
import { Colors } from './styles/colors'
import { Fonts } from './styles/fonts'
import { FullWidth, Hidden } from './styles/mixins'

export const Sizing = {
  fontSize: {
    large: 1,
    medium: 1,
    small: 0.75,
  },
  height: {
    large: 56,
    medium: 48,
    small: 36,
  },
  width: {
    large: 160,
    medium: 160,
    small: 120,
    badge: {
      large: 90,
      medium: 90,
      small: 80,
    },
  },
  padding: {
    large: '0 1',
    medium: '0 1',
    small: '0 0.5',
  },
  iconButton: {
    large: 56,
    medium: 36,
    small: 24,
  },
  lineHeight: {
    badge: {
      large: 22.4,
      medium: 22.4,
      small: 20.8,
    },
  },
  letterSpacing: {
    badge: {
      large: 0.1,
      medium: 0.1,
      small: 0.2,
    },
  },
}

export const ButtonColors = {
  brand: {
    default: Colors.purple70,
    hover: Colors.purple80,
    focus: Colors.purple90,
    active: Colors.purple70,
    disabled: Colors.gray40,
    border: Colors.grayLightBorder,
    color: Colors.purple70,
    outlinedText: Colors.gray90,
    hoverBorder: 'none',
    activeBorder: Colors.purple30,
    focusBorder: Colors.grayLight,
    outline: {
      hover: Colors.grayLightHover,
      focus: Colors.grayLightFocus,
      focusText: Colors.gray80,
      active: Colors.grayLight,
      activeText: Colors.purple80,
      activeBorder: Colors.purple40,
    },
    text: {
      hover: Colors.grayLightHover,
      hoverText: Colors.purple80,
      focus: Colors.grayLightFocus,
      focusText: Colors.purple90,
      active: Colors.grayLight,
      activeText: Colors.purple70,
    },
  },
  system: {
    default: Colors.green70,
    hover: Colors.green80,
    focus: Colors.green90,
    active: Colors.green70,
    disabled: Colors.gray40,
    border: Colors.grayLightBorder,
    color: Colors.gray90,
    outlinedText: Colors.gray90,
    hoverBorder: 'none',
    focusBorder: Colors.grayLightFocus,
    activeBorder: Colors.green30,
    outline: {
      hover: Colors.grayLightHover,
      focus: Colors.grayLightFocus,
      focusText: Colors.gray80,
      active: Colors.grayLight,
      activeText: Colors.gray90,
      activeBorder: Colors.grayLightBorder,
    },
    text: {
      hover: Colors.grayLightHover,
      hoverText: Colors.gray90,
      focus: Colors.grayLightFocus,
      focusText: Colors.gray80,
      active: Colors.grayLight,
      activeText: Colors.gray90,
    },
  },
  destructive: {
    default: Colors.red70,
    hover: Colors.red80,
    focus: Colors.red90,
    active: Colors.red70,
    disabled: Colors.gray40,
    border: Colors.red70,
    color: Colors.red70,
    outlinedText: Colors.red70,
    hoverBorder: 'none',
    activeBorder: Colors.red30,
    focusBorder: Colors.grayLight,
    outline: {
      hover: Colors.grayLightHover,
      hoverText: Colors.red80,
      focus: Colors.grayLightFocus,
      focusText: Colors.red90,
      active: Colors.red10,
      activeText: Colors.red70,
      activeBorder: Colors.red70,
    },
    text: {
      hover: Colors.grayLightHover,
      hoverText: Colors.red80,
      focus: Colors.grayLightFocus,
      focusText: Colors.red90,
      active: Colors.red10,
      activeText: Colors.red70,
    },
  },
  success: {
    default: Colors.green70,
    hover: Colors.green80,
    focus: Colors.green90,
    active: Colors.green70,
    disabled: Colors.gray40,
    border: Colors.green70,
    color: Colors.green70,
    outlinedText: Colors.green70,
    outline: {
      hover: Colors.grayLightHover,
      hoverText: Colors.green80,
      focus: Colors.grayLightFocus,
      focusText: Colors.green90,
      active: Colors.green10,
      activeText: Colors.green70,
      activeBorder: Colors.green70,
    },
    text: {
      hover: Colors.grayLightHover,
      hoverText: Colors.green80,
      focus: Colors.grayLightFocus,
      focusText: Colors.green90,
      active: Colors.green10,
      activeText: Colors.green70,
    },
  },
  gray: {
    default: Colors.gray30,
    hover: Colors.grayLightHover,
    focus: Colors.grayLightFocus,
    focusBorder: 'none',
    disabled: Colors.grayDisabled,
    border: Colors.grayLightBorder,
    color: Colors.gray90,
  },
  blank: {
    color: Colors.gray90,
    default: Colors.gray90,
    text: {
      hover: Colors.grayLightHover,
      hoverText: Colors.gray90,
      focus: Colors.grayLightFocus,
      focusText: Colors.gray80,
      active: Colors.grayLight,
      activeText: Colors.gray90,
    },
  },
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ iconsPosition, loading, ...props }, ref) => {
    return (
      <button ref={ref} data-element="button" {...props}>
        {props.children}
      </button>
    )
  },
)

/**
 * Get color value based on button appearance, variant and state (hover, focus, active...)
 **/
export const getColor = (props: ButtonProps, state: string): string => {
  /**
   * Get value from ButtonColors object and handle nested states (e.g. outline.hover )
   * e.g. ButtonColors[props.appearance].outline.hover
   */
  type PropObject = { [name: string]: string | PropObject }
  function getValue(obj: PropObject | string, state: string) {
    if (!state) {
      return obj
    }
    if (!obj) {
      return 'none'
    }
    const properties = state.split('.')
    return getValue(obj[properties.shift()], properties.join('.'))
  }
  return getValue(ButtonColors[props.appearance], state)
}

export const ButtonBase = styled(ButtonComponent)`
  position: relative;
  padding: ${props => {
    return props.variant === 'icon' ? 0 : Sizing.padding[props.size]
  }}rem;
  height: ${props => Sizing.height[props.size]}px;
  width: ${props => Sizing.width[props.size]}px;
  ${props => FullWidth({ className: props.className })};
  ${props => Hidden({ className: props.className })}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 0;
  border-radius: 0.5rem;
  font-family: ${Fonts.Manrope};
  font-weight: bold;
  font-size: ${props => Sizing.fontSize[props.size]}rem;
  cursor: pointer;
  pointer-events: ${props => props.loading && 'none'};

  > span {
    line-height: 1rem;
    letter-spacing: 0.2px;
  }

  &[disabled] {
    pointer-events: none;
    border: 0;
  }

  &:focus {
    outline: 0;
  }

  &.button-icon {
    width: ${props => Sizing.iconButton[props.size]}px;
    height: ${props => Sizing.iconButton[props.size]}px;
    border-radius: 50%;
    min-width: auto;

    i {
      margin: 0;
      left: auto;
    }

    &[disabled] {
      background: ${props => {
        return props.appearance === 'brand' ? Colors.purple70 : Colors.white
      }};
      opacity: 0.5;
      border: none;
    }
  }

  &.button-icon-unset-border {
    &:active,
    &:focus {
      border: unset;
    }
  }
`

const ButtonContained = styled(ButtonBase)`
  background-color: ${props => getColor(props, 'default')};
  color: ${Colors.white};
  box-shadow: 0 0 0 2px transparent;

  &:hover {
    background-color: ${props => getColor(props, 'hover')};
  }

  &:focus {
    background-color: ${props => getColor(props, 'focus')};
    box-shadow: 0 0 0.5rem ${props => getColor(props, 'focusBorder')};
  }

  &:active {
    background-color: ${props => getColor(props, 'active')};
    box-shadow: 0 0 0 2px ${props => getColor(props, 'activeBorder')};
  }

  &[disabled] {
    background-color: ${Colors.gray40};
    color: ${Colors.gray60};
  }

  & [data-element='loader'] {
    border: 4px solid ${props => getColor(props, 'active')};
    border-left-color: ${Colors.white};
  }
`

const ButtonOutlined = styled(ButtonBase)`
  background-color: ${Colors.white};
  border: 2px solid ${props => getColor(props, 'border')};
  color: ${props => getColor(props, 'outlinedText')};

  &:hover {
    background-color: ${props => getColor(props, 'outline.hover')};
    color: ${props => getColor(props, 'outline.hoverText')};
  }

  &:focus {
    background-color: ${props => getColor(props, 'outline.focus')};
    color: ${props => getColor(props, 'outline.focusText')};
  }

  &:active {
    background-color: ${props => getColor(props, 'outline.active')};
    border: 1px solid ${props => getColor(props, 'outline.activeBorder')};
    color: ${props => getColor(props, 'outline.activeText')};
  }

  &[disabled] {
    background-color: ${Colors.white};
    border: 2px solid ${props => getColor(props, 'border')};
    opacity: 0.5;
  }

  & [data-element='loader'] {
    border: 4px solid ${Colors.gray60};
    border-left-color: ${Colors.gray80};
  }
`

const ButtonText = styled(ButtonBase)`
  color: ${props => getColor(props, 'color')};
  background-color: transparent;

  &:hover {
    background-color: ${props => getColor(props, 'text.hover')};
    color: ${props => getColor(props, 'text.hoverText')};
  }

  &:focus {
    background-color: ${props => getColor(props, 'text.focus')};
    color: ${props => getColor(props, 'text.focusText')};
  }

  &:active,
  &.active {
    background-color: ${props => getColor(props, 'text.active')};
    color: ${props => getColor(props, 'text.activeText')};
  }

  &[disabled] {
    opacity: 0.5;
  }
`
const ButtonBadge = styled(ButtonBase)`
  font-size: ${Sizing.fontSize['small']}rem;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  background-color: ${Colors.purple10};
  color: ${Colors.purple70};
  width: auto;
  height: auto;
  min-width: auto;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;

  & > span {
    line-height: ${props => Sizing.lineHeight.badge[props.size]}px;
    letter-spacing: ${props => Sizing.letterSpacing.badge[props.size]}px;
  }
`

const ButtonIconPrimary = styled(ButtonContained).attrs({
  className: 'button-icon',
})``

const ButtonIconSecondary = styled(ButtonOutlined).attrs({
  className: 'button-icon button-icon-unset-border',
})``

const ButtonIconGray = styled(ButtonContained).attrs({
  className: 'button-icon button-icon-unset-border',
})`
  background-color: ${props => getColor(props, 'default')};
  border: none;
`

const ButtonIconText = styled(ButtonText).attrs({
  className: 'button-icon button-icon-unset-border',
})`
  background-color: transparent;
  border: none;
`

export const getActiveComponent = (
  variant: string,
  appearance: string,
): React.FC<ButtonProps> => {
  switch (variant) {
    case 'full':
      return ButtonContained
    case 'outline':
      return ButtonOutlined
    case 'text':
      return ButtonText
    case 'badge':
      return ButtonBadge
    case 'icon':
      return appearance === 'brand'
        ? ButtonIconPrimary
        : appearance === 'system'
        ? ButtonIconSecondary
        : appearance === 'gray'
        ? ButtonIconGray
        : appearance === 'blank'
        ? ButtonIconText
        : ButtonContained

    default:
      return ButtonContained
  }
}
