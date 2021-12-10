export class Behavior {
  constructor(
    public id: string,
    public parentFeatureName: string,
    public description: string,
    public subsystemName: string,
    public systemName: string,
    public tested = false,
  ) {}
}

export class Feature {
  constructor(
    public name: string,
    public parentSubsystemName: string,
    public behaviors: Behavior[],
    public systemName: string,
  ) {}
}

// type Feature = string;
