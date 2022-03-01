import { BehaviorStatus } from '@filecoin/types'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { BehaviorData, CenterLayout, MatrixMap } from '../..'

export default {
  title: 'Matrix/All Matrix stories',
  component: MatrixMap,
} as ComponentMeta<typeof MatrixMap>

const behaviors: BehaviorData[] = [
  {
    statusForKind: BehaviorStatus.tested,
    description:
      "Given badger options 'opts', returns a new blockstore with the settings\nconfigured according to the options\n",
    expectedTestKinds: ['unit', 'integration'],
    feature: 'blockstore/badger/Open',
    id: 'SPLITSTORE_BADGER_OPEN_001',
    subsystem: 'blockstore/badger',
    system: 'blockstore',
    testedBy: [
      {
        functionName: 'TestBadgerBlockstore',
        id: 'blockstore_test.go/TestBadgerBlockstore',
        kind: 'unit',
        path: 'blockstore_test.go',
        repository: 'Users',
        status: 'pass',
      },
    ],
  },
]
const testKind = 'unit'

export const SingleMatrix: ComponentStory<typeof MatrixMap> = () => (
  <CenterLayout>
    <MatrixMap
      key={testKind}
      data={behaviors}
      onClick={() => console.log('clicked behav')}
    />
  </CenterLayout>
)
