import { darken, lighten } from 'polished'
import React, { FunctionComponent } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import styled from 'styled-components'
import { Icon, IconNamesType } from './Icon'
import { Colors } from './styles/colors'
import { Size } from './styles/mixins'

/**
 * Possible values for `appearance` prop of `Link` component.
 * Refers to the color of the component
 */
export const LinkAppearance = ['default', 'system'] as const
export type LinkAppearance = typeof LinkAppearance[number]

/**
 * The Link props.
 */
export interface LinkProps extends RouterLinkProps {
  /**
   * Optional icon to render alongside the label.
   */
  icon?: IconNamesType
  /**
   * Link appearance. Refers to link colors
   */
  appearance?: LinkAppearance
  /**
   * Link disabled
   */
  disabled?: boolean
}

const LinkComponent = styled(RouterLink)<{
  appearance: LinkAppearance
}>`
  font-weight: bold;
  letter-spacing: 0.5px;
  ${props => Size({ className: props.className })};
  display: inline-flex;
  align-items: center;
  transition: color 0.3s;

  svg {
    margin-right: 6px;
  }

  &[disabled] {
    opacity: 0.5;
    text-decoration: none;
    pointer-events: none;
  }
`

const System = styled(LinkComponent)`
  color: ${Colors.blueLink};
  font-weight: 600;

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

const Default = styled(LinkComponent)`
  color: ${Colors.black};

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

export const Link: FunctionComponent<LinkProps> = ({
  icon,
  appearance = 'default',
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
