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

export const AllIcons: ComponentStory<typeof Icon> = () => (
  <GridLayout>
    {IconNames.map((name: IconNamesType) => (
      <React.Fragment key={name}>
        <Text>{name}</Text>
        {name === 'check_mark' ? (
          <Icon name={name} style={{ background: 'gray' }} />
        ) : (
          <Icon name={name} />
        )}
      </React.Fragment>
    ))}
  </GridLayout>
)
