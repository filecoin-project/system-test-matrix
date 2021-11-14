export class Behavior {
  constructor(
    public id: string,
    public parentFeatureName: string,
    public description: string,
    public tested = false,
  ) {}
}

export class Feature {
  constructor(
    public name: string,
    public parentSubsystemName: string,
    public behaviors: Behavior[],
  ) {}
}

// type Feature = string;
