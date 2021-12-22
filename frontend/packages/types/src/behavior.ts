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
