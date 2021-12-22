import _ from 'lodash'
import { TestKind, Test } from '.'

// TestKindStatistic says what <percentage> (0-100) of the tests fall under the category <kind>
// Example: kind=unit, percentage=36
export class TestKindStatistic {
  constructor(
    public kind: TestKind,
    public percentage: number,
    public numberOfTests: number,
  ) {}
}

export function calculateTestKindStatistics(tests: Test[]) {
  const testsByKind = _.groupBy(tests, 'kind') as {
    [key: string]: Test[]
  }
  const kindStatistics = Object.entries(testsByKind).map(
    ([kind, testsWithKind]) =>
      new TestKindStatistic(
        kind,
        (testsWithKind.length / tests.length) * 100,
        testsWithKind.length,
      ),
  )
  return kindStatistics
}
