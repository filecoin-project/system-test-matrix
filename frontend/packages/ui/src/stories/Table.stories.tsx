import React from 'react'
import styled from 'styled-components'
import { Table } from '../Table'

export default {
  title: 'Table',
  component: Table,
}

const tableColumns = {
  title: {
    header: 'Title',
    Cell: ({ data: { title } }) => <span>{title}</span>,
  },
  price: {
    header: 'Price',
    Cell: ({ data: { price } }) => <span>{price}</span>,
  },
}

export const Default = () => {
  const data = [
    {
      title: 'One',
      price: 100,
    },
    {
      title: 'Two',
      price: 200,
    },
  ]

  return (
    <Wrapper>
      <h1>Default</h1>
      <Table variant="default" data={data} columns={tableColumns} />
    </Wrapper>
  )
}
export const Light = () => {
  const data = [
    {
      title: 'One',
      price: 100,
    },
    {
      title: 'Two',
      price: 200,
    },
  ]

  return (
    <Wrapper>
      <h1>Light</h1>
      <Table variant="light" data={data} columns={tableColumns} />
    </Wrapper>
  )
}

export const Subtle = () => {
  const data = [
    {
      title: 'One',
      price: 100,
    },
    {
      title: 'Two',
      price: 200,
    },
  ]

  return (
    <Wrapper>
      <h1>Subtle</h1>
      <Table variant="subtle" data={data} columns={tableColumns} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  padding: 4rem;
`
