import { ReactProps, RefForwardingComponent } from '@filecoin/types'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Colors } from '../styles/colors'
import { zIndex } from '../styles/constants'

import { CoverLayout } from './CoverLayout'
import { GridLayout } from './GridLayout'
import { PageLayoutFooter } from './PageLayoutFooter'
import { PageLayoutHeader } from './PageLayoutHeader'
import { PageLayoutSection } from './PageLayoutSection'
import { PageLayoutTab } from './PageLayoutTab'
import { PageLayoutTabs } from './PageLayoutTabs'
import { StackLayout } from './StackLayout'

/**
 * Whether something (usually a sidebar) is in open or closed state.
 */
export type OpenState = 'open' | 'closed'

/**
 * The Page Layout state object.
 */
export interface PageLayoutState {
  /**
   * A React node to use to render the header.
   */
  header?: React.ReactNode
  /**
   * A React node to use to render the footer.
   */
  footer?: React.ReactNode
}

/**
 * Actions exposed by the `usePageLayout()` hook.
 */
export interface PageLayoutActions {
  /**
   * Set the header React node (set to `null` to hide header).
   *
   * @param header A React node to render in the header area.
   */
  setHeader(
    header?:
      | React.ReactNode
      | ((previousState: PageLayoutState) => React.ReactNode),
  ): void
  /**
   * Set the footer React node (set to `null` to hide footer).
   *
   * @param footer A React node to render in the footer area.
   */
  setFooter(
    footer?:
      | React.ReactNode
      | ((previousState: PageLayoutState) => React.ReactNode),
  ): void
}

/**
 * Hook that stores and manages the `PageLayoutState`.
 *
 * @param initialState The initial `PageLayoutState` object.
 */
export function usePageLayout({
  header,
  footer,
}: PageLayoutState = {}): PageLayoutState & PageLayoutActions {
  const [state, setState] = useState<PageLayoutState>({
    header,
    footer,
  })

  const setHeader = useCallback(
    (
      value:
        | React.ReactNode
        | ((previousState: PageLayoutState) => React.ReactNode),
    ) => {
      setState(previousState => {
        const header =
          typeof value === 'function' ? value(previousState) : value
        if (header !== previousState.header) {
          return {
            ...previousState,
            header,
          }
        }
        return previousState
      })
    },
    [],
  )

  const setFooter = useCallback(
    (
      value:
        | React.ReactNode
        | ((previousState: PageLayoutState) => React.ReactNode),
    ) => {
      setState(previousState => {
        const footer =
          typeof value === 'function' ? value(previousState) : value
        if (footer !== previousState.footer) {
          return {
            ...previousState,
            footer,
          }
        }
        return previousState
      })
    },
    [],
  )

  return {
    ...state,
    setHeader,
    setFooter,
  }
}

/**
 * Props of `<PageLayout>` component.
 */
export type PageLayoutProps = ReactProps<'div'> &
  PageLayoutState &
  PageLayoutActions

/**
 * The `<PageLayout>` component represents a container which layouts the main areas of a page.
 */
export interface PageLayout
  extends RefForwardingComponent<PageLayoutProps, HTMLDivElement> {
  /**
   * The `<PageLayout.Section>` component is a container used to section off PageLayout content.
   */
  Section: typeof PageLayoutSection
  Header: typeof PageLayoutHeader
  Tabs: typeof PageLayoutTabs
  Tab: typeof PageLayoutTab
  Footer: typeof PageLayoutFooter
}

/**
 * The `<PageLayout>` component represents a container which layouts the main areas of a page.
 */
export const Page: PageLayout = Object.assign(
  React.forwardRef(function PageLayout(
    { className, children, header, footer, ...props }: PageLayoutProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div {...props} className={className} ref={ref}>
        {header != null && header}
        <PageContent gap={4}>{children}</PageContent>
        {footer != null && footer}
      </div>
    )
  }),
  {
    Section: PageLayoutSection,
    Header: PageLayoutHeader,
    Tabs: PageLayoutTabs,
    Tab: PageLayoutTab,
    Footer: PageLayoutFooter,
  },
)

const HEADER_HEIGHT = 185
const CONTENT_MAX_WIDTH = 1203

export const PageLayout = styled(Page)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  z-index: 0;
  background: ${Colors.background};

  .c-page-layout__header {
    position: sticky;
    left: 0;
    top: 0;
    width: 100vw;
    height: ${HEADER_HEIGHT}px;
    z-index: ${zIndex.layer200};
    background: ${Colors.headerBackground};
    border-bottom: 1px solid ${Colors.borderColor};
    padding: 3.5rem 3.75rem 2rem;

    button {
      margin-top: 2.25rem;
    }

    &--logo {
      background: ${Colors.logoBackground};
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding-left: 2.75rem;
    }
  }

  .c-page-layout__footer {
    display: flex;
    width: 100vw;
    height: 6.25rem;
    max-width: calc(1203px - 4rem);
    margin: auto auto 0;
    border-top: 1px solid ${Colors.borderColor};
    color: ${Colors.logoBackground};

    > div {
      padding-left: 0;
    }
  }

  ${GridLayout} {
    padding-right: 0;
    padding-left: 0;
  }
`

const PageContent = styled(StackLayout)`
  width: 100%;
  height: 100%;
  grid-column: 2;
  grid-row: 2;
  padding-bottom: 4rem;

  .c-page-layout__section {
    padding-left: 2rem;
    padding-right: 2rem;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: ${CONTENT_MAX_WIDTH}px;

    &:first-child {
      padding-top: 4rem;
    }
  }

  ${CoverLayout} {
    margin-top: auto;
    margin-bottom: auto;

    &:only-child {
      padding-top: 4rem;
      min-height: calc(100vh - 4rem);
    }
  }
`
