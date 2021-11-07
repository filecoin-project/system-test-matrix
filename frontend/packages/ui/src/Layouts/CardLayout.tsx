import { ReactProps } from '@filecoin/types'
import classNames from 'classnames'
import React from 'react'
import styled from 'styled-components'

import { Colors } from '../styles/colors'

/**
 * The CardLayout props.
 */
export interface CardLayoutProps {
  /**
   * The element to render the Card Layout as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
  /**
   * Box shadow
   */
  readonly shadow?: boolean
  /**
   * Border
   */
  readonly border?: boolean
  /**
   * Background color
   */
  readonly background?: string
}

const defaultElement = 'div'

/**
 * The Card Layout is used to define a "Card", i.e. a container for something.
 */
export const CardLayout = React.forwardRef(
  (
    {
      as: Component = defaultElement,
      shadow = true,
      border = true,
      background = Colors.white,
      ...props
    }: CardLayoutProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-card-layout',
      'c-card-layout--shadow' && shadow,
      'c-card-layout--border' && border,
      (props as { className: string }).className,
    )

    return (
      <Card
        as={Component}
        ref={ref}
        shadow={shadow}
        className={className}
        background={background}
        border={border}
        {...props}
      />
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & CardLayoutProps,
) => JSX.Element

export const Card = styled(defaultElement)<CardLayoutProps>`
  display: block;
  border-radius: 0.75rem;
  width: 100%;
  background-color: ${props => props.background};
  ${props => props.shadow && `box-shadow: ${Colors.shadowLevel1};`}
  ${props => props.border && ` border: 1px solid ${Colors.grayLightBorder};`}
`
