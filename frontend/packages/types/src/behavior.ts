import { Test, TestKind, TestStatus } from './test'

export enum BehaviorStatus {
  tested = 'tested',
  partiallyTested = 'partiallyTested',
  untested = 'untested',
}

export class Behavior {
  constructor(
    public id: string,
    public feature: string,
    public description: string,
    public subsystem: string,
    public system: string,
    public testedBy: BehaviorTest[] = [],
    public expectedTestKinds: TestKind[] = ['unit', 'integration'],
  ) {}
  public get status(): BehaviorStatus {
    const statusesByKind = this.expectedTestKinds.map(tk =>
      this.statusByKind(tk),
    )
    // it's tested if it has passing tests for all expected test kinds
    if (statusesByKind.every(sbk => sbk === BehaviorStatus.tested)) {
      return BehaviorStatus.tested
    }
    // it's partial if it misses some
    if (statusesByKind.some(sbk => sbk === BehaviorStatus.tested)) {
      return BehaviorStatus.partiallyTested
    }
    // it's untested if it doesn't have tests for any expected test kind
    return BehaviorStatus.untested
  }

  public statusByKind(testKind: string): BehaviorStatus {
    return this.testedBy.find(
      t => t.kind === testKind && t.status === TestStatus.pass,
    )
      ? BehaviorStatus.tested
      : BehaviorStatus.untested
  }
}

type BehaviorTest = Pick<
  Test,
  'id' | 'path' | 'functionName' | 'repository' | 'kind' | 'status'
>
