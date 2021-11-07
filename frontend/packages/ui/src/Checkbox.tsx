import { ElementProps } from '@filecoin/types'
import React from 'react'
import styled from 'styled-components'
import { v4 as generateRandomId } from 'uuid'

import { Colors } from './styles/colors'

/**
 * Checkbox props
 * */
export interface CheckboxProps extends ElementProps<'input'> {
  /**
   * This represents if checkbox has error (if it is unchecked )
   * */
  hasError?: boolean
  /**
   * This is the label of checkbox
   * */
  label?: string
  /**
   * Possible values for appearance  prop of Checkbox component.
   */
  appearance?: CheckboxAppearance
}
export const CheckboxAppearance = ['small', 'medium', 'large'] as const
export type CheckboxAppearance = typeof CheckboxAppearance[number]
export const Sizing = {
  fontSize: {
    large: 1.25,
    medium: 1,
    small: 0.75,
  },
}
/**
 * Checkbox component like native with hasError flag and passed label
 * */
export const Checkbox = styled(
  ({
    id = generateRandomId(),
    onChange,
    ...props
  }: CheckboxProps): JSX.Element => {
    const checkboxHandler = event => {
      onChange && onChange(event)
    }
    return (
      <label htmlFor={id}>
        <input
          id={id}
          {...props}
          type="checkbox"
          data-element="checkbox"
          onChange={event => checkboxHandler(event)}
        />
        {props.label && <span> {props.label}</span>}
      </label>
    )
  },
)`
  position: relative;
  width: 24px;
  min-width: 24px;
  height: 24px;
  margin: 0;
  padding: 0;
  visibility: ${props => (props.hidden ? 'hidden' : 'visible')};
  appearance: none;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    content: '';
    border: ${props => {
      return props.hasError
        ? `1px solid ${Colors.errorCheckbox}`
        : `1px solid ${Colors.defaultCheckbox}`
    }};
    border-radius: 6px;
    box-shadow: 0 1px 3px #0000001f;
  }

  &:hover::before {
    border: 1px solid ${Colors.onHoverCheckbox};
  }

  + span {
    vertical-align: middle;
    color: ${({ hasError }) =>
      (hasError && Colors.errorCheckbox) || Colors.defaultCheckboxText};
    font-size: ${({ appearance }) =>
      (appearance && `${Sizing.fontSize[appearance]}rem`) || `1rem`};
    user-select: none;

    &:hover {
      cursor: ${({ disabled }) => !disabled && 'pointer'};
    }
  }

  &:checked::before {
    content: '';
    background: url('/assets/icons/check_mark.svg') center no-repeat;
    border-color: ${Colors.activeCheckbox};
    background-color: ${Colors.activeCheckbox};
  }

  &:disabled {
    pointer-events: none;
  }
`
