import { ReactProps } from '@filecoin/types'
import React from 'react'
import styled from 'styled-components'
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

/**
 * The Tab is used to define a "tab" container which should contain children i.e. Icon, Text component
 */

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
  border-bottom: 2px solid transparent;
  ${({ active }) =>
    active &&
    `border-bottom: 2px solid ${Colors.tabHover}; padding-bottom: 10px;`}
  &:hover {
    ${({ active }) => !active && `border-bottom: 2px solid ${Colors.borderColor};`}
  }
`
