import { Test } from '.'

export enum BehaviorStatus {
  pass = 'pass',
  fail = 'fail',
  untested = 'untested',
}

export class Behavior {
  constructor(
    public id: string,
    public feature: string,
    public description: string,
    public subsystem: string,
    public system: string,
    public tested = false,
    public tests: BehaviorTest[] = [],
  ) {}

  public get status(): BehaviorStatus {
    if (this.tests.length > 0) {
      return BehaviorStatus.pass
    }
    return BehaviorStatus.untested
  }

  public statusByKind(testKind: string): BehaviorStatus {
    return this.tests.find(t => t.kind === testKind)
      ? BehaviorStatus.pass
      : BehaviorStatus.untested
  }
}

type BehaviorTest = Pick<
  Test,
  'id' | 'path' | 'functionName' | 'repository' | 'kind' | 'status'
>
