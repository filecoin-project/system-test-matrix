import React from 'react'
import styled from 'styled-components'
import { ReactProps } from '@filecoin/types'

/**
 *              Cover Layout
 *    /-----------------------------\
 *    |                             |
 *    |                             |
 *    |         +---------+         |
 *    |         |         |         |
 *    |         |         |         | <====== Content
 *    |         |         |         |
 *    |         +---------+         |
 *    |                             |
 *    |                             |
 *    \-----------------------------/
 *
 */

/**
 * The `<CoverLayout>` props.
 */
export interface CoverLayoutProps {
  /**
   * The element to render the Cover Layout as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
}

const defaultElement = 'div'

/**
 * The Cover Layout primitive is used to cover its entire parent and both
 * vertically and horizontally center its children.
 */
export const CoverLayout = styled(
  React.forwardRef(
    (
      { as: Component = defaultElement, ...props }: CoverLayoutProps,
      ref: React.Ref<Element>,
    ) => <Component ref={ref} {...props} />,
  ) as <T extends React.ElementType = typeof defaultElement>(
    props: { as?: T } & Omit<ReactProps<T>, 'as'> & CoverLayoutProps,
  ) => JSX.Element,
)`
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  min-height: 100%;
`
