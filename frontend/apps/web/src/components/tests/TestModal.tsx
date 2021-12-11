import React from 'react'
import { Test } from '@filecoin/types'
import { StackLayout, Table, Text } from '@filecoin/ui'

interface Props {
  test: Test
}

export const TestModal: React.FC<Props> = ({ test }) => {
  const tableColumns = {
    path: {
      header: ' ',
      Cell: ({ data: { id } }) => {
        return <Text>{id}</Text>
      },
    },
    testKind: {
      header: ' ',
      width: 325,
      Cell: ({ data: { description } }) => {
        return <Text>{description}</Text>
      },
    },
  }

  return (
    <StackLayout gap={2}>
      <StackLayout gap={0.5}>
        <div>
          <Text bold>Name: </Text>
          <Text>{test.id.split('/')[1]}</Text>
        </div>
        <div>
          <Text bold>Repository: </Text>
          <Text>{test.repository}</Text>
        </div>
      </StackLayout>
      <StackLayout gap={1}>
        <Text type="subtitle l">Linked Behaviours</Text>
        <Table
          variant="light"
          data={test.linkedBehaviors}
          columns={tableColumns}
        />
      </StackLayout>
    </StackLayout>
  )
}
