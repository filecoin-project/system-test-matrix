import { SubSystem } from "./System";

export class Behavior {
  constructor(
    public id: string,
    public feature: Feature,
    public description: string,
    public parent: SubSystem
  ) {}
}

type Feature = string;
