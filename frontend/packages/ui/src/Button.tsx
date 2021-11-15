import React, { ButtonHTMLAttributes, FunctionComponent } from 'react'

import { getActiveComponent } from './ButtonVariants'

export const ButtonColor = [
  'success',
  'error',
  'warning',
  'primary',
  'secondary',
] as const
export const ButtonSize = ['small', 'medium'] as const
export const ButtonVariant = ['rounded', 'outline'] as const
export type ButtonColor = typeof ButtonColor[number]
export type ButtonSize = typeof ButtonSize[number]
export type ButtonVariant = typeof ButtonVariant[number]

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant.
   */
  variant: ButtonVariant
  /**
   * Button size.
   */
  size: ButtonSize
  /**
   * Button color.
   */
  color?: ButtonColor
}

export const Button: FunctionComponent<ButtonProps> = ({
  color,
  variant,
  size,
  ...props
}) => {
  const ActiveComponent = getActiveComponent(variant)

  return (
    <>
      <ActiveComponent variant={variant} size={size} color={color} {...props}>
        {props.children}
      </ActiveComponent>
    </>
  )
}
