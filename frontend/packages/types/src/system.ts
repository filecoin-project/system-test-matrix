import { PercentageSet } from './shared'
import { SystemScore } from './systemScore'
import { SubSystem } from './subsystem'

// System is a top-level (architectural) denomination of a software project.
export class System {
  constructor(
    public name: string,
    public testStatistics: PercentageSet,
    public behaviorStatistics: PercentageSet,
    public score: SystemScore,
    public subsystems: SubSystem[] = [],
  ) {}

  public get id(): string {
    return this.name
  }
}
