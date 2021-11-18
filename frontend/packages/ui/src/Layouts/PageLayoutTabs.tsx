import { ReactProps } from '@filecoin/types'
import { styled } from '@storybook/theming'
import React from 'react'

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
export const PageLayoutTabs = React.forwardRef(
  (
    { as: Component = defaultElement, children, ...props }: TabsProps,
    ref: React.Ref<Element>,
  ) => {
    return (
      <Component ref={ref} {...props}>
        <Tabs>{children}</Tabs>
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & TabsProps,
) => JSX.Element

const Tabs = styled.a`
  max-width: 1100px;
  display: flex;
  gap: 12px;
  position: absolute;
  bottom: 0;
`
