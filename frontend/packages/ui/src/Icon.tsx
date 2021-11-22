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
  'bell',
  'book',
  'calendar',
  'camera',
  'cart',
  'chart_up',
  'check_mark',
  'clock',
  'close',
  'comment',
  'congress',
  'copy',
  'course',
  'create_new',
  'currency',
  'dashboard',
  'delete',
  'dev_mode',
  'directions',
  'documents',
  'download',
  'earnings',
  'edit',
  'explore',
  'export',
  'eye',
  'eye_closed',
  'facebook',
  'file',
  'filled_star',
  'filter_three',
  'free',
  'google',
  'grid_menu',
  'half_star',
  'heart',
  'help',
  'hint',
  'history',
  'hold',
  'image',
  'info',
  'instagram',
  'invites',
  'invites_two',
  'link',
  'linkedin',
  'loader',
  'loader_two',
  'location',
  'lock',
  'lock_two',
  'lock_three',
  'logout',
  'logout_two',
  'mail',
  'mentions',
  'menu',
  'menu_left',
  'menu_more',
  'menu_right',
  'minus',
  'mode',
  'new_message',
  'number_one',
  'number_two',
  'online',
  'orders',
  'outlined_star',
  'page_settings',
  'placeholder',
  'play_two',
  'plus',
  'policy',
  'posts',
  'premium',
  'profile',
  'profile_settings',
  'qr',
  'refer_afriend',
  'refresh',
  'refresh_two',
  'refresh_three',
  'resync',
  'save',
  'scan',
  'search',
  'section',
  'settings',
  'share',
  'sticker',
  'store',
  'stream',
  't_o_s',
  'theme',
  'ticket',
  'transfer',
  'transfer_five',
  'twitter',
  'up_and_down',
  'verify',
  'video',
  'video_available',
  'wallet',
  'wallet_sync',
  'warning',
  'warning_line',
  'work',
  'workshop',
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
