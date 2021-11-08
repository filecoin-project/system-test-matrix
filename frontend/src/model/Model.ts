import { Behavior } from "./Behavior";
import { System, TestKindStatistic } from "./System";
import { Test } from "./Test";
import behaviors from "./data/production/behaviors.json";
import tests from "./data/test/tests.json";
import _ from "lodash";
import { PercentageSet } from "./shared";

// Abstract Model interface.
// I recommend importing this instead of the implementation, because the implementation may change
export interface IModel {
  getAllSystems(): System[];
  findSystemByName(name: string): System;
  getAllTests(): Test[];
  getAllBehaviors(): Behavior[];
}

export class Model implements IModel {
  getAllSystems(): System[] {
    return Object.entries(behaviors.systems).map(
      ([systemName, systemDetails]) => {
        // First find all behaviors for this system.
        // Since the input format is nested, we have to do some "flattening" (unwrapping)
        const systemBehaviors: any[] = _.flattenDeep(
          Object.entries(systemDetails.subsystems).map(
            ([_, subsystemDetails]) =>
              subsystemDetails.features.map((f) => f.behaviors)
          )
        );

        const behaviorIds = new Set(systemBehaviors.map((sb) => sb.id));

        // now find every test that references behaviors from this system
        const relatedTests = tests.filter((t) =>
          t.scenarios?.find((sc) =>
            sc.Behaviors.find((b) => behaviorIds.has(b.behavior))
          )
        );

        const testsByKind = _.groupBy(relatedTests, "test_type");
        const kindStatistics = Object.entries(testsByKind).map(
          ([kind, tests]) =>
            new TestKindStatistic(
              kind,
              (tests.length / relatedTests.length) * 100
            )
        );

        // TODO: Get information about failing tests
        // I can calculate the missing tests for now

        return new System(
          systemName,
          new PercentageSet(kindStatistics),
          new PercentageSet([]),
          0,
          [],
          []
        );
      }
    );
  }
  findSystemByName(name: string): System {
    throw new Error("Not implemented yet");
  }

  getAllTests(): Test[] {
    throw new Error("Not implemented yet");
  }
  getAllBehaviors(): Behavior[] {
    throw new Error("Not implemented yet");
  }
}
