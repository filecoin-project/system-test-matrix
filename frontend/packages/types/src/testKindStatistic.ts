import { TestKind } from './shared'

// TestKindStatistic says what <percentage> (0-100) of the tests fall under the category <kind>
// Example: kind=unit, percentage=36

export class TestKindStatistic {
  constructor(
    public kind: TestKind,
    public percentage: number,
    public numberOfTests: number,
  ) {}
}
