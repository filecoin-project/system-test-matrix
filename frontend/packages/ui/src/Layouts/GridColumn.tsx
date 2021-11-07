import React from 'react'
import styled from 'styled-components'
import { ReactProps } from '@filecoin/types'
import { metrics } from '@filecoin/core'

/**
 * Possible values for `span` prop of `GridColumn` component.
 */
export const GridSpans = [1, 2, 3, 4, 6, 8, 12] as const
export type GridSpans = typeof GridSpans[number]

/**
 * The `<PageLayout.Section>` props.
 */
export interface GridColumnProps {
  /**
   * The element to render the `<PageLayout.Section>` as. Defaults to `'section'`.
   */
  readonly as?: React.ElementType
  /**
   * To set the width of children (in number of columns) use `span` prop.
   * */
  readonly span?: GridSpans
}

const defaultElement = 'section'

/**
 * The `<GridLayout.Column>` component is a container used to define columns for GridLayout.
 */
export const Column = React.forwardRef(
  (
    { as: Component = defaultElement, ...props }: GridColumnProps,
    ref: React.Ref<Element>,
  ) => {
    return <Component ref={ref} {...props} />
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & GridColumnProps,
) => JSX.Element

export const GridColumn = styled(Column)`
  ${props => {
    if (props.span) {
      let result = `grid-column-end: span ${props.span};`

      if (props.span > 8) {
        result += `@media (max-width: ${metrics['large-desktop']}px) {
          grid-column-end: span 8;
        }`
      }

      if (props.span > 4) {
        result += `@media (max-width: ${metrics.tablet}px) {
          grid-column-end: span 4;
        }`
      }

      return result
    }
    return ''
  }}
`
