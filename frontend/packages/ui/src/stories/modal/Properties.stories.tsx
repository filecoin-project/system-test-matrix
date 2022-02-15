import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { Fragment } from 'react'
import { StackLayout, Table, Text } from '../..'
import { Modal } from '../../Modal'

export default {
  title: 'Modal/Properties',
  component: Modal,
  args: {
    isOpen: true,
    title: '',
    footer: '',
  },
} as ComponentMeta<typeof Modal>

export const ModalProperties: ComponentStory<typeof Modal> = args => {
  const mockedData = [
    {
      path: 'Data example',
      testKind: 'Data example',
    },
  ]

  const columns = {
    path: {
      header: ' ',
      Cell: ({ data: { path } }) => {
        return <Text>{path}</Text>
      },
    },
    testKind: {
      header: ' ',
      Cell: ({ data: { testKind } }) => {
        return <Text>{testKind}</Text>
      },
    },
  }
  return (
    <Fragment>
      <Modal {...args}>
        <StackLayout gap={2}>
          <StackLayout gap={0.5}>
            <div>
              <Text bold>Name: </Text>
              <Text>This is function name</Text>
            </div>
            <div>
              <Text bold>Repository: </Text>
              <Text>This is repository name</Text>
            </div>
          </StackLayout>
          <StackLayout gap={1}>
            <Text type="subtitle l">Linked Behaviours</Text>
            <Table variant="light" data={mockedData} columns={columns} />
          </StackLayout>
        </StackLayout>
      </Modal>
    </Fragment>
  )
}

ModalProperties.storyName = 'Properties'
