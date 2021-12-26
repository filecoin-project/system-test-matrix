import { Behavior } from './behavior'

export enum TestStatus {
  pass = 'pass',
  fail = 'fail',
  missing = 'missing',
  unannotated = 'unannotated',
  unparsed = 'unparsed',
}

export class Test {
  constructor(
    public id: string,
    public path: string,
    public functionName: string,
    public repository: Repository,
    public kind: TestKind,
    public status = TestStatus.unannotated,
    public linkedBehaviors: Behavior[] = [],
  ) {}
}

export type TestKind = string

export type Repository = string
