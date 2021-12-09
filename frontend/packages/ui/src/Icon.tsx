import classNames from 'classnames'
import React from 'react'
import InlineSVG, { Props } from 'react-inlinesvg'
import styled from 'styled-components'
import { Colors } from './styles/colors'

export const IconNames = [
  'arrow_down',
  'arrow_left',
  'arrow_right',
  'arrow_up',
  'back_arrow',
  'book',
  'check_mark',
  'close',
  'delete',
  'detailed_view',
  'eye',
  'eye_closed',
  'help',
  'info',
  'link',
  'loader',
  'loader_two',
  'lock',
  'lock_two',
  'lock_three',
  'menu',
  'menu_left',
  'menu_more',
  'menu_right',
  'minus',
  'search',
  'warning',
  'arrow_up_and_down',
] as const
export type IconNamesType = typeof IconNames[number]

export const IconSizes = [
  'xlarge',
  'large',
  'medium',
  'regular',
  'small',
  'xsmall',
] as const

export type IconSizes = typeof IconSizes[number]

export const IconColor = [
  'gray',
  'green',
  'red',
  'white',
  'blue',
  'black',
] as const
export type IconColorType = typeof IconColor[number]
export const ColorHex = {
  gray: Colors.gray80,
  green: Colors.green70,
  red: Colors.red70,
  white: Colors.white,
  blue: Colors.blueLink,
  black: Colors.black,
}

/**
 * Set width and height size based on className prop
 * Possible values: 'c-icon--xsmall' , 'c-icon--small' , 'c-icon--regular' , 'c-icon--large', 'c-icon--xlarge'
 * Default : 'u-icon--regular'
 */
export const IconSize = (classJoin = '') => {
  const classes = classJoin.split(' ')

  if (classes.includes('c-icon--xsmall')) {
    return 12
  } else if (classes.includes('c-icon--small')) {
    return 16
  } else if (classes.includes('c-icon--medium')) {
    return 20
  } else if (classes.includes('c-icon--regular')) {
    return 24
  } else if (classes.includes('c-icon--large')) {
    return 32
  } else if (classes.includes('c-icon--xlarge')) {
    return 40
  }
  return 24
}
export interface IconProps extends Omit<Props, 'src'> {
  /**
   * Possible values for `name` prop of `Icon` component.
   */
  name: IconNamesType
  /**
   * This number represents width and height of icon, also it adds class to Icon e.g. "c-icon--regular"
   * */
  size?: IconSizes
  /**
   * This represents icon color you want to render, also it adds class to Icon e.g. "c-icon--color-regular"
   * */
  color?: IconColorType
  /**
   * className for adding classes on svg
   * */
  className?: string
}

export const Icon = styled(
  ({
    name,
    size = 'regular',
    color = 'gray',
    className,
    ...props
  }: IconProps): JSX.Element => {
    const classJoin = classNames(
      className,
      `c-icon--${size}`,
      `c-icon--color-${color}`,
    )
    return (
      <InlineSVG
        src={`/assets/icons/${name}.svg`}
        fill={color && ColorHex[color]}
        className={`${classJoin}`}
        style={{
          width: IconSize(classJoin),
          height: IconSize(classJoin),
        }}
        {...props}
      />
    )
  },
)`
  display: flex;
  align-items: center;
  justify-content: center;
`
