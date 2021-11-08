import { Behavior } from "./Behavior";
import { System, TestKindStatistic, TestStatusStatistic } from "./System";
import { Test } from "./Test";
import behaviors from "./data/production/behaviors.json";
import tests from "./data/test/tests.json";
import _ from "lodash";
import { PercentageSet, TestStatus } from "./shared";

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
        return this.renderSystem(systemName, systemDetails);
      }
    );
  }
  findSystemByName(name: string): System {
    const system = (behaviors.systems as any)[name];
    return this.renderSystem(name, system);
  }

  getAllTests(): Test[] {
    throw new Error("Not implemented yet");
  }
  getAllBehaviors(): Behavior[] {
    throw new Error("Not implemented yet");
  }

  private renderSystem(systemName: string, systemDetails: any): System {
    // First find all behaviors for this system.
    // Since the input format is nested, we have to do some "flattening" (unwrapping)
    const systemBehaviors: any[] = _.flattenDeep(
      Object.entries(systemDetails.subsystems).map(([_, subsystemDetails]) =>
        (subsystemDetails as any).features.map((f: any) => f.behaviors)
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
        new TestKindStatistic(kind, (tests.length / relatedTests.length) * 100)
    );

    // TODO: Get information about failing tests
    const referencedBehaviors = new Set(
      _.uniq(
        _.flattenDeep(
          tests.map((t) =>
            t.scenarios?.map((s) => s.Behaviors.map((b) => b.behavior))
          )
        )
      )
    );

    // now find a difference between the sets of behaviors
    const missingTests = Array.from(behaviorIds).filter(
      (b) => !referencedBehaviors.has(b)
    );

    const numMissingTests = missingTests.length * kindStatistics.length;

    const totalTests = relatedTests.length + numMissingTests;

    const statusStats = new PercentageSet([
      new TestStatusStatistic(
        TestStatus.pass,
        (relatedTests.length / totalTests) * 100
      ),
      new TestStatusStatistic(
        TestStatus.missing,
        (numMissingTests / totalTests) * 100
      ),
    ]);

    return new System(
      systemName,
      new PercentageSet(kindStatistics),
      statusStats,
      0,
      []
    );
  }
}
