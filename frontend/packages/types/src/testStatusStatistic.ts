import _ from 'lodash'
import { Behavior } from '.'

import { Test, TestStatus } from './test'

// TestStatusStatistic says what <percentage> (0-100) of the tests are in a specific <status>
// Example: status=fail, percentage=5
export class TestStatusStatistic {
  constructor(
    public status: TestStatus,
    public percentage: number,
    public numberOfTests: number,
  ) {}
}

export function calculateBehaviorStatistics(behaviors: Behavior[]) {
  const behaviorsByStatus = _.groupBy(behaviors, 'status')

  const statusStatistics = Object.entries(behaviorsByStatus).map(
    ([status, behaviorsWithStatus]) =>
      new TestStatusStatistic(
        status as TestStatus,
        (behaviorsWithStatus.length / behaviors.length) * 100,
        behaviorsWithStatus.length,
      ),
  )
  return statusStatistics
}
