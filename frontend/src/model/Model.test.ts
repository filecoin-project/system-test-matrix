import { Model } from "./Model";

describe("Model", () => {
  const model = new Model();
  describe("getAllSystems", () => {
    it("returns all expected systems", () => {
      const expectedSystemNames = [
        "Blockchain",
        "API",
        "Client",
        "Repository",
        "Virtual Machine",
        "Miner",
        "Token",
        "Network",
        "Market",
      ];
      const systems = model.getAllSystems();

      const systemNames = systems.map((s) => s.name);
      expect(systemNames.sort()).toEqual(expectedSystemNames.sort());

      for (const sys of systems) {
        expect(sys.testKindStats.percentages.length).toBeGreaterThan(0);
      }
    });
  });
});

export {};
