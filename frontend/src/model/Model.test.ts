import { Model } from "./Model";

describe("Model", () => {
  const model = new Model();
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

  describe("getAllSystems", () => {
    it("returns all expected systems", () => {
      const systems = model.getAllSystems();

      const systemNames = systems.map((s) => s.name);
      expect(systemNames.sort()).toEqual(expectedSystemNames.sort());

      for (const sys of systems) {
        expect(sys.testKindStats.percentages.length).toBeGreaterThan(0);
        expect(sys.testStatusStats.percentages.length).toBeGreaterThan(0);
      }
    });
  });

  describe("findSystemByName", () => {
    it("works for all system names", () => {
      for (const systemName of expectedSystemNames) {
        const sys = model.findSystemByName(systemName);
        expect(sys.name).toBe(systemName);
        expect(sys.testKindStats.percentages.length).toBeGreaterThan(0);
        expect(sys.testStatusStats.percentages.length).toBeGreaterThan(0);
      }
    });
  });
});

export {};
