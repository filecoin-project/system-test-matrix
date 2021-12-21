import { TestStatus } from './shared'

// TestStatusStatistic says what <percentage> (0-100) of the tests are in a specific <status>
// Example: status=fail, percentage=5

export class TestStatusStatistic {
  constructor(
    public status: TestStatus,
    public percentage: number,
    public numberOfTests: number,
  ) {}
}
