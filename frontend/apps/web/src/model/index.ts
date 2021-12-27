import { Behavior, System, Test, TestKind } from '@filecoin/types'

import { DenormalizedLoader } from './DenormalizedLoader'

// Abstract Model interface.
// I recommend importing this instead of the implementation, because the implementation may change
export interface Model {
  getAllSystems(): System[]
  findSystemByName(name: string): System | undefined
  getAllTests(): Test[]
  getAllBehaviors(): Behavior[]
}

export class Model implements Model {
  private static singleton?: Model
  public static New(loader = new DenormalizedLoader()): Model {
    if (!this.singleton) {
      const { systems, behaviors, tests, testKinds } = loader.load()
      this.singleton = new Model(systems, behaviors, tests, testKinds)
    }
    return this.singleton
  }

  private constructor(
    private systemCache = new Map<string, System>(),
    private behaviorCache = new Map<string, Behavior>(),
    private testCache = new Map<string, Test>(),
    private testKinds = new Set<string>(),
  ) {}

  getAllSystems(): System[] {
    const systems = Array.from(this.systemCache.values())
    return systems
  }
  findSystemByName(name: string): System | undefined {
    return this.systemCache.get(name)
  }

  // getAllTests returns all tests from the database,
  // sorted lexicographically by file name
  getAllTests(): Test[] {
    return Array.from(this.testCache.values()).sort((a, b) =>
      a.path.localeCompare(b.path),
    )
  }

  // getAllBehaviors returns all behaviors from the database,
  // sorted lexicographically by ID
  getAllBehaviors(): Behavior[] {
    return Array.from(this.behaviorCache.values()).sort((a, b) =>
      a.id.localeCompare(b.id),
    )
  }

  getAllTestKinds(): TestKind[] {
    return Array.from(this.testKinds)
  }
}
