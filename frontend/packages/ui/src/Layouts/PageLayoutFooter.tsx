import React from 'react'
import { ReactProps } from '@filecoin/types'
import classNames from 'classnames'

export interface FooterProps {
  /**
   * The element to render the `<Footer>` as. Defaults to 'footer'.
   */
  readonly as?: React.ElementType
  /**
   * The footer content.
   */
  readonly children?: React.ReactNode

  /**
   * The footer height. Value is in 'rem'. Default is 6.25
   */
  readonly height?: number
}

const defaultElement = 'footer'

export const PageLayoutFooter = React.forwardRef(
  (
    {
      as: Component = defaultElement,
      children,
      height = 6.25,
      ...props
    }: FooterProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-page-layout__footer',
      (props as { className?: string }).className,
    )
    return (
      <Component
        ref={ref}
        {...props}
        className={className}
        style={{ height: `${height}rem` }}
      >
        {children}
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & FooterProps,
) => JSX.Element
