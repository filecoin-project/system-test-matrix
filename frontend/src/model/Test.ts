import { Behavior } from "./Behavior";
import { Repository, TestKind, TestStatus } from "./types";

export class Test {
  constructor(
    public path: string,
    public functionName: string,
    public repository: Repository,
    public kind: TestKind,
    public status: TestStatus,
    public linkedBehaviors: Behavior[]
  ) {}
}
