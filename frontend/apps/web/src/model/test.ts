import { Behavior } from './behavior'
import { Repository, TestKind, TestStatus } from './shared'

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
