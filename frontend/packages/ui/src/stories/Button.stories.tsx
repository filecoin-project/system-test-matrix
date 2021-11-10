import { action } from '@storybook/addon-actions'
import React from 'react'
import styled from 'styled-components'

import {
  Button,
  ButtonAppearance,
  ButtonSize,
  ButtonVariant,
  IconsPosition,
} from '../Button'
import { BoxLayout } from '../Layouts'

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    icon: {
      name: 'icon',
    },
    iconsPosition: {
      name: 'iconsPosition',
      defaultValue: 'left',
      options: IconsPosition,
    },
    variant: {
      name: 'variant',
      defaultValue: 'full',
      options: ButtonVariant,
    },
    appearance: {
      name: 'appearance',
      defaultValue: 'brand',
      options: ButtonAppearance,
    },
    size: {
      name: 'size',
      defaultValue: 'medium',
      options: ButtonSize,
    },
    loading: {
      name: 'loading',
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
  },
}

export const Brand = () => (
  <Wrapper>
    <Row>Button medium</Row>
    <Row>
      <Column>
        <Button onClick={action('Button click!')}>Full</Button>
      </Column>
      <Column>
        <Button icon={'cart'} onClick={action('Button click!')}>
          Icon{' '}
        </Button>
      </Column>
      <Column>
        {' '}
        <Button variant="outline" onClick={action('Button click!')}>
          Outline
        </Button>
      </Column>
      <Column>
        {' '}
        <Button variant="text" onClick={action('Button click!')}>
          Text
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button disabled onClick={action('Button click!')}>
          Disabled
        </Button>
      </Column>
      <Column>
        <Button disabled icon={'cart'} onClick={action('Button click!')}>
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button disabled variant="outline" onClick={action('Button click!')}>
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button disabled variant="text" onClick={action('Button click!')}>
          Disabled
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button loading onClick={action('Button click!')}>
          Loading
        </Button>
      </Column>
      <Column>
        <Button loading icon={'cart'} onClick={action('Button click!')}>
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button loading variant="outline" onClick={action('Button click!')}>
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button loading variant="text" onClick={action('Button click!')}>
          Loading
        </Button>
      </Column>
    </Row>
  </Wrapper>
)

export const System = () => (
  <Wrapper>
    <Row>Button medium</Row>
    <Row>
      <Column>
        <Button appearance="system" onClick={action('Button click!')}>
          Full
        </Button>
      </Column>
      <Column>
        <Button
          appearance="system"
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Icon{' '}
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="system"
          variant="outline"
          onClick={action('Button click!')}
        >
          Outline
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="system"
          variant="text"
          onClick={action('Button click!')}
        >
          Text
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button appearance="system" disabled onClick={action('Button click!')}>
          Disabled
        </Button>
      </Column>
      <Column>
        <Button
          appearance="system"
          disabled
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="system"
          disabled
          variant="outline"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="system"
          disabled
          variant="text"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button appearance="system" loading onClick={action('Button click!')}>
          Loading
        </Button>
      </Column>
      <Column>
        <Button
          appearance="system"
          loading
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="system"
          loading
          variant="outline"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="system"
          loading
          variant="text"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
    </Row>
  </Wrapper>
)
export const Destructive = () => (
  <Wrapper>
    <Row>Button medium</Row>
    <Row>
      <Column>
        <Button appearance="destructive" onClick={action('Button click!')}>
          Full
        </Button>
      </Column>
      <Column>
        <Button
          appearance="destructive"
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Icon{' '}
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="destructive"
          variant="outline"
          onClick={action('Button click!')}
        >
          Outline
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="destructive"
          variant="text"
          onClick={action('Button click!')}
        >
          Text
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button
          appearance="destructive"
          disabled
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        <Button
          appearance="destructive"
          disabled
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="destructive"
          disabled
          variant="outline"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="destructive"
          disabled
          variant="text"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button
          appearance="destructive"
          loading
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        <Button
          appearance="destructive"
          loading
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="destructive"
          loading
          variant="outline"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="destructive"
          loading
          variant="text"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
    </Row>
  </Wrapper>
)

export const Success = () => (
  <Wrapper>
    <Row>Button medium</Row>
    <Row>
      <Column>
        <Button appearance="success" onClick={action('Button click!')}>
          Full
        </Button>
      </Column>
      <Column>
        <Button
          appearance="success"
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Icon{' '}
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="success"
          variant="outline"
          onClick={action('Button click!')}
        >
          Outline
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="success"
          variant="text"
          onClick={action('Button click!')}
        >
          Text
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button appearance="success" disabled onClick={action('Button click!')}>
          Disabled
        </Button>
      </Column>
      <Column>
        <Button
          appearance="success"
          disabled
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="success"
          disabled
          variant="outline"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="success"
          disabled
          variant="text"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button appearance="success" loading onClick={action('Button click!')}>
          Loading
        </Button>
      </Column>
      <Column>
        <Button
          appearance="success"
          loading
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="success"
          loading
          variant="outline"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          appearance="success"
          loading
          variant="text"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
    </Row>
  </Wrapper>
)

export const Badge = () => (
  <Wrapper>
    <Row>
      <Column className="badge">
        <Button variant="badge" onClick={action('Button click!')}>
          Badge
        </Button>
      </Column>
      <Column className="badge">
        <Button
          icon="filled_star"
          variant="badge"
          onClick={action('Button click!')}
        >
          Badge
        </Button>
      </Column>
      <Column className="badge">
        <Button
          icon="filled_star"
          iconsPosition="right"
          variant="badge"
          onClick={action('Button click!')}
        >
          Badge
        </Button>
      </Column>
      <Column className="badge">
        {' '}
        <Button
          icon="filled_star"
          iconsPosition="both"
          variant="badge"
          onClick={action('Button click!')}
        >
          Badge
        </Button>
      </Column>
    </Row>
    <Row>
      <Column className="badge">
        <Button size="small" variant="badge" onClick={action('Button click!')}>
          Badge
        </Button>
      </Column>
      <Column className="badge">
        <Button
          size="small"
          icon="filled_star"
          variant="badge"
          onClick={action('Button click!')}
        >
          Badge
        </Button>
      </Column>
      <Column className="badge">
        <Button
          size="small"
          icon="filled_star"
          iconsPosition="right"
          variant="badge"
          onClick={action('Button click!')}
        >
          Badge
        </Button>
      </Column>
      <Column className="badge">
        <Button
          size="small"
          icon="filled_star"
          iconsPosition="both"
          variant="badge"
          onClick={action('Button click!')}
        >
          Badge
        </Button>
      </Column>
    </Row>
  </Wrapper>
)

export const Icon = () => (
  <Wrapper>
    <Row>
      <Column>Gray</Column>
      <Column>
        <Button
          variant="icon"
          appearance="gray"
          icon="settings"
          size="large"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          variant="icon"
          appearance="gray"
          icon="settings"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          variant="icon"
          appearance="gray"
          icon="settings"
          size="small"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          disabled
          variant="icon"
          appearance="gray"
          icon="settings"
          onClick={action('Button click!')}
        />
      </Column>
    </Row>
    <Row>
      <Column>Brand</Column>
      <Column>
        <Button
          variant="icon"
          appearance="brand"
          icon="settings"
          size="large"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          variant="icon"
          appearance="brand"
          icon="settings"
          onClick={action('Button click!')}
        />
      </Column>

      <Column>
        <Button
          variant="icon"
          appearance="brand"
          icon="settings"
          size="small"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          disabled
          variant="icon"
          appearance="brand"
          icon="settings"
          onClick={action('Button click!')}
        />
      </Column>
    </Row>
    <Row>
      <Column>System</Column>
      <Column>
        <Button
          variant="icon"
          appearance="system"
          icon="settings"
          size="large"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          variant="icon"
          appearance="system"
          icon="settings"
          onClick={action('Button click!')}
        />
      </Column>

      <Column>
        <Button
          variant="icon"
          appearance="system"
          icon="settings"
          size="small"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          disabled
          variant="icon"
          appearance="system"
          icon="settings"
          onClick={action('Button click!')}
        />
      </Column>
    </Row>
    <Row>
      <Column>Text</Column>
      <Column>
        <Button
          variant="icon"
          appearance="blank"
          icon="settings"
          size="large"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          variant="icon"
          appearance="blank"
          icon="settings"
          onClick={action('Button click!')}
        />
      </Column>

      <Column>
        <Button
          variant="icon"
          appearance="blank"
          icon="settings"
          size="small"
          onClick={action('Button click!')}
        />
      </Column>
      <Column>
        <Button
          disabled
          variant="icon"
          appearance="blank"
          icon="settings"
          onClick={action('Button click!')}
        />
      </Column>
    </Row>
  </Wrapper>
)

export const Sizing = args => (
  <Wrapper>
    <Row>Button large</Row>
    <Row>
      <Column>
        <Button {...args} size="large" onClick={action('Button click!')}>
          Full
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          size="large"
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Icon{' '}
        </Button>
      </Column>

      <Column>
        <Button
          {...args}
          size="large"
          variant="outline"
          onClick={action('Button click!')}
        >
          Outline
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="large"
          variant="text"
          onClick={action('Button click!')}
        >
          Text
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button
          {...args}
          size="large"
          disabled
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          size="large"
          disabled
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="large"
          disabled
          variant="outline"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="large"
          disabled
          variant="text"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button
          {...args}
          size="large"
          loading
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          size="large"
          loading
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="large"
          loading
          variant="outline"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="large"
          loading
          variant="text"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
    </Row>

    {/* 
   Brand Button medium
    */}
    <Row>Button medium</Row>
    <Row>
      <Column>
        <Button {...args} onClick={action('Button click!')}>
          Full
        </Button>
      </Column>
      <Column>
        <Button {...args} icon={'cart'} onClick={action('Button click!')}>
          Icon{' '}
        </Button>
      </Column>
      <Column>
        {' '}
        <Button {...args} variant="outline" onClick={action('Button click!')}>
          Outline
        </Button>
      </Column>
      <Column>
        {' '}
        <Button {...args} variant="text" onClick={action('Button click!')}>
          Text
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button {...args} disabled onClick={action('Button click!')}>
          Disabled
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          disabled
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          disabled
          variant="outline"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          disabled
          variant="text"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button {...args} loading onClick={action('Button click!')}>
          Loading
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          loading
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          loading
          variant="outline"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          loading
          variant="text"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
    </Row>
    {/* 
    Brand Button small
    */}
    <Row>Button small</Row>
    <Row>
      <Column>
        <Button {...args} size="small" onClick={action('Button click!')}>
          Full
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          size="small"
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Icon{' '}
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="small"
          variant="outline"
          onClick={action('Button click!')}
        >
          Outline
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="small"
          variant="text"
          onClick={action('Button click!')}
        >
          Text
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button
          {...args}
          size="small"
          disabled
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          size="small"
          disabled
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="small"
          disabled
          variant="outline"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="small"
          disabled
          variant="text"
          onClick={action('Button click!')}
        >
          Disabled
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button
          {...args}
          size="small"
          loading
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          size="small"
          loading
          icon={'cart'}
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="small"
          loading
          variant="outline"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
      <Column>
        {' '}
        <Button
          {...args}
          size="small"
          loading
          variant="text"
          onClick={action('Button click!')}
        >
          Loading
        </Button>
      </Column>
    </Row>
    {/* 
  Full width button
    */}
    <Row>Full width</Row>
    <Button
      className={'u-full-width'}
      onClick={action('Button click!')}
      {...args}
    >
      Button
    </Button>
  </Wrapper>
)
export const WithIcons = args => (
  <Wrapper>
    <Row>
      <Column>
        <Button
          {...args}
          icon={'cart'}
          onClick={action('Button click!')}
          iconsPosition="left"
        >
          Button{' '}
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          icon={'cart'}
          onClick={action('Button click!')}
          iconsPosition="right"
        >
          Button{' '}
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          icon={'cart'}
          onClick={action('Button click!')}
          iconsPosition="left"
          disabled
        >
          Disabled{' '}
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          icon={'cart'}
          onClick={action('Button click!')}
          iconsPosition="left"
          loading
        >
          Loading{' '}
        </Button>
      </Column>
    </Row>
    <Row>
      <Column>
        <Button
          {...args}
          appearance="system"
          icon={'cart'}
          onClick={action('Button click!')}
          iconsPosition="left"
        >
          Button{' '}
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          appearance="system"
          icon={'cart'}
          onClick={action('Button click!')}
          iconsPosition="right"
        >
          Button{' '}
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          appearance="system"
          icon={'cart'}
          onClick={action('Button click!')}
          iconsPosition="left"
          disabled
        >
          Disabled{' '}
        </Button>
      </Column>
      <Column>
        <Button
          {...args}
          appearance="system"
          icon={'cart'}
          onClick={action('Button click!')}
          iconsPosition="left"
          loading
        >
          Loading{' '}
        </Button>
      </Column>
    </Row>
  </Wrapper>
)

export const Details = args => (
  <Wrapper>
    <Button
      icon={'cart'}
      onClick={action('Button click!')}
      iconsPosition="left"
      {...args}
    >
      Button{' '}
    </Button>
  </Wrapper>
)
const Wrapper = styled(BoxLayout)`
  display: flex;
  align-items: flex-start;
  flex-flow: row wrap;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 1.9rem;
  justify-content: center;
  flex: 1;

  &.badge {
    flex: none;
  }
`
const Row = styled.div`
  display: flex;
  margin: 1.3rem 0;
  width: 100%;
`
