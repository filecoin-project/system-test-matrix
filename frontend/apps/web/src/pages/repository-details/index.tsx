import React from 'react'
import {
  MatrixMap,
  PageLayout,
  StackLayout,
  Text,
  usePageLayout,
  CardLayout,
  ColumnLayout,
  BoxLayout,
} from '@filecoin/ui'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

import { PageContainer } from '@/containers/PageContainer'

const RepositoryDetails = () => {
  const {
    state: { model },
  } = PageContainer.useContainer()
  const systems = model.getAllSystems()
  const testKinds = model.getAllTestKinds()
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
  const currentSystem = systems[0]

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <DetailedView>
          <ReactTooltip
            effect="solid"
            getContent={data => {
              const { functionName, path, repository } = JSON.parse(data) || {}
              return (
                <>
                  <div>
                    <b>Name</b>: <span>{functionName}</span>
                  </div>
                  <div>
                    <b>Path</b>: <span>{path}</span>
                  </div>
                  <div>
                    <b>Repository</b>: <span>{repository}</span>
                  </div>
                </>
              )
            }}
          />
          <BoxLayout gap={1.5}>
            <StackLayout gap={1}>
              <ColumnLayout className={'c-matrix__header'} gap={1}>
                {testKinds.map(testKind => {
                  return <Text key={testKind}>{testKind}</Text>
                })}
              </ColumnLayout>

              {currentSystem.subsystems.map(subsystem => {
                return (
                  <ColumnLayout
                    className={'c-matrix__row'}
                    gap={1}
                    key={subsystem.name}
                  >
                    <Text>{subsystem.name}</Text>

                    {testKinds.map(testKind => {
                      const tests = subsystem.tests.filter(
                        test => test.kind === testKind,
                      )

                      return (
                        <MatrixMap
                          key={testKind}
                          data={tests}
                          onClick={() => null}
                        />
                      )
                    })}
                  </ColumnLayout>
                )
              })}
            </StackLayout>
          </BoxLayout>
        </DetailedView>
      </PageLayout.Section>
    </PageLayout>
  )
}

const DetailedView = styled(CardLayout)`
  .c-matrix__header {
    padding-left: 116px;
  }

  .c-matrix__row {
    > span:first-child {
      display: flex;
      align-items: end;
      width: 100px;
    }
  }
`

export default RepositoryDetails
