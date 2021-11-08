import { Behavior } from "./Behavior";
import { PercentageSet, System, TestKindStatistic } from "./System";
import { Test } from "./Test";
import behaviors from "./data/production/behaviors.json";
import tests from "./data/test/tests.json";
import _ from "lodash";

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
        // first find all behaviors for this system
        const systemBehaviors: any[] = _.flattenDeep(
          Object.entries(systemDetails.subsystems).map(
            ([_, subsystemDetails]) =>
              subsystemDetails.features.map((f) => f.behaviors)
          )
        );

        // we need a set of IDs
        const behaviorIds = new Set(systemBehaviors.map((sb) => sb.id));

        // now find every test that references behaviors from this system
        const relatedTests = tests.filter((t) =>
          t.scenarios?.find((sc) =>
            sc.Behaviors.find((b) => behaviorIds.has(b.behavior))
          )
        );

        // now group them by kind
        const testsByKind = _.groupBy(relatedTests, "test_type");
        const kindStatistics = Object.entries(testsByKind).map(
          ([kind, tests]) =>
            new TestKindStatistic(
              kind,
              (tests.length / relatedTests.length) * 100
            )
        );

        // end
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
