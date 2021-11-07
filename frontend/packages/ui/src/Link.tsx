import React, { FunctionComponent } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import styled from 'styled-components'

import { Icon, IconNamesType } from './Icon'
import { Colors } from './styles/colors'
import { Fonts } from './styles/fonts'
import { Size } from './styles/mixins'

/**
 * Possible values for `appearance` prop of `Link` component.
 * Refers to the color of the component
 */
export const LinkAppearance = ['default', 'brand', 'system'] as const
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
  font-family: ${Fonts.Manrope};
  font-weight: bold;
  ${props => Size({ className: props.className })};
  line-height: 16px;
  letter-spacing: 0.2px;
  display: inline-flex;
  align-items: center;

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
const Brand = styled(LinkComponent)`
  color: ${Colors.purple70};

  &:hover {
    color: ${Colors.purple80};
  }

  &[disabled] {
    color: ${Colors.purple80};
  }
`

const System = styled(LinkComponent)`
  color: ${Colors.gray90};

  &:hover {
    color: ${Colors.gray90};
  }

  &[disabled] {
    color: ${Colors.gray80};
  }
`

const Default = styled(LinkComponent)`
  font-family: ${Fonts.OpenSans};
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

export const Link: FunctionComponent<LinkProps> = ({
  icon,
  appearance = 'default',
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
    <span>
      <ActiveComponent appearance={appearance} {...props}>
        {children}
        <Icon size="xsmall" name={icon} color="gray" />
      </ActiveComponent>
    </span>
  )
}
