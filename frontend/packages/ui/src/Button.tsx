import React, { ButtonHTMLAttributes, FunctionComponent } from 'react'
import styled from 'styled-components'

import { getActiveComponent } from './ButtonVariants'
import { Icon, IconNamesType } from './Icon'
import { Loader } from './Loader'
import { Fonts } from './styles/fonts'

/**
 * Possible values for `iconsPosition` prop of `Button` component.
 * Icon alignment relative to button label
 */
export const IconsPosition = ['left', 'right', 'both'] as const
export type IconsPosition = typeof IconsPosition[number]

/**
 * Possible values for `variant` prop of `Button` component.
 */
export const ButtonVariant = [
  'full',
  'outline',
  'text',
  'badge',
  'icon',
] as const
export type ButtonVariant = typeof ButtonVariant[number]

/**
 * Possible values for `appearance` prop of `Button` component.
 * Refers to the color of the component
 */
export const ButtonAppearance = [
  'brand',
  'system',
  'destructive',
  'success',
  'gray',
  'blank',
] as const
export type ButtonAppearance = typeof ButtonAppearance[number]

/**
 * Possible values for `size` prop of `Button` component.
 */
export const ButtonSize = ['large', 'medium', 'small'] as const
export type ButtonSize = typeof ButtonSize[number]

/**
 * The Button props.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Optional icon to render alongside the button label.
   */
  icon?: IconNamesType
  /**
   * Icon placement relative to the label.
   */
  iconsPosition?: IconsPosition
  /**
   * Button variant.
   */
  variant?: ButtonVariant
  /**
   * Button appearance. Refers to button colors
   */
  appearance?: ButtonAppearance
  /**
* Button size. 
Affects font-size, icon size, width, height, padding, letter-spacing and line-height.
*/
  size?: ButtonSize
  /**
   * Button loading.
   */
  loading?: boolean
}

export const Button: FunctionComponent<ButtonProps> = ({
  loading = false,
  icon,
  iconsPosition = 'left',
  variant = 'full',
  appearance = 'brand',
  size = 'medium',
  disabled,
  children,
  ...props
}) => {
  const ActiveComponent = getActiveComponent(variant, appearance)
  const calculateIconSize = (size, variant) => {
    if (variant === 'badge') {
      switch (size) {
        case 'large':
          return 'medium'
        case 'medium':
          return 'medium'
        case 'small':
          return 'small'
        default:
          return 'medium'
      }
    }
    if (variant === 'icon') {
      switch (size) {
        case 'large':
          return 'regular'
        case 'medium':
          return 'regular'
        case 'small':
          return 'small'
        default:
          return 'regular'
      }
    }
  }

  const getIcon = (position: 'left' | 'right', hidden: boolean): JSX.Element =>
    icon && (
      <IconWrapper
        iconsPosition={iconsPosition}
        className={`icon-${position}  ${hidden && 'icon-hidden'}`}
      >
        <Icon
          name={icon}
          size={calculateIconSize(size, variant) ?? 'regular'}
          color={variant === 'full' ? 'white' : 'gray'}
        />
      </IconWrapper>
    )

  const getLoader = (): React.ReactNode => {
    return variant === 'text' ? 'Loading...' : <ButtonLoader />
  }

  return (
    <ActiveComponent
      disabled={disabled}
      variant={variant}
      appearance={appearance}
      size={size}
      loading={loading}
      iconsPosition="left"
      {...props}
    >
      {loading ? (
        getLoader()
      ) : (
        <>
          {variant === 'icon' ? (
            <>
              <Icon
                name={icon}
                size={calculateIconSize(size, variant)}
                color={appearance === 'brand' ? 'white' : 'gray'}
              />{' '}
              {children}{' '}
            </>
          ) : (
            <>
              {getIcon('left', iconsPosition === 'right')}
              <ButtonLabel>{children}</ButtonLabel>
              {getIcon('right', iconsPosition === 'left')}
            </>
          )}
        </>
      )}
    </ActiveComponent>
  )
}

const ButtonLoader = styled(Loader)`
  width: 1.5rem;
  height: 1.5rem;
  margin: auto;

  ::after {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
  }
`
const ButtonLabel = styled.span`
  padding: 0 0.5rem;
  font-family: ${Fonts.Manrope};
  font-weight: bold;
`
const IconWrapper = styled.div<{ iconsPosition?: string }>`
  &.icon-left {
    margin-right: auto;
  }

  &.icon-right {
    margin-left: auto;
  }

  &.icon-hidden {
    visibility: hidden;
  }
`
