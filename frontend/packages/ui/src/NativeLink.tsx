import { ElementProps, ReactProps } from '@filecoin/types'
import classNames from 'classnames'
import { darken, lighten } from 'polished'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Icon, IconNamesType } from './Icon'
import { Colors } from './styles/colors'
import { Size } from './styles/mixins'

/**
 * Possible values for `appearance` prop of `Link` component.
 * Refers to the color of the component
 */
export const NativeLinkAppearance = ['default', 'system'] as const
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

/**
 * NativeLink is by default used as anchor link, so that you can visit external links
 */

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
  display: inline-flex;
  align-items: center;
  transition: color 0.3s;
  cursor: pointer;
  letter-spacing: 0.5px;

  svg {
    margin-right: 6px;
  }

  &[disabled] {
    opacity: 0.5;
    text-decoration: none;
    pointer-events: none;
  }
`

const System = styled(NativeLinkComponent)`
  color: ${Colors.blueLink};

  &:hover {
    color: ${darken(0.2, `${Colors.blueLink}`)};

    svg {
      fill: ${darken(0.2, `${Colors.blueLink}`)};
    }
  }

  &:focus {
    color: ${lighten(0.2, `${Colors.blueLink}`)};

    svg {
      fill: ${lighten(0.2, `${Colors.blueLink}`)};
    }
  }

  &[disabled] {
    color: ${Colors.gray80};
  }
`

const Default = styled(NativeLinkComponent)`
  color: ${Colors.gray80};
  font-weight: 400;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    color: ${lighten(0.2, `${Colors.gray90}`)};
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
      case 'default':
        return Default
      case 'system':
        return System

      default:
        return Default
    }
  }
  const ActiveComponent = getActiveComponent()
  return (
    <span>
      <ActiveComponent appearance={appearance} {...props}>
        {icon && (
          <Icon
            size="medium"
            name={icon}
            color={props.disabled ? 'gray' : 'blue'}
          />
        )}
        {children}
      </ActiveComponent>
    </span>
  )
}
