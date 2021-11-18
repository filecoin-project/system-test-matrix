import { ReactProps } from '@filecoin/types'
import { styled } from '@storybook/theming'
import React from 'react'
import { Colors } from '../styles/colors'

export interface TabProps {
  /**
   * Is tab active
   */
  active: boolean
  /**
   * Action dispatched on tab click
   */
  onClick: () => void
  /**
   * The element to render the `<Tab>` as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
  /**
   * The tab content.
   */
  readonly children?: React.ReactNode
}
const defaultElement = 'div'
export const PageLayoutTab = React.forwardRef(
  (
    {
      as: Component = defaultElement,
      onClick,
      active,
      children,
      ...props
    }: TabProps,
    ref: React.Ref<Element>,
  ) => {
    return (
      <Component onClick={onClick()} ref={ref} {...props}>
        <Tab active={active}>{children}</Tab>
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & TabProps,
) => JSX.Element

const Tab = styled.a<Pick<TabProps, 'active'>>`
  display: flex;
  padding: 12px;
  gap: 12px;
  cursor: pointer;
  position: relative;
  z-index: 3;
  color: ${Colors.textGray};
  ${({ active }) =>
    active &&
    `border-bottom: 2px solid ${Colors.tabHover}; padding-bottom: 10px;`}
`
