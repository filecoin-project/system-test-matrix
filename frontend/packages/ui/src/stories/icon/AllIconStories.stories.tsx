import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { IconNames, IconNamesType } from '../..'
import { Icon } from '../../Icon'
import { GridLayout } from '../../Layouts/GridLayout'
import { Text } from '../../Text'

export default {
  title: 'Icon/All Icon Stories',
  component: Icon,
  parameters: {
    controls: {
      disable: true,
    },
  },
} as ComponentMeta<typeof Icon>
const usedIcons = [
  'arrow_up',
  'arrow_down',
  'arrow_left_double',
  'arrow_right_double',
  'book',
  'detailed_view',
  'close',
  'search',
]
export const AllIcons: ComponentStory<typeof Icon> = () => (
  <GridLayout>
    {IconNames.map((name: IconNamesType) => {
      return usedIcons.includes(name) ? (
        <React.Fragment key={name}>
          <Text>{name}</Text>
          {name === 'check_mark' ? (
            <Icon name={name} style={{ background: 'gray' }} />
          ) : (
            <Icon name={name} />
          )}
        </React.Fragment>
      ) : null
    })}
  </GridLayout>
)
