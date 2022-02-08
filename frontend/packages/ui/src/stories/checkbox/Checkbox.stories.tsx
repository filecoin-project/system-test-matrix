import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Checkbox } from '../../Checkbox'
import CheckboxDocs from './CheckboxDocs.mdx'

export default {
  title: 'Checkbox',
  component: Checkbox,
  parameters: {
    docs: { page: CheckboxDocs },
    controls: {
      exclude: /.*/s,
    },
  },
} as ComponentMeta<typeof Checkbox>

export const Default: ComponentStory<typeof Checkbox> = () => <Checkbox />

export const Checked: ComponentStory<typeof Checkbox> = () => (
  <Checkbox checked />
)
export const Error: ComponentStory<typeof Checkbox> = () => (
  <Checkbox hasError />
)
export const Label: ComponentStory<typeof Checkbox> = () => (
  <Checkbox label="This is example of checkbox with label" />
)
