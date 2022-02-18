import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { Fragment, useState } from 'react'
import { Button, TruncatedText } from '../..'
import { getButton } from '../../../../../apps/web/src/components/system/SystemHeader'
import { StackLayout } from '../../Layouts'
import { Modal } from '../../Modal'
import { Table } from '../../Table'
import { Text } from '../../Text'

export default {
  title: 'Modal/All Modal Stories',
  component: Modal,
} as ComponentMeta<typeof Modal>

export const BehaviorModal: ComponentStory<typeof Modal> = args => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  const mockedData = [
    {
      path: 'api_test.go',
      functionName: 'TestAPI',
      kind: 'integration',
      status: 'pass',
    },
    {
      path: 'api_test.go',
      functionName: 'TestAPI2',
      kind: 'integration',
      status: 'fail',
    },
    {
      path: 'api_test.go',
      functionName: 'TestAPI3',
      kind: 'integration',
      status: 'pass',
    },
  ]

  const tableColumns = {
    path: {
      header: ' ',
      Cell: ({ data: { path } }) => {
        return <Text>{path}</Text>
      },
    },
    functionName: {
      header: ' ',
      Cell: ({ data: { functionName } }) => {
        return <Text as={TruncatedText}>{functionName}</Text>
      },
    },
    testKind: {
      header: ' ',
      width: 160,
      Cell: ({ data: { kind } }) => {
        return <Text>{kind}</Text>
      },
    },
    score: {
      header: ' ',
      width: 160,
      Cell: ({ data: { status } }) => {
        return <Text>{getButton(status)}</Text>
      },
    },
  }
  return (
    <Fragment>
      <Button
        onClick={() => {
          handleOpen()
        }}
        size="medium"
        variant="rounded"
        color="success"
      >
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <StackLayout gap={2}>
          <StackLayout gap={0.5}>
            <Text type="heading 5" semiBold>
              Behaviour ID
            </Text>
            <Text>Behaviour description</Text>
            <div>
              <Text bold>System/Subsystem: </Text>
              <Text>Behaviour subsystem</Text>
            </div>
            <div>
              <Text bold>Feature name: </Text>
              <Text>Behaviour feature</Text>
            </div>
          </StackLayout>
          <StackLayout gap={1}>
            <Text type={'subtitle l'} semiBold>
              Linked tests
            </Text>
            <Table variant={'light'} data={mockedData} columns={tableColumns} />
          </StackLayout>
        </StackLayout>
      </Modal>
    </Fragment>
  )
}

export const TestModal: ComponentStory<typeof Modal> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }

  const mockedData = [
    {
      path: 'CHAIN_SYNCER_LOAD_GENESIS_001',
      testKind: 'Load and return the Genesis block from the ChainStore',
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
      <Button
        onClick={() => {
          handleOpen()
        }}
        size="medium"
        variant="rounded"
        color="success"
      >
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
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
