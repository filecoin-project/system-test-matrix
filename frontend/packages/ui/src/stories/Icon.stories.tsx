import { Meta, Story } from '@storybook/react'
import React from 'react'

import { IconNames, IconNamesType } from '..'
import { Icon, IconProps } from '../Icon'
import { GridLayout } from '../Layouts/GridLayout'
import { Text } from '../Text'

export default {
  title: 'Icon',
  component: Icon,
} as Meta

const Template: Story<IconProps> = args => <Icon {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'settings',
}
export const AllIcons = () => (
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
