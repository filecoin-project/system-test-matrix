import { Model } from "./Model";

describe("Model", () => {
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
    const model = new Model();
    it("returns all expected systems", () => {
      const systems = model.getAllSystems();

      const systemNames = systems.map((s) => s.name);
      expect(systemNames.sort()).toEqual(expectedSystemNames.sort());

      for (const sys of systems) {
        expect(sys.testKindStats.percentages.length).toBeGreaterThan(0);
        expect(sys.testStatusStats.percentages.length).toBeGreaterThan(0);
        expect(sys.cached).toBe(false);
      }
    });
  });

  describe("findSystemByName", () => {
    const model = new Model();
    it("works for all system names", () => {
      for (const systemName of expectedSystemNames) {
        const sys = model.findSystemByName(systemName);
        expect(sys).toBeDefined();
        expect(sys!.name).toBe(systemName);
        expect(sys!.testKindStats.percentages.length).toBeGreaterThan(0);
        expect(sys!.testStatusStats.percentages.length).toBeGreaterThan(0);
        // expect(sys.cached).toBe(false);
      }
    });
  });

  describe("getAllTests", () => {
    const model = new Model();
    // I dunno the exact number of tests, but this ballpark estimate is ok
    const expectedNumTests = 500;

    it("returns the expected number of tests", () => {
      const allTests = model.getAllTests();
      expect(allTests.length).toBeGreaterThanOrEqual(expectedNumTests);
    });
  });
});

export {};
