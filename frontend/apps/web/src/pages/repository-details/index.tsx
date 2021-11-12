import React from 'react'
import {
  MatrixMap,
  PageLayout,
  StackLayout,
  Text,
  usePageLayout,
} from '@filecoin/ui'

import { PageContainer } from '@/containers/PageContainer'

const RepositoryDetails = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const systems = model.getAllSystems()

  const pageLayout = usePageLayout({
    header: (
      <PageLayout.Header>
        <StackLayout>
          <Text type="heading 5">Systems</Text>
        </StackLayout>
      </PageLayout.Header>
    ),
    footer: <PageLayout.Footer />,
  })
  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <MatrixMap data={systems[0].subsystems[1].tests} onClick={() => null} />
      </PageLayout.Section>
    </PageLayout>
  )
}

export default RepositoryDetails
