import classNames from 'classnames'
import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { Colors } from './styles/colors'
import { FullWidth, Hidden } from './styles/mixins'

export const TextStyle = [
  'heading 1',
  'heading 2',
  'heading 3',
  'heading 4',
  'heading 5',
  'heading 6',
  'heading 7',
  'text xl',
  'text l',
  'text m',
  'text s',
  'text xs',
  'text xxs',
  'overline',
  'subtitle l',
  'subtitle m',
  'button',
] as const
type TextStyle = typeof TextStyle[number]

export const TextColors = [
  'red',
  'green',
  'white',
  'blue',
  'gray60',
  'gray70',
  'gray80',
  'gray90',
  'textGray',
] as const
type TextColors = typeof TextColors[number]
const defaultElement = 'span'
const defaultHTMLElement = new Map<TextStyle, React.ElementType>([
  ['heading 1', 'h1'],
  ['heading 2', 'h2'],
  ['heading 3', 'h3'],
  ['heading 4', 'h4'],
  ['heading 5', 'h5'],
  ['heading 6', 'h6'],
  ['heading 7', 'h6'],
  ['overline', 'label'],
])

type TextProps = {
  /**
   * Type determines html tag and its font styles
   * Font Sizes:
   * h1 - 4.5rem (72px)
   * h2 - 3.375rem (54px)
   * h3 - 2.5rem (40px)
   * h4 - 1.75rem (28px)
   * h5 - 1.375rem (22px)
   * h6 - 1.125rem (18px)
   * h7 - 1rem (16px)
   * xl - 1.25rem (20px)
   * l - 1.125rem (18px)
   * m - 1rem (16px)
   * s - 0.875rem (14px)
   * xs - 0.8125rem (13px)
   * xxs - 0.6875rem (11px)
   */
  type?: TextStyle
  /**
   * If text is required to have different color than default.
   * Class 'u-text--color-colorName' will be created so it can be styled outside this component
   */
  color?: TextColors

  /**
   * Use bold or light variant of font
   */
  bold?: boolean
  /**
   * Use semi-bold variant of font
   */
  semiBold?: boolean
  /**
   * Text align style property
   */
  align?: 'left' | 'right' | 'center'
  /**
   * Specify html element used to create text component
   */
  as?: React.ElementType
} & HTMLAttributes<HTMLOrSVGElement>

const TextComponent: FunctionComponent<TextProps> = ({
  type = 'text m',
  color,
  as: Component = defaultHTMLElement.get(type) || defaultElement,
  children,
  className,
  ...props
}: TextProps) => (
  <Component
    className={classNames(
      className,
      `c-text--${type.split(' ').join('-') || ''}`,
      color && `c-text--color-${color}`,
    )}
    {...props}
  >
    {children}
  </Component>
)

export const Text = styled(TextComponent)<TextProps>`
  ${({ className }) => FullWidth({ className })};
  ${({ className }) => Hidden({ className })};
  ${({ bold, semiBold }) => {
    return `font-weight: ${bold ? 'bold' : semiBold ? 600 : 'normal'};`
  }};
  ${({ type = 'text m', bold }) => {
    switch (type) {
      case 'heading 1':
        return `
        font-size: 4.5rem;
        line-height: 5rem;
        letter-spacing: -0.7px;
      `
      case 'heading 2':
        return `
        font-size: 3.375rem;
        line-height: 4rem;
        letter-spacing: ${bold ? -0.7 : -0.3}px;
      `
      case 'heading 3':
        return `
        font-size: 2.5rem;
        letter-spacing: 0.3px;
        line-height: 3rem;
        letter-spacing: ${bold ? 0.3 : 0}px;  
      `
      case 'heading 4':
        return `
        font-size: 1.75rem;
        line-height: 3rem;
        letter-spacing: ${bold ? 0 : 0.3}px;
      `
      case 'heading 5':
        return `
        font-size: 1.5rem;
        line-height: 1.75rem;
        letter-spacing: ${bold ? 0.5 : 0.3}px;       
      `
      case 'heading 6':
        return `
        font-size: 1.125rem;
        line-height: 1.5rem;
        letter-spacing: 0.3px;    
        `
      case 'heading 7':
        return `
          line-height: 1.25rem;     
          letter-spacing: ${bold ? 0 : 0.3}px;
          `
      case 'subtitle l':
        return `
          font-size: 1.25rem;
          line-height: ${bold ? 1.375 : 1.75}rem;
          `
      case 'subtitle m':
        return `
          font-size: 1.125rem;
          line-height: 1.75rem;
            `
      case 'text xl':
        return `
          font-size: 1.25rem;
          line-height: 1.75rem;
        `
      case 'text l':
        return `
          font-size: 1.125rem;
          line-height: 1.75rem;         
        `
      case 'text m':
        return `
          line-height: 1.5rem;
          letter-spacing: 0.2px;
        `
      case 'text s':
        return `
          font-size: 0.875rem;
          line-height: 1.375rem;
          letter-spacing: 0.1px;
        `
      case 'text xs':
        return `
          font-size: 0.8125rem;
          line-height: 1.25rem;
          letter-spacing: 0.1px;
        `
      case 'text xxs':
        return `

          font-size: 0.6875rem;
          line-height: 1;
          letter-spacing: 0.4px;

        `
      case 'overline':
        return `
          font-size: 0.6875rem;
          font-weight: ${bold ? 'bold' : 'normal'};
          line-height: ${bold ? 1 : 0.875}rem;
          letter-spacing: ${bold ? 0.8 : 0.2}px;
        `
      case 'button':
        return `
          font-size: ${bold ? 1 : 0.8}rem;
          font-weight: bold;
          line-height: 1rem;
          letter-spacing: 0.2px;
        `
    }
  }}
  color: ${({ color }) => {
    switch (color) {
      case 'gray60':
        return Colors.gray60
      case 'gray70':
        return Colors.gray70
      case 'gray80':
        return Colors.gray80
      case 'gray90':
        return Colors.gray90
      case 'red':
        return Colors.red60
      case 'green':
        return Colors.green80
      case 'white':
        return Colors.white
      case 'textGray':
        return Colors.textGray
      case 'blue':
        return Colors.blueLink
      default:
        return Colors.textColor
    }
  }};
  ${({ align }) => {
    return align && `text-align: ${align}`
  }};
  justify-content: ${({ align }) => {
    switch (align) {
      case 'left':
        return 'flex-start'
      case 'right':
        return 'flex-end'
      case 'center':
        return 'center'
    }
  }};
  word-break: break-word;
`
