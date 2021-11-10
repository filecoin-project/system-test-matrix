import React from 'react'
import { ReactProps } from '@filecoin/types'
import styled from 'styled-components'

/**
 * The Box Layout primitive is used to define a "box", i.e. a container for something.
 * The only thing a Box Layout does is defining a padding, nothing more, nothing less.
 *
 *
 *              Box Layout
 *    /-----------------------------\
 *    | /////////////////////////// | <====== Padding
 *    | /// +-----------------+ /// |
 *    | /// |                 | /// |
 *    | /// |                 | /// | <====== Content
 *    | /// |                 | /// |
 *    | /// +-----------------+ /// |
 *    | /////////////////////////// | <====== Padding
 *    \-----------------------------/
 *       ↑                       ↑
 *    Padding                 Padding
 *
 *
 * Usage:
 *
 * <BoxLayout>
 *     Lorem ipsum dolor...
 * </div>
 *
 */

/**
 * Possible values for `gap` prop of `BoxLayout` component.
 */
export const BoxLayoutGap = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 3.5, 4] as const
export type BoxLayoutGap = typeof BoxLayoutGap[number]

/**
 * The BoxLayout props.
 */
export interface BoxLayoutProps {
  /**
   * The element to render the Box Layout as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
  /**
   * The size of a gap between box border and its content (i.e. the padding). Defaults to `16`.
   */
  readonly gap?: BoxLayoutGap
}

const defaultElement = 'div'

/**
 * The BoxLayout primitive is used to define a "box", i.e. a container for something.
 * The only thing a BoxLayout does is defining a padding, nothing more, nothing less.
 */
export const Box = React.forwardRef(
  (
    { as: Component = defaultElement, ...props }: BoxLayoutProps,
    ref: React.Ref<Element>,
  ) => {
    return <Component ref={ref} {...props} />
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & BoxLayoutProps,
) => JSX.Element

export const BoxLayout = styled(Box)`
  display: block;
  padding: ${props => `${props.gap || 1}rem`};
`
