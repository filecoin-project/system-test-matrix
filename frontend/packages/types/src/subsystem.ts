import _ from 'lodash'
import { Test } from './test'
import { Feature } from './feature'
import { Behavior } from './behavior'
import { System } from './system'

// Subsystem is a child of a System - second level (architectural) denomination of a software project

export class SubSystem extends System {
  constructor(
    public system: string,
    public features: Feature[],
    public tests: Test[] = [],

    ...p: ConstructorParameters<typeof System>
  ) {
    super(...p)
  }

  public get id(): string {
    return `${this.system}/${this.name}`
  }

  public get behaviors(): Behavior[] {
    return _.flatten(this.features.map(f => f.behaviors))
  }
}
