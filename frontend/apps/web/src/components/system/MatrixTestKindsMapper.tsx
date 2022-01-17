import { PageContainer } from '@/containers/PageContainer'
import {
  Behavior,
  BehaviorStatus,
  SubSystem,
  System,
  TestKind,
  TestQueryParams,
} from '@filecoin/types'
import { MatrixMap } from '@filecoin/ui'
import qs from 'query-string'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

interface Props {
  testKinds: TestKind[]
  system: System
  setTestBehavior: any
  subsystem: SubSystem
}
const MatrixTestKindsMapper: React.FC<Props> = ({
  testKinds,
  system,
  subsystem,
  setTestBehavior,
}) => {
  const navigate = useNavigate()
  const {
    state: { model },
  } = PageContainer.useContainer()

  const allBehaviors = model.getAllBehaviors()

  const {
    id: testId,
    behaviorId,
    ...queryParams
  }: TestQueryParams = qs.parse(location.search)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [testKinds])

  return (
    <>
      {testKinds.map(testKind => {
        const behaviors = subsystem.behaviors
          .filter(behavior => behavior.expectedTestKinds.includes(testKind))
          .map(b => ({
            ...b,
            statusForKind: b.testedBy.filter(
              test => test.kind === testKind && test.status !== 'missing',
            ).length
              ? ('tested' as BehaviorStatus)
              : ('untested' as BehaviorStatus),
          }))
          .sort((a, b) => a.id.localeCompare(b.id))

        return (
          <MatrixMap
            key={testKind}
            data={behaviors}
            onClick={(b: Behavior) => {
              const behavior = allBehaviors.find(
                behavior => behavior.id === b.id,
              )

              if (behavior) {
                setTestBehavior(
                  allBehaviors.find(behavior => behavior.id === b.id),
                )

                navigate(
                  {
                    search: `?${qs.stringify({
                      ...queryParams,
                      behaviorId: behavior.id,
                    })}`,
                  },
                  { replace: true },
                )
              }
            }}
          />
        )
      })}
    </>
  )
}

export default MatrixTestKindsMapper
