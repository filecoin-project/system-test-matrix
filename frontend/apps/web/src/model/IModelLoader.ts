import { Behavior, Feature, SubSystem, System, Test } from '@filecoin/types'
import { Model } from '.'

export interface ModelLoader {
  load: () => {
    systems: Map<string, System>
    subsystems: Map<string, SubSystem>
    behaviors: Map<string, Behavior>
    tests: Map<string, Test>
    features: Map<string, Feature>
    testKinds: Set<string>
  }
}
