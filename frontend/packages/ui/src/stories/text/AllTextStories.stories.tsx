import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import {
  CenterLayout,
  ColumnLayout,
  PageLayout,
  StackLayout,
  usePageLayout,
} from '../../Layouts'
import { Text } from '../../Text'

export default {
  title: 'Text/All text stories',
  component: Text,
} as ComponentMeta<typeof Text>

export const Headings: ComponentStory<typeof Text> = () => {
  const nav = usePageLayout()
  useEffect(() => {
    nav.setHeader(null)
  }, [])

  return (
    <PageLayout {...nav}>
      <PageLayout.Section>
        <StackLayout gap={0}>
          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 1" bold>
              Display
            </Text>
            <Text>H1</Text>
            <Text>Segoe UI</Text>
            <Text>72px</Text>
            <Text>-0.7px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 1">Display</Text>
            <Text>H1 Light</Text>
            <Text>Segoe UI</Text>
            <Text>72px</Text>
            <Text>-0.7px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 2" bold>
              Display
            </Text>
            <Text>H2</Text>
            <Text>Segoe UI</Text>
            <Text>54px</Text>
            <Text>0.3px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 2">Display</Text>
            <Text>H2 Light</Text>
            <Text>Segoe UI</Text>
            <Text>54px</Text>
            <Text>0.3px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 3" bold>
              Display
            </Text>
            <Text>H3</Text>
            <Text>Segoe UI</Text>
            <Text>40px</Text>
            <Text>0.3px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 3">Display</Text>
            <Text>H3 Light</Text>
            <Text>Segoe UI</Text>
            <Text>40px</Text>
            <Text>0.3px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 4" bold>
              Display
            </Text>
            <Text>H4</Text>
            <Text>Segoe UI</Text>
            <Text>28px</Text>
            <Text>0.3px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 4">Display</Text>
            <Text>H4 Light</Text>
            <Text>Segoe UI</Text>
            <Text>28px</Text>
            <Text>0.3px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 5" bold>
              Display
            </Text>
            <Text>H5</Text>
            <Text>Segoe UI</Text>
            <Text>24px</Text>
            <Text>0.3px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 5">Display</Text>
            <Text>H5 Light</Text>
            <Text>Segoe UI</Text>
            <Text>24px</Text>
            <Text>0.3px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 6" bold>
              Display
            </Text>
            <Text>H6</Text>
            <Text>Segoe UI</Text>
            <Text>18px</Text>
            <Text>0px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 6">Display</Text>
            <Text>H6 Lignt</Text>
            <Text>Segoe UI</Text>
            <Text>18px</Text>
            <Text>0px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 7" bold>
              Display
            </Text>
            <Text>H7</Text>
            <Text>Segoe UI</Text>
            <Text>16px</Text>
            <Text>0px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2}>
            <Text type="heading 7">Display</Text>
            <Text>H7 Light</Text>
            <Text>Segoe UI</Text>
            <Text>16px</Text>
            <Text>0px</Text>
          </Column>
        </StackLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}

export const Paragraphs: ComponentStory<typeof Text> = () => {
  const nav = usePageLayout()
  useEffect(() => {
    nav.setHeader(null)
  }, [])

  return (
    <PageLayout {...nav}>
      <PageLayout.Section>
        <StackLayout gap={0}>
          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text xl">Text XL</Text>
            <Text>Segoe UI</Text>
            <Text>20px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text xl" bold>
              Text XL Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>20px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text l">Text L</Text>
            <Text>Segoe UI</Text>
            <Text>18px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text l" bold>
              Text L Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>18px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text m">Text M</Text>
            <Text>Segoe UI</Text>
            <Text>16px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text m" bold>
              Text M Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>16px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text s">Text S</Text>
            <Text>Segoe UI</Text>
            <Text>14px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text s" bold>
              Text S Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>14px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text xs">Text XS</Text>
            <Text>Segoe UI</Text>
            <Text>13px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text xs" bold>
              Text XS Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>13px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text xxs">Text XXS</Text>
            <Text>Segoe UI</Text>
            <Text>11px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="text xxs" bold>
              Text XXS Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>11px</Text>
            <Text>Bold</Text>
          </Column>
        </StackLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}

export const Rest: ComponentStory<typeof Text> = () => {
  const nav = usePageLayout()
  useEffect(() => {
    nav.setHeader(null)
  }, [])

  return (
    <PageLayout {...nav}>
      <PageLayout.Section>
        <StackLayout gap={0}>
          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="subtitle l">Subtitle Large</Text>
            <Text>Segoe UI</Text>
            <Text>20px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="subtitle l" bold>
              Subtitle Large Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>20px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="subtitle m">Subtitle Base</Text>
            <Text>Segoe UI</Text>
            <Text>18px</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="subtitle m" bold>
              Subtitle Base Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>18px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="button" bold>
              Button Large
            </Text>
            <Text>Segoe UI</Text>
            <Text>16px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="button">Button Small</Text>
            <Text>Segoe UI</Text>
            <Text>13px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="overline" bold>
              Label / Input Overline Bold
            </Text>
            <Text>Segoe UI</Text>
            <Text>16px</Text>
            <Text>Bold</Text>
          </Column>

          <Column as={ColumnLayout} gap={2} className="textColumn">
            <Text type="overline">Label / Input Overline</Text>
            <Text>Segoe UI</Text>
            <Text>13px</Text>
          </Column>
        </StackLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}

const Column = styled(CenterLayout)`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span:first-child,
  label:first-child {
    min-width: 22rem;
    max-width: 22rem;
  }

  &:not(.textColumn) span {
    width: calc((100% - 22rem) / 4);
  }

  &.textColumn span:not(:first-child) {
    width: 5rem;
    max-width: 5rem;
  }
`
