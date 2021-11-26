import { ReactProps } from '@filecoin/types'
import classNames from 'classnames'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Text } from '../Text'
import { BoxLayout } from './BoxLayout'
export interface HeaderProps {
  /**
   * The element to render the `<Header>` as. Defaults to 'header'.
   */
  readonly as?: React.ElementType
  /**
   * The header content.
   */
  readonly children?: React.ReactNode
}

const defaultElement = 'header'

export const PageLayoutHeader = React.forwardRef(
  (
    { as: Component = defaultElement, children, ...props }: HeaderProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-page-layout__header',
      (props as { className?: string }).className,
    )

    return (
      <Component ref={ref} {...props} className={className}>
        <div className={'c-page-layout__header--logo'}>
          <BoxLayout>
            <NavLink to={'/'}>
              <Text
                type="text l"
                color="white"
                bold
                style={{ letterSpacing: '0.07em' }}
              >
                System Test Matrix
              </Text>
            </NavLink>
          </BoxLayout>
        </div>
        {children}
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & HeaderProps,
) => JSX.Element
