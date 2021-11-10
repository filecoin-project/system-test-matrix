import React from 'react'
import { ReactProps } from '@filecoin/types'
import styled from 'styled-components'

import { ColumnReverse, Hidden } from '../styles/mixins'

/**
 *
 *
 *              Stack Layout
 *    /-----------------------------\
 *    | +-------------------------+ |
 *    | |                         | | <================+
 *    | |                         | |                  |
 *    | +-------------------------+ |                  |
 *    | //////////////////////////  | <==== Gap        |
 *    | +-------------------------+ |                  |
 *    | |                         | |                  |
 *    | |                         | | <================+
 *    | |                         | |                  |
 *    | +-------------------------+ |                  |===== Stack Children
 *    |            -----            |                  |
 *    |              ¦              |                  |
 *    |            Split            |                  |
 *    |              ¦              |                  |
 *    |            -----            |                  |
 *    | +-------------------------+ |                  |   <====+
 *    | |                         | | <================+        |  Split group
 *    | |                         | |                      <====+
 *    | +-------------------------+ |
 *    \-----------------------------/
 *
 * Usage:
 *
 * <StackLayout>
 *     <div>First child</div>
 *     <div>Second child</div>
 * </div>
 *
 *
 * Notes:
 *
 *  More than one split group can be defined, for example:
 *
 *  <StackLayout split=[1,3]>
 *      <div>First</div>
 *      <div>Second</div>
 *      <div>Third</div>
 *      <div>Fourth</div>
 *      <div>Fifth</div>
 *  </div>
 *
 *  Will render as:
 *
 *  +-----------+
 *  |   First   |
 *  |   Second  |
 *  |           |
 *  |           |
 *  |   Third   |
 *  |   Fourth  |
 *  |           |
 *  |           |
 *  |   Fifth   |
 *  +-----------+
 */

/**
 * Possible values for `gap` prop of `StackLayout` component.
 */
export const StackLayoutGap = [
  0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 3.5, 4,
] as const
export type StackLayoutGap = typeof StackLayoutGap[number]

/**
 * The StackLayout props.
 */
export interface StackLayoutProps {
  /**
   * The element to render the Stack Layout as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
  /**
   * The size of a gap between children in rem. Defaults to `1`.
   */
  readonly gap?: StackLayoutGap
  /**
   * Whether all descendant elements will have their margins set. Instead of only
   * the direct children. Defaults to `false`.
   */
  readonly recursive?: boolean
  /**
   * The split group(s).
   */
  readonly split?: number | number[]
  /**
   * Whether to center children horizontally, instead of stretching them.
   */
  readonly center?: boolean
  /**
   * Class to append to StackLayout
   */
  readonly className?: string
}

const defaultElement = 'div'

/**
 * The StackLayout primitive injects vertical margin between its child elements.
 * Children are always vertically ordered, top to bottom.
 *
 * A split point can be set which will push down all children after that point.
 *
 * By default, StackLayout affects only its direct children's margins, but with
 * the `recursive` prop set this can be changed so that all descendants are affected.
 */
export const Stack = React.forwardRef(
  (
    { as: Component = defaultElement, ...props }: StackLayoutProps,
    ref: React.Ref<Element>,
  ) => {
    return <Component ref={ref} {...props} />
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & StackLayoutProps,
) => JSX.Element

export const StackLayout = styled(Stack)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${props => props.center && `align-items: center;`}
  ${props =>
    ((props.recursive && `*`) || '> *') +
    `
    {
        margin-top: 0;
        margin-bottom: 0;
    }
    `}
  
  ${props =>
    ((props.recursive && '* + *') || '> * + *') +
    `
    {
      margin-top: ${props.gap}rem;
    }
    `}
  
  ${props => {
    StackLayoutGap.forEach(gap => {
      if (props.gap === gap) {
        return (
          ((props.recursive && '* + *') || '> * + *') +
          `
          {
            margin-top: ${props.gap}rem;
          }
          `
        )
      }
    })
    return ''
  }}
  
  
  &:only-child {
    height: 100%;
  }

  ${props => {
    const returnSingleSplit = split => {
      if (split < 0) {
        return `
            > *:nth-last-child(${-split}) {
              margin-top: auto;
            }
            
            > *:nth-last-child(${-split + 1}) {
              margin-bottom: ${props.gap != null ?? 1}rem;
            }
            `
      } else {
        return `
          > *:nth-child(${split}) {
            margin-bottom: auto;
            
            + * {
                margin-top: 0;
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
  ${({ className }) => {
    return Hidden({ className })
  }};
  ${({ className }) => {
    return ColumnReverse({ className })
  }};
`
