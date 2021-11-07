import React from 'react'
import styled from 'styled-components'
import { ReactProps, RefForwardingComponent } from '@filecoin/types'
import { metrics } from '@filecoin/core'

import { GridColumn } from './GridColumn'

/**
 *                          Grid Layout
 *    /----------------------------------------------------\
 *    | # +----------+ /// +----------+ /// +----------+ # |
 *    | # |          | /// |          | /// |          | # |
 *    | # |          | /// |          | /// |          | # |
 *    | # |          | /// |          | /// |          | # |
 *    | # +----------+ /// +----------+ /// +----------+ # |
 *    | # ////////////////////////////////////////////// # | <- Gap
 *    | # +---------------------------+ /// +----------+ # |
 *    | # |                           | /// |          | # |
 *    | # |                           | /// |          | # |
 *    | # |                           | /// |          | # |
 *    | # +---------------------------+ /// +----------+ # |
 *    \----------------------------------------------------/
 *      ↑                                ↑               ↑
 *   Padding                            Gap           Padding
 *
 */

/**
 * The GridLayout props.
 */
export interface GridLayoutProps {
  /**
   * The element to render the Grid Layout as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
}

const defaultElement = 'div'

/**
 * The GridLayout primitive layouts its children in a two dimensional responsive grid.
 * The grid adapts based on the screen size between 12, 8 and 4 columns.
 */
export interface GridLayout
  extends RefForwardingComponent<GridLayoutProps, HTMLDivElement> {
  /**
   * The `<GridLayout.Column>` component is a container used to define columns for GridLayout.
   */
  Column: typeof GridColumn
}

export const Grid = Object.assign(
  React.forwardRef(
    (
      { as: Component = defaultElement, ...props }: GridLayoutProps,
      ref: React.Ref<Element>,
    ) => {
      return <Component ref={ref} {...props} />
    },
  ) as <T extends React.ElementType = typeof defaultElement>(
    props: { as?: T } & Omit<ReactProps<T>, 'as'> & GridLayoutProps,
  ) => JSX.Element,
  { Column: GridColumn },
)

const getMaxWidth = (columns, gap, padding, maxColumnSize, minColumnSize) => {
  return `
  padding-left: ${padding}px;
  padding-right: ${padding}px;
  grid-gap: ${gap}px;
  max-width: ${padding * 2 + (columns - 1) * gap + columns * maxColumnSize}px;
  grid-template-columns: repeat(${columns}, minmax(${minColumnSize}px, 1fr));
  `
}

export const GridLayout = styled(Grid)`
  display: grid;
  grid-auto-flow: dense;
  margin: 0 auto;
  ${getMaxWidth(4, 16, 16, 135, 60)};

  @media (min-width: ${metrics.tablet}px) {
    ${getMaxWidth(8, 16, 16, 79, 60)}
  }

  @media (min-width: ${metrics.desktop}px) {
    ${getMaxWidth(8, 16, 32, 99, 60)}
  }

  @media (min-width: ${metrics['large-desktop']}px) {
    ${getMaxWidth(12, 24, 32, 68, 54)}
  }
`
