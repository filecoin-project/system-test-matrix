import { Behavior } from './behavior'

export class Feature {
  constructor(
    public name: string,
    public parentSubsystemName: string,
    public behaviors: Behavior[],
    public systemName: string,
  ) {}
}
