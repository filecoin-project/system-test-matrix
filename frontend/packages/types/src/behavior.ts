export class Behavior {
  constructor(
    public id: string,
    public feature: string,
    public description: string,
    public subsystem: string,
    public system: string,
    public tested = false,
  ) {}
}
