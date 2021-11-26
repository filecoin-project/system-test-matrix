import { ElementProps, ReactProps } from '@filecoin/types'
import classNames from 'classnames'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Icon, IconNamesType } from './Icon'
import { Colors } from './styles/colors'
import { Size } from './styles/mixins'

/**
 * Possible values for `appearance` prop of `Link` component.
 * Refers to the color of the component
 */
export const NativeLinkAppearance = ['default', 'brand', 'system'] as const
export type NativeLinkAppearanceType = typeof NativeLinkAppearance[number]

/**
 * The Link props.
 */
export interface NativeLinkProps extends ElementProps<'a'> {
  /**
   * The element to render the `<NativeLink>` as. Defaults to 'a'.
   */
  readonly as?: React.ElementType
  /**
   * Optional icon to render alongside the label.
   */
  icon?: IconNamesType
  /**
   * Link appearance. Refers to link colors
   */
  appearance?: NativeLinkAppearanceType
  /**
   * Link disabled
   */
  disabled?: boolean
}

const defaultElement = 'a'

const Link = React.forwardRef(
  (
    { as: Component = defaultElement, children, ...props }: NativeLinkProps,
    ref: React.Ref<Element>,
  ) => {
    const className = classNames(
      'c-native-link',
      (props as { className?: string }).className,
    )
    return (
      <Component ref={ref} {...props} className={className}>
        {children}
      </Component>
    )
  },
) as <T extends React.ElementType = typeof defaultElement>(
  props: { as?: T } & Omit<ReactProps<T>, 'as'> & NativeLinkProps,
) => JSX.Element

const NativeLinkComponent = styled(Link)`
  font-weight: bold;
  ${props => Size({ className: props.className })};
  line-height: 16px;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  & [data-element='icon'] {
    margin: 0.1rem 0.25rem 0;
  }

  &:hover {
    text-decoration: underline;
  }

  &[disabled] {
    opacity: 0.5;
    text-decoration: none;
    pointer-events: none;
  }
`
const Brand = styled(NativeLinkComponent)`
  color: ${Colors.purple70};

  &:hover {
    color: ${Colors.purple80};
  }

  &[disabled] {
    color: ${Colors.purple80};
  }
`

const System = styled(NativeLinkComponent)`
  color: ${Colors.gray90};

  &:hover {
    color: ${Colors.gray90};
  }

  &[disabled] {
    color: ${Colors.gray80};
  }
`

const Default = styled(NativeLinkComponent)`
  color: ${Colors.gray80};
  font-weight: 400;

  &:hover {
    color: ${Colors.gray90};
    text-decoration: none;
  }

  &[disabled] {
    color: ${Colors.gray60};
  }
`

export const NativeLink: FunctionComponent<NativeLinkProps> = ({
  icon,
  appearance,
  children,
  ...props
}) => {
  const getActiveComponent = () => {
    switch (appearance) {
      case 'brand':
        return Brand
      case 'system':
        return System

      default:
        return Default
    }
  }
  const ActiveComponent = getActiveComponent()
  return (
    <>
      <ActiveComponent appearance={appearance} {...props}>
        {children}
        <Icon size="xsmall" name={icon} color="gray" />
      </ActiveComponent>
    </>
  )
}
