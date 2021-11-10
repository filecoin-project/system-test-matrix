import React, { useState } from 'react'
import styled from 'styled-components'

import { Dropdown, DropdownSizes, DropdownStatus } from '../Dropdown/Dropdown'
import { CenterLayout, StackLayout } from '../Layouts'

export default {
  title: 'Dropdown',
  component: Dropdown,
  argTypes: {
    size: {
      name: 'size',
      defaultValue: 'medium',
      options: DropdownSizes,
    },
    multiple: {
      name: 'multiple',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    status: {
      name: 'status',
      defaultValue: 'success',
      options: DropdownStatus,
    },
    info: {
      name: 'Info message',
      defaultValue: 'Success',
    },
  },
}

const options = [
  {
    label: 'Menu item 1 ',
    value: 'option1',
  },
  {
    label: 'Menu item 2',
    value: 'option2',
  },
]

export const Default = () => {
  const [value, setValue] = useState()
  return (
    <Wrapper>
      <Dropdown
        options={options}
        value={value}
        onChange={e => setValue(e.value)}
        placeholder="Select option"
      />
    </Wrapper>
  )
}

export const Multiple = () => {
  const [value, setValue] = useState()
  return (
    <Wrapper>
      <Dropdown
        options={options}
        value={value}
        multiple={true}
        onChange={e => setValue(e.value)}
        placeholder="Select options"
      />
    </Wrapper>
  )
}

export const Size = () => {
  const [value, setValue] = useState()
  const [valueLarge, setValueLarge] = useState()
  return (
    <Wrapper>
      <StackLayout>
        <div style={{ width: 328, margin: 10 }}>
          <Dropdown
            options={options}
            value={valueLarge}
            size="large"
            onChange={e => setValueLarge(e.value)}
            placeholder="Select  large"
          />
        </div>
        <div style={{ width: 328, margin: 10 }}>
          <Dropdown
            options={options}
            value={value}
            onChange={e => setValue(e.value)}
            placeholder="Select  medium"
          />
        </div>
      </StackLayout>
    </Wrapper>
  )
}

export const Status = () => {
  const [success, setSuccess] = useState()
  const [error, setError] = useState()
  return (
    <Wrapper>
      <StackLayout>
        <div style={{ width: 328, margin: 10 }}>
          <Dropdown
            options={options}
            value={success}
            status="success"
            info="Text"
            onChange={e => setSuccess(e.value)}
            placeholder="Select success"
          />
        </div>
        <div style={{ width: 328, margin: 10 }}>
          <Dropdown
            options={options}
            value={error}
            status="error"
            info="Text"
            onChange={e => setError(e.value)}
            placeholder="Select error"
          />
        </div>
      </StackLayout>
    </Wrapper>
  )
}

const Wrapper = styled(CenterLayout)`
  height: 100%;
  padding: 2rem 0;
  width: 328px;
  box-sizing: border-box;
`
