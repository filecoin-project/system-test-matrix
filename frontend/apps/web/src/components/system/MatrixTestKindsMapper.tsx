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
import { partition } from 'lodash'
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
        // figure out which behaviors are tested for the current test kind
        const [testedForKind, untestedForKind] = partition(
          subsystem.behaviors,
          b => b.tests.find(t => t.kind === testKind),
        )

        // behaviors tested for current kind should have status == pass
        const testedBehaviorData = testedForKind.map(b => ({
          ...b,
          statusForKind: BehaviorStatus.pass,
        }))

        // other behaviors have status == untested, except for behaviors in the "unknown" column
        // it doesn't make sense to tell the user that he should write an "unknown" test
        const untestedBehaviorData =
          testKind !== 'unknown'
            ? untestedForKind.map(b => ({
                ...b,
                statusForKind: BehaviorStatus.untested,
              }))
            : []

        // sort the behaviors lexicographically, so it's easier to find a specific behavior in the matrix cell
        const behaviorData = testedBehaviorData
          .concat(untestedBehaviorData)
          .sort((a, b) => a.id.localeCompare(b.id))

        return (
          <MatrixMap
            key={testKind}
            data={behaviorData}
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
