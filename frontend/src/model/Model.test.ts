import { Model } from "./Model";

describe("Model", () => {
  const model = Model.New();

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
        expect(sys.cached).toBe(false);
      }
    });
  });

  describe("findSystemByName", () => {
    it("works for all system names", () => {
      for (const systemName of expectedSystemNames) {
        const sys = model.findSystemByName(systemName);
        expect(sys).toBeDefined();
        expect(sys!.name).toBe(systemName);
        expect(sys!.testKindStats.percentages.length).toBeGreaterThan(0);
        expect(sys!.testStatusStats.percentages.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getAllTests", () => {
    // I dunno the exact number of tests, but this ballpark estimate is ok
    const expectedNumTests = 500;

    it("returns the expected number of tests", () => {
      const allTests = model.getAllTests();
      expect(allTests.length).toBeGreaterThanOrEqual(expectedNumTests);
    });
  });

  describe("getAllTestKinds", () => {
    it("returns all expected test kinds", () => {
      const testKinds = model.getAllTestKinds();
      expect(testKinds.length).toBeGreaterThan(0);
    });
  });

  describe("getAllBehaviors", () => {
    const expectedBehaviorsMin = 300;
    it("returns all behaviors", () => {
      const allBehaviors = model.getAllBehaviors();
      expect(allBehaviors.length).toBeGreaterThanOrEqual(expectedBehaviorsMin);
    });
  });
});

export {};
