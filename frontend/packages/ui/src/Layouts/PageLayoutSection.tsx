import React from 'react'
import classNames from 'classnames'
import { ReactProps } from '@filecoin/types'

/**
 * The `<PageLayout.Section>` props.
 */
export interface PageLayoutSectionProps {
  /**
   * The element to render the `<PageLayout.Section>` as. Defaults to `'section'`.
   */
  readonly as?: React.ElementType
}

const defaultElement = 'section'

/**
 * The `<PageLayout.Section>` component is a container used to section off PageLayout content.
 */
export const PageLayoutSection = React.forwardRef(
  (
    { as: Component = defaultElement, ...props }: PageLayoutSectionProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-page-layout__section',
      (props as { className?: string }).className,
    )
    return <Component ref={ref} className={className} {...props} />
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & PageLayoutSectionProps,
) => JSX.Element
