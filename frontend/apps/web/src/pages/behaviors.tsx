import React, { useEffect, useState } from 'react'
import {
  Modal,
  NativeLink,
  PageLayout,
  StackLayout,
  Table,
  Text,
  CardLayout,
  usePageLayout,
  BoxLayout,
  CenterLayout,
  ProgressBar,
  Icon,
} from '@filecoin/ui'
import { useTranslation } from 'react-i18next'
import { Behavior } from '@filecoin/types'

import { PageContainer } from '@/containers/PageContainer'
import { BehaviorModal } from '@/components/behaviors/BehaviorModal'

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
            d.Tested += 1
          } else if (behavior.tested === false) {
            d.Untested += 1
          } else {
            d.Unknown += 1
          }
          return d
        },
        {
          Untested: 0,
          Tested: 0,
          Unknown: 0,
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

  const pageLayout = usePageLayout({
    header: (
      <PageLayout.Header>
        <StackLayout>
          <Text type="heading 5">{t('filecoin.behaviors.title')}</Text>
        </StackLayout>
      </PageLayout.Header>
    ),
  })

  const tableColumns = {
    id: {
      header: t('filecoin.behaviors.tableHeaders.behaviorId'),
      Cell: ({ data }) => {
        return (
          <NativeLink
            className={'u-text--xsmall'}
            onClick={() => setModalId(data)}
            as={'span'}
          >
            {data.id}
          </NativeLink>
        )
      },
    },
    name: {
      header: t('filecoin.behaviors.tableHeaders.featureName'),
      Cell: ({ data: { parentFeatureName } }) => {
        return <Text>{parentFeatureName}</Text>
      },
    },
    description: {
      header: t('filecoin.behaviors.tableHeaders.intendedBehavior'),
      Cell: ({ data: { description } }) => {
        return <Text>{description}</Text>
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
              <Text type={'subtitle l'}>
                {t('filecoin.behaviors.behaviorStatus')}
              </Text>

              <ProgressBar
                data={behaviorChartData}
                legend
                onClick={() => null}
              />
            </StackLayout>
          </BoxLayout>
        </CardLayout>
      </PageLayout.Section>

      <PageLayout.Section>
        <Modal isOpen={!!modalId} onClose={() => setModalId(undefined)}>
          <BehaviorModal />
        </Modal>

        <StackLayout gap={1.25}>
          <Text type={'subtitle l'}>
            {t('filecoin.behaviors.listOfAllBehaviors')} ({behaviors.length})
          </Text>
          <Table data={behaviors} columns={tableColumns} />
        </StackLayout>
      </PageLayout.Section>
    </PageLayout>
  )
}

export default Behaviors
