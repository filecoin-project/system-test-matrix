import { ReactProps } from '@filecoin/types'
import classNames from 'classnames'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

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
            <NavWrapper to={'/'}>
              <img width="26" height="26" src={'/img/logo.png'} />
              <Text color="white" bold>
                System Test Matrix
              </Text>
            </NavWrapper>
          </BoxLayout>
        </div>
        {children}
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & HeaderProps,
) => JSX.Element

const NavWrapper = styled(NavLink)`
  img {
    vertical-align: bottom;
    margin-right: 9px;
  }
`
