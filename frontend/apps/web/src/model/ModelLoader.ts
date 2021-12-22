import { Behavior, System, Test } from '@filecoin/types'

export interface ModelLoader {
  load: () => {
    systems: Map<string, System>
    behaviors: Map<string, Behavior>
    tests: Map<string, Test>
    testKinds: Set<string>
  }
}
