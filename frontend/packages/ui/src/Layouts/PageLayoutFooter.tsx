import React from 'react'
import { ReactProps } from '@filecoin/types'
import classNames from 'classnames'

import { Text } from '../Text'

import { BoxLayout } from './BoxLayout'

export interface FooterProps {
  /**
   * The element to render the `<Footer>` as. Defaults to 'footer'.
   */
  readonly as?: React.ElementType
}

const defaultElement = 'footer'

export const PageLayoutFooter = React.forwardRef(
  (
    { as: Component = defaultElement, ...props }: FooterProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-page-layout__footer',
      (props as { className?: string }).className,
    )
    return (
      <Component ref={ref} {...props} className={className}>
          <BoxLayout>
            <Text type="text xs">&copy; 2021 FileCoin</Text>
          </BoxLayout>
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & FooterProps,
) => JSX.Element
