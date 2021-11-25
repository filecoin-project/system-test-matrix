import { ReactProps } from '@filecoin/types'
import React from 'react'
import styled from 'styled-components'

export interface TabsProps {
  /**
   * The element to render the `<Tabs>` as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
  /**
   * The tab content.
   */
  readonly children?: React.ReactNode
}
const defaultElement = 'div'

/**
 * The Tabs is used to define a "tabs" container which should contain children i.e. "tab" component
 */

const Tabs = React.forwardRef(
  (
    { as: Component = defaultElement, children, ...props }: TabsProps,
    ref: React.Ref<Element>,
  ) => {
    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & TabsProps,
) => JSX.Element

export const PageLayoutTabs = styled(Tabs)`
  max-width: 1100px;
  display: flex;
  gap: 12px;
  position: absolute;
  bottom: 0;

  svg {
    margin: auto;
  }
`
