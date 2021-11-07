import React from 'react'
import styled from 'styled-components'
import { ReactProps } from '@filecoin/types'
import { useMedia, metrics, Breakpoint } from '@filecoin/core'

import { StackLayout, StackLayoutGap } from './StackLayout'

/**
 * Possible values for `gap` prop of `ColumnLayout` component.
 */
export const ColumnLayoutGap = StackLayoutGap
export type ColumnLayoutGap = typeof ColumnLayoutGap[number]

/**
 * Possible values for `responsive` prop of `ColumnLayout` component.
 */

export const ScreenWidth = [...Breakpoint, 'none'] as const
export type ScreenWidth = typeof ScreenWidth[number]

/**
 * The ColumnLayout props.
 */
export interface ColumnLayoutProps {
  /**
   * The element to render the Stack Layout as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
  /**
   * The size of a gap between children. Defaults to `1`.
   */
  readonly gap?: ColumnLayoutGap
  /**
   * The screen size threshold below which ColumnLayout switches to StackLayout.
   * Defaults to 'none'.
   */
  readonly responsive?: ScreenWidth | number
  /**
   * Whether all descendant elements will have their margins set. Instead of only
   * the direct children. Defaults to `false`.
   */
  readonly recursive?: boolean
  /**
   * The split group(s).
   */
  readonly split?: string
  /**
   * Whether to center children over the cross axis, instead of stretching them.
   */
  readonly center?: boolean
  /**
   * Whether to align children to the top of cross axis, instead of stretching them.
   */
  readonly top?: boolean
}

const defaultElement = 'div'

/**
 * Breakpoint values
 */
const breakpoints = new Map<ScreenWidth, number>([
  ['none', 0],
  ['desktop', metrics['desktop']],
  ['tablet', metrics['tablet']],
  ['mobile-large', metrics['mobile-large']],
  ['mobile', metrics['mobile']],
])

/**
 * The ColumnLayout primitive injects vertical margin between its child elements.
 * Children are always vertically ordered, top to bottom.
 *
 * A split point can be set which will push down all children after that point.
 *
 * By default, ColumnLayout affects only its direct children's margins, but with
 * the `recursive` prop set this can be changed so that all descendants are affected.
 */
export const ColumnLayout = React.forwardRef(
  (
    {
      as: Component = defaultElement,
      responsive = 'none',
      ...props
    }: ColumnLayoutProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const isStack = useMedia(
      `(max-width: ${
        typeof responsive === 'number'
          ? responsive
          : breakpoints.get(responsive) ?? 0
      }px)`,
    )

    if (isStack) {
      return <StackLayout as={Component} {...props} />
    }
    return <Column as={Component} ref={ref} {...props} />
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & ColumnLayoutProps,
) => JSX.Element

const Column = styled(defaultElement)<ColumnLayoutProps>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  ${props => props.center && `align-items: center;`}
  ${props => props.top && `align-items: flex-start !important;`}
  ${props => `${props.recursive ? '*' : '> *'}{
    margin-left: 0;
    margin-right: 0;
    flex-grow: 1;
  }`}
  ${props => `${props.recursive ? '* + *' : '> * + *'}{
    margin-left: ${props.gap || 1}rem;
  }`}
  
  &:only-child {
    height: 100%;
    align-items: center;
  }

  ${props => {
    const returnSingleSplit = split => {
      if (split < 0) {
        return `
            > *:nth-last-child(${-split}) {
              margin-left: auto;
            }
            
            > *:nth-last-child(${-split + 1}) {
              margin-right: ${props.gap != null ?? 1}rem;
            }
            `
      } else {
        return `
          > *:nth-child(${split}) {
            margin-right: auto;
            
            + * {
                margin-left: 0;
            }
          }`
      }
    }

    if (props.split) {
      if (Array.isArray(props.split)) {
        return props.split.map(returnSingleSplit).join('')
      } else {
        return returnSingleSplit(props.split)
      }
    }
    return ''
  }}
`
