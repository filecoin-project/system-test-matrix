import { SystemScore, TestStatus } from '@filecoin/types'
import { Button, Icon, Link, PageLayout, Text } from '@filecoin/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const TABS = ['overview', 'detailedView'] as const
type Tab = typeof TABS[number]
type pageAncestors = { path: string; name: string }[]

interface HeaderProps {
  activeTab?: Tab
  score?: SystemScore | TestStatus
  onTabChange?: (Tab) => void
  pageName?: string
  pageAncestors?: pageAncestors
  hideTabs?: boolean
}
interface BreadCrumbsProps {
  pageName: string
  pageAncestors?: pageAncestors
  score?: SystemScore | TestStatus
}

export const getButton = (status: TestStatus | SystemScore) => {
  const { t } = useTranslation()

  const getColor = () => {
    if (Object.keys(TestStatus).includes(status)) {
      switch (status) {
        case TestStatus.pass: {
          return 'success'
        }
        case TestStatus.fail: {
          return 'error'
        }
        case TestStatus.missing: {
          return 'secondary'
        }
        case TestStatus.unannotated: {
          return 'secondary'
        }
        case TestStatus.unparsed: {
          return 'secondary'
        }
      }
    } else if (Object.keys(SystemScore).includes(status)) {
      switch (status) {
        case SystemScore.good: {
          return 'success'
        }
        case SystemScore.bad: {
          return 'error'
        }
        case SystemScore.mediocre: {
          return 'warning'
        }
      }
    }
  }

  return (
    <Button
      style={{ pointerEvents: 'none' }}
      variant="rounded"
      size="small"
      color={getColor()}
    >
      <Text color="white" type="text s" bold>
        {t(`filecoin.allTests.${status}`)}
      </Text>
    </Button>
  )
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({
  pageName,
  score,
  pageAncestors,
  ...props
}) => {
  return (
    <Crumbs>
      <Link to="/">
        <Text type="heading 5" semiBold>
          Systems
        </Text>
      </Link>
      <Text type="text xl" semiBold>
        {' '}
        /
      </Text>
      {pageAncestors?.map(ancestor => (
        <>
          <Link to={ancestor.path} key={ancestor.name}>
            <StyledText type="text xl" semiBold>
              {ancestor.name}
            </StyledText>
          </Link>
          <Text type="text xl" semiBold>
            {' '}
            /
          </Text>
        </>
      ))}
      <StyledText type="text xl" semiBold>
        {pageName}
      </StyledText>
      <ButtonWrapper>{getButton(score)}</ButtonWrapper>
    </Crumbs>
  )
}

export const SystemHeader: React.FC<HeaderProps> = ({
  activeTab,
  hideTabs = false,
  score,
  onTabChange,
  pageName,
  pageAncestors,
}) => {
  return (
    <PageLayout.Header>
      <BreadCrumbs
        pageName={pageName}
        score={score}
        pageAncestors={pageAncestors}
      />

      {!hideTabs && (
        <PageLayout.Tabs>
          <PageLayout.Tab
            onClick={() => {
              onTabChange('overview')
            }}
            active={activeTab === 'overview'}
          >
            <Icon name="book" size="small" />
            <Text>Overview</Text>
          </PageLayout.Tab>
          <PageLayout.Tab
            onClick={() => onTabChange('detailedView')}
            active={activeTab === 'detailedView'}
          >
            <Icon name="detailed_view" size="small" />
            <Text>Detailed view</Text>
          </PageLayout.Tab>
        </PageLayout.Tabs>
      )}
    </PageLayout.Header>
  )
}

const Crumbs = styled.div``
const ButtonWrapper = styled.span`
  padding-left: 15px;
`
const StyledText = styled(Text)`
  padding-right: 5px;
  padding-left: 5px;
`
