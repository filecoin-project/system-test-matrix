import React from 'react'
import styled from 'styled-components'

import { Checkbox } from '../Checkbox'
import { Colors } from '../styles/colors'
import { Text } from '../Text'

export const DropdownItem = props => {
  const onClick = event => {
    if (props.onClick) {
      props.onClick({
        originalEvent: event,
        option: props.option,
      })
    }
  }

  return (
    <Item {...props} onClick={onClick}>
      {props.hasCheckbox && <Checkbox disabled checked={props.selected} />}
      <Text type="text s" color="gray90">
        {props.label}
      </Text>
    </Item>
  )
}

const Item = styled.li<{
  disabled: boolean
  selected: boolean
  hasCheckbox?: boolean
}>`
  &:hover {
    background: ${Colors.grayLightHover};
  }

  &:hover input {
    border: 1px solid ${Colors.onHoverCheckbox};
  }

  padding: 0.375rem 0.75rem;
  cursor: pointer;
  border-radius: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  white-space: normal;
  ${props =>
    (!props.hasCheckbox && ``) ||
    `
      input {
        margin-right: 1rem;
        margin-left: 0.5rem;
        height: 26px;
        width: 26px;
        border: 1px solid ${Colors.defaultCheckbox};
        border-radius: 50%;
      }

      input:hover::before{
        border: none;
      }

      input:checked {
        border: 1px solid ${Colors.green70};
        border-radius: 50%;
      }

      input::before{
        border-radius: 50%;
        border: 3px solid  transparent;
      }

      input:checked::before,
      input:checked:hover::before{
        border-radius: 50%;
        border: 3px solid  ${Colors.white};
      }     
    `}
  ${props =>
    props.disabled &&
    `
      background: ${Colors.grey}40;
      pointer-events: none;`}
    ${props =>
    props.selected &&
    !props.hasCheckbox &&
    `
      color: ${Colors.primary};
      font-weight: bold;`};
`
