import fs from "fs";
import behaviors from "../model/data/production/behaviors.json";
import * as crypto from "crypto";

const IN_PATH = "src/model/data/production/tests.json";
const OUT_PATH = "src/model/data/test/tests.json";

// Probabilities should be ordered and <=1
const TEST_KIND_PROBABILITIES = [
  ["e2e", 0.05],
  ["benchmark", 0.1],
  ["api", 0.2],
  ["integration", 0.4],
  ["unit", 1],
].sort((tup1: any[], tup2: any[]) => tup1[1] - tup2[1]);

// (Up to) How many behaviors should we generate per every test
const MAX_RANDOM_BEHAVIORS_PER_TEST = 5;
// exclude some behaviors, so we end up with some missing tests (to simulate a realistic situation)
const EXCLUDE_BEHAVIORS = 30;

// Generate a random test kind using a probability table
const generateRandomTestKind = (probabilityTable: any) => {
  const rand = Math.random();
  for (const prob of probabilityTable) {
    if (prob[1] >= rand) {
      return prob[0];
    }
  }
};

// Extract behavior IDs from the behaviors.json file
const getAllBehaviors = (): string[] => {
  let allBehaviorIds: string[] = [];
  for (const systemName in behaviors.systems) {
    const system = (behaviors.systems as any)[systemName];

    for (const subsystemName in system.subsystems) {
      const subsystem = (system.subsystems as any)[subsystemName];

      for (const feature of subsystem.features) {
        allBehaviorIds = allBehaviorIds.concat(
          feature.behaviors.map((b: any) => b.id)
        );
      }
    }
  }
  return allBehaviorIds;
};

// Assign a random set of behaviors to every test that is not annotated (for frontend testing purposes)
const enrichWithFakeData = (tests: any[]): any[] => {
  const allBehaviors = getAllBehaviors()
    .sort(() => 0.5 - Math.random())
    .slice(EXCLUDE_BEHAVIORS);

  return tests.map((t) => {
    if (t.test_type === "") {
      t.test_type = generateRandomTestKind(TEST_KIND_PROBABILITIES);
    }

    if (t.scenarios) {
      for (const scenario of t.scenarios) {
        if (!scenario.Behaviors) {
          const numBehaviors = Math.ceil(
            Math.random() * MAX_RANDOM_BEHAVIORS_PER_TEST
          );

          let randomBehaviors = allBehaviors
            .sort(() => 0.5 - Math.random())
            .slice(0, numBehaviors);

          scenario.Behaviors = randomBehaviors.map((behavior: string) => ({
            behavior_id: crypto.randomBytes(20).toString("hex"),
            behavior: behavior,
            ignore: false,
          }));
        }
      }
    }

    return t;
  });
};

const generateFakeAnnotations = (
  inputFilePath: string,
  outFilePath: string
) => {
  const inFileContents = fs.readFileSync(inputFilePath);
  const tests = JSON.parse(inFileContents.toString());
  const enriched = enrichWithFakeData(tests);
  const outputJson = JSON.stringify(enriched, null, 1);
  fs.writeFileSync(outFilePath, outputJson);
};

generateFakeAnnotations(IN_PATH, OUT_PATH);

export {};
