import { ReactProps } from '@filecoin/types'
import { styled } from '@storybook/theming'
import React from 'react'
import { Colors } from '../styles/colors'

export interface TabProps extends ReactProps<'div'> {
  /**
   * Is tab active
   */
  active?: boolean
  /**
   * The element to render the `<Tab>` as. Defaults to 'div'.
   */
  readonly as?: React.ElementType
}
const defaultElement = 'div'

const Tab = React.forwardRef(
  (
    {
      as: Component = defaultElement,
      children,
      active = false,
      ...props
    }: TabProps,
    ref: React.Ref<Element>,
  ) => {
    return (
      <Component active={active} ref={ref} onClick={props.onClick} {...props}>
        {children}
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & TabProps,
) => JSX.Element

export const PageLayoutTab = styled(Tab)`
  display: flex;
  padding: 12px;
  gap: 12px;
  cursor: pointer;
  color: ${Colors.textGray};
  ${({ active }) =>
    active &&
    `border-bottom: 2px solid ${Colors.tabHover}; padding-bottom: 10px;`}
`
