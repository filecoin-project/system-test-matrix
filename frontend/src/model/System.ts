import { Test } from "./Test";
import { PercentageSet, TestKind, TestStatus } from "./shared";

// System is a top-level (architectural) denomination of a software project.
export class System {
  constructor(
    public name: string,
    public testKindStats: PercentageSet,
    public testStatusStats: PercentageSet,
    public score: number,
    public subsystems: SubSystem[],
    public tests: Test[]
  ) {}
}

// Subsystem is a child of a System - second level (architectural) denomination of a software project
export class SubSystem extends System {
  constructor(
    public parent: System,
    ...p: ConstructorParameters<typeof System>
  ) {
    super(...p);
  }
}

// TestKindStatistic says what <percentage> (0-100) of the tests fall under the category <kind>
// Example: kind=unit, percentage=36
export class TestKindStatistic {
  constructor(public kind: TestKind, public percentage: number) {}
}

// TestStatusStatistic says what <percentage> (0-100) of the tests are in a specific <status>
// Example: status=fail, percentage=5
export class TestStatusStatistic {
  constructor(public status: TestStatus, public percentage: number) {}
}
