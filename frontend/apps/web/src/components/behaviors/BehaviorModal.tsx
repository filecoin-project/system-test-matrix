import { getButton } from '@/components/system/SystemHeader'
import { PageContainer } from '@/containers/PageContainer'
import { Behavior } from '@filecoin/types'
import { StackLayout, Table, Text, TruncatedText } from '@filecoin/ui'
import React from 'react'



interface Props {
  behavior: Behavior
}

export const BehaviorModal = (props: Props) => {
  const {
    state: { model },
  } = PageContainer.useContainer()

  const tests = model.getAllTests()

  const getLinkedBehaviors = tests.filter(test =>
    test.linkedBehaviors
      .map(behavior => behavior.id)
      .includes(props.behavior?.id),
  )

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

  // if (!getLinkedBehaviors?.length) {
  //   return (
  //     <BoxLayout gap={1}>
  //       <CenterLayout centerText>
  //         <Text>There is no linked tests for this behavior.</Text>
  //       </CenterLayout>
  //     </BoxLayout>
  //   )
  // }

  return (
    <StackLayout gap={2}>
      {props.behavior && (
        <StackLayout gap={0.5}>
          <Text type={'heading 5'} semiBold>
            {props.behavior.id}
          </Text>
          <Text>{props.behavior.description}</Text>
          <div>
            <Text bold>System/Subsystem: </Text>
            <Text>{props.behavior.subsystem}</Text>
          </div>
          <div>
            <Text bold>Feature name: </Text>
            <Text>{props.behavior.feature}</Text>
          </div>
        </StackLayout>
      )}
      {getLinkedBehaviors.length ? (
        <StackLayout gap={1}>
          <Text type={'subtitle l'} semiBold>
            Linked tests
          </Text>
          <Table
            variant={'light'}
            data={getLinkedBehaviors}
            columns={tableColumns}
          />
        </StackLayout>
      ) : (
        <Text>This behavior is untested.</Text>
      )}
    </StackLayout>
  )
}
