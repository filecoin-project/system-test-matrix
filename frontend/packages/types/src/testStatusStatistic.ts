import _ from 'lodash'
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

export function calculateTestStatusStatistics(tests: Test[]) {
  const testsByStatus = _.groupBy(tests, 'status') as {
    [key: string]: Test[]
  }
  const statusStatistics = Object.entries(testsByStatus).map(
    ([status, testsWithStatus]) =>
      new TestStatusStatistic(
        status as TestStatus,
        (testsWithStatus.length / tests.length) * 100,
        testsWithStatus.length,
      ),
  )
  return statusStatistics
}
