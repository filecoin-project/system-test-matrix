import { Test } from "./Test";
import { TestKind, TestStatus } from "./types";

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

// PercentageSet makes sure you can't create a set of statistics where the sum of percentages is != 100, with a given rounding error
export class PercentageSet {
  constructor(
    public percentages: Array<TestKindStatistic | TestStatusStatistic>,
    public roundingError = 0.2
  ) {
    const percentageSum = percentages.reduce(
      (sum: number, next) => (sum += next.percentage),
      0
    );
    if (percentageSum > 0 && Math.abs(percentageSum - 100) > roundingError) {
      throw new Error(
        `Percentage sum is ${percentageSum} (!=100+-${roundingError}). Given: ${JSON.stringify(
          percentages
        )}`
      );
    }
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
