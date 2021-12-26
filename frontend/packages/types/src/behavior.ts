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
    public tests: Test[] = [],
  ) {}

  public get status(): BehaviorStatus {
    if (this.tests.length > 0) {
      return BehaviorStatus.pass
    }
    return BehaviorStatus.untested
  }
}
