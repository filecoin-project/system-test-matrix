import { BehaviorStatus } from '@filecoin/types'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CenterLayout } from '../..'
import { MatrixMap } from '../../MatrixMap'

export default {
  title: 'Matrix/Properties',
  component: MatrixMap,
  args: {
    data: [
      { value: 1 },
      {
        statusForKind: BehaviorStatus.tested,
      },
    ],
  },
  argTypes: {
    data: {},
  },
} as ComponentMeta<typeof MatrixMap>

export const LoaderProperties: ComponentStory<typeof MatrixMap> = args => {
  return (
    <CenterLayout>
      <MatrixMap {...args} />
    </CenterLayout>
  )
}

LoaderProperties.storyName = 'Properties'
