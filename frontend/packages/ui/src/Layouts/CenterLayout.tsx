import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { ReactProps } from '@filecoin/types'

/**
 * The Center Layout primitive is used to center itself and its content horizontally.
 *
 *                          Center Layout
 *                /-------------------------------\
 *                |///   +-----------------+   ///|
 *                |///   |                 |   ///|
 *          |==>  |///   |                 |   ///|  <==|
 *                |///   |                 |   ///|
 *                |///   +-----------------+   ///|
 *                \-------------------------------/
 *                  ↑             ↑             ↑
 *                 Gap         Content          Gap
 *
 */

/**
 * Possible values for `gap` prop of `CenterLayout` component.
 */
export const CenterLayoutGap = [0.5, 0.75, 1, 1.25, 1.5, 2] as const
export type CenterLayoutGap = typeof CenterLayoutGap[number]

/**
 * The CenterLayout props.
 */
export interface CenterLayoutProps {
  /**
   * The element to render the Box Layout as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
  /**
   * The size of a horizontal gap (padding). Defaults to `1`.
   */
  readonly gap?: CenterLayoutGap
  /**
   * Whether the contents are fully stretched in horizontal axis or not (defaults to `false`).
   */
  readonly stretch?: boolean
  /**
   * Center text
   */
  readonly centerText?: boolean
}

const defaultElement = 'div'

/**
 * The CenterLayout primitive is used to center its content horizontally.
 */
export const Center = React.forwardRef(
  (
    {
      as: Component = defaultElement,
      centerText = false,
      stretch = false,
      ...props
    }: CenterLayoutProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'o-center-layout',
      'o-center-layout--stretch' && stretch,
      'o-center-layout--center-text' && centerText,
      (props as { className?: string }).className,
    )

    return <Component ref={ref} {...props} className={className} />
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & CenterLayoutProps,
) => JSX.Element

export const CenterLayout = styled(Center)`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: content-box;
  margin-left: auto;
  margin-right: auto;
  ${props => `
    padding-left: ${props.gap || 1}rem;
    padding-right: ${props.gap || 1}rem;
  `}
  ${props => props.stretch && 'align-items: stretch;'}
  ${props => props.centerText && 'text-align: center;'}
`
