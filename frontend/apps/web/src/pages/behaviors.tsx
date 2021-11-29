import { BehaviorModal } from '@/components/behaviors/BehaviorModal'
import { PageContainer } from '@/containers/PageContainer'
import { Behavior } from '@filecoin/types'
import {
  BoxLayout,
  Button,
  CardLayout,
  CenterLayout,
  Icon,
  Modal,
  NativeLink,
  PageLayout,
  ProgressBar,
  StackLayout,
  Table,
  Text,
  usePageLayout,
} from '@filecoin/ui'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Behaviors = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const { t } = useTranslation()
  const behaviors = model.getAllBehaviors()
  const [modalId, setModalId] = useState<Behavior | undefined>(undefined)

  const prepareBehaviorChart = () => {
    return Object.entries(
      behaviors.reduce(
        (d, behavior) => {
          if (behavior.tested === true) {
            d.tested += 1
          } else if (behavior.tested === false) {
            d.untested += 1
          } else {
            d.unknown += 1
          }
          return d
        },
        {
          untested: 0,
          tested: 0,
          unknown: 0,
        },
      ),
    ).map(([key, count]) => ({
      name: key,
      percentage: (count / behaviors.length) * 100,
    }))
  }

  const [behaviorChartData, setBehaviorChartData] = useState(
    prepareBehaviorChart(),
  )
  const navigate = useNavigate()

  const pageLayout = usePageLayout({
    header: (
      <PageLayout.Header>
        <HeaderWrapper>
          <Text type="heading 5" bold>
            {t('filecoin.behaviors.title')}
          </Text>
          <Button
            onClick={() => navigate('/tests')}
            variant="outline"
            size="medium"
          >
            <Text type="text s" bold>
              {t('filecoin.allTests.allTests')}
            </Text>
          </Button>
        </HeaderWrapper>
      </PageLayout.Header>
    ),
    footer: <PageLayout.Footer />,
  })

  const tableColumns = {
    id: {
      header: t('filecoin.behaviors.tableHeaders.behaviorId'),
      Cell: ({ data }) => {
        return (
          <>
            {data.tested ? (
              <NativeLink
                className={'u-text--xsmall'}
                appearance={'system'}
                onClick={() => setModalId(data)}
              >
                {data.id}
              </NativeLink>
            ) : (
              <Text color="textGray">{data.id}</Text>
            )}
          </>
        )
      },
    },
    name: {
      header: t('filecoin.behaviors.tableHeaders.featureName'),
      Cell: ({ data: { parentFeatureName } }) => {
        return <Text color="textGray">{parentFeatureName}</Text>
      },
    },
    description: {
      header: t('filecoin.behaviors.tableHeaders.intendedBehavior'),
      Cell: ({ data: { description } }) => {
        return <Text color="textGray">{description}</Text>
      },
    },
    isTested: {
      header: t('filecoin.behaviors.tableHeaders.isTested'),
      width: 100,
      Cell: ({ data: { tested } }) => {
        return (
          <CenterLayout>
            {tested ? (
              <Icon name={'check_mark'} color={'green'} />
            ) : (
              <Icon name={'minus'} color={'red'} />
            )}
          </CenterLayout>
        )
      },
    },
  }

  useEffect(() => {
    setBehaviorChartData(prepareBehaviorChart())
  }, [])

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <CardLayout>
          <BoxLayout gap={2}>
            <StackLayout gap={0.5}>
              <Text type={'subtitle l'} color="textGray" bold>
                {t('filecoin.behaviors.behaviorStatus')}
              </Text>

              <ProgressBar data={behaviorChartData} legend />
            </StackLayout>
          </BoxLayout>
        </CardLayout>
      </PageLayout.Section>

      <PageLayout.Section>
        <Modal isOpen={!!modalId} onClose={() => setModalId(undefined)}>
          <BehaviorModal behavior={modalId} />
        </Modal>

        <StackLayout gap={1.25}>
          <Text type={'subtitle l'} color="textGray" bold>
            {t('filecoin.behaviors.listOfAllBehaviors')} ({behaviors.length})
          </Text>
          <Table data={behaviors} columns={tableColumns} />
        </StackLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}

export default Behaviors

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    margin-top: auto;
    margin-bottom: auto;
  }
`
