import { Behavior } from './behavior'

export class Test {
  constructor(
    public id: string,
    public path: string,
    public functionName: string,
    public repository: Repository,
    public kind: TestKind,
    public status: TestStatus,
    public linkedBehaviors: Behavior[],
  ) {}
}

export type TestKind = string

export enum TestStatus {
  pass = 'pass',
  fail = 'fail',
  missing = 'missing',
  unannotated = 'unannotated',
  unparsed = 'unparsed',
}

export type Repository = string
