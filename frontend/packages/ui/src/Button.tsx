import React, { ButtonHTMLAttributes, FunctionComponent } from 'react'
import { getActiveComponent } from './ButtonVariants'

export const ButtonAppearance = ['system', 'ghost', 'ghostSmall'] as const
export type ButtonAppearanceType = typeof ButtonAppearance[number]

export const ButtonColor = ['green', 'orange', 'red', 'gray'] as const
export type ButtonColorType = typeof ButtonColor[number]

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant.
   */
  color?: ButtonColorType
  /**
   * Button appearance. Refers to button colors
   */
  appearance?: ButtonAppearanceType
}

export const Button: FunctionComponent<ButtonProps> = ({
  color,
  appearance,
  ...props
}) => {
  const ActiveComponent = getActiveComponent(appearance)

  return (
    <>
      <ActiveComponent appearance={appearance} color={color} {...props}>
        {props.children}
      </ActiveComponent>
    </>
  )
}
