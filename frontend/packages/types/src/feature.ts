import { Behavior } from './behavior'

export class Feature {
  constructor(
    public name: string,
    public subsystem: string,
    public behaviors: Behavior[],
    public system: string,
  ) {}

  public get id(): string {
    return `${this.subsystem}/${this.name}`
  }
}
