import { Behavior, Feature } from "./Behavior";
import {
  SubSystem,
  System,
  TestKindStatistic,
  TestStatusStatistic,
} from "./System";
import { Test } from "./Test";
import behaviors from "./data/production/behaviors.json";
import tests from "./data/test/tests.json";
import _ from "lodash";
import { PercentageSet, TestStatus } from "./shared";

// Abstract Model interface.
// I recommend importing this instead of the implementation, because the implementation may change
export interface IModel {
  getAllSystems(): System[];
  findSystemByName(name: string): System | undefined;
  getAllTests(): Test[];
  getAllBehaviors(): Behavior[];
}

export class Model implements IModel {
  // public static New(): Model {
  //   return this.singleton ? this.singleton : Model.loadDenormalized();
  // }

  private static singleton?: Model;
  private systemCache = new Map<string, System>();
  private subsystemCache = new Map<string, SubSystem>();
  private behaviorCache = new Map<string, Behavior>();
  private testCache = new Map<string, Test>();
  private featureCache = new Map<string, Feature>();
  private testKinds = new Set<string>();

  getAllSystems(): System[] {
    return Array.from(this.systemCache.values());
  }
  findSystemByName(name: string): System | undefined {
    return this.systemCache.get(name);
  }

  getAllTests(): Test[] {
    return Array.from(this.testCache.values());
  }
  getAllBehaviors(): Behavior[] {
    throw Array.from(this.behaviorCache.values());
  }

  // basically I have to work from the bottom up, first create a big cache of behaviors & tests, and then reduce them into subsystems and systems
  // so dude you gotta unwrap the tests and behaviors in the constructor
  public constructor() {
    // cache the behaviors
    for (const systemName in behaviors.systems) {
      const systemDetails = (behaviors.systems as any)[systemName];

      const subsystems: SubSystem[] = [];
      for (const subsystemName in systemDetails.subsystems) {
        const subsystemDetails = systemDetails.subsystems[subsystemName];

        const subsystemFeatures: Feature[] = [];
        for (const rawFeature of subsystemDetails.features) {
          const featureBehaviors: Behavior[] = [];
          for (const rawBehavior of rawFeature.behaviors) {
            const behavior = new Behavior(
              rawBehavior.id,
              rawFeature.name,
              rawBehavior.description
            );
            this.behaviorCache.set(behavior.id, behavior);
            featureBehaviors.push(behavior);
          }
          const feature = new Feature(
            rawFeature.name,
            subsystemName,
            featureBehaviors
          );
          this.featureCache.set(feature.name, feature);
          subsystemFeatures.push(feature);
        }

        const subsystem = new SubSystem(
          systemName,
          subsystemFeatures,
          [],
          subsystemName,
          new PercentageSet([]),
          new PercentageSet([]),
          0,
          []
        );
        this.subsystemCache.set(subsystem.name, subsystem);
        subsystems.push(subsystem);
      }

      const system = new System(
        systemName,
        new PercentageSet([]),
        new PercentageSet([]),
        0,
        subsystems
      );
      this.systemCache.set(system.name, system);
    }

    // cache & link tests to behaviors
    for (const rawTestFile of tests.filter((t) => t.scenarios)) {
      for (const rawScenario of rawTestFile.scenarios!) {
        const testBehaviors: Behavior[] = [];
        for (const rawBehavior of rawScenario.Behaviors) {
          const behavior = this.behaviorCache.get(rawBehavior.behavior);
          if (behavior) {
            behavior.tested = true;
            testBehaviors.push(behavior);
          } else {
            throw new Error(
              `Unknown behavior ${rawBehavior.behavior} for test ${rawTestFile.file}/${rawScenario.function}`
            );
          }
        }
        const test = new Test(
          `${rawTestFile.file}/${rawScenario.function}`,
          rawTestFile.file,
          rawScenario.function,
          rawTestFile.repository,
          rawTestFile.test_type,
          TestStatus.pass,
          testBehaviors
        );

        this.testKinds.add(rawTestFile.test_type);
        this.testCache.set(test.id, test);

        // update the subsystems in the cache
        for (const behavior of test.linkedBehaviors) {
          // find the appropriate subsystem
          const parentFeature = this.featureCache.get(
            behavior.parentFeatureName
          );
          if (!parentFeature) {
            throw new Error(
              `Can't find feature: ${behavior.parentFeatureName} in the cache`
            );
          }

          const parentSubsystem = this.subsystemCache.get(
            parentFeature.parentSubsystemName
          );
          if (!parentSubsystem) {
            throw new Error(
              `Can't find subsystem: ${parentFeature.parentSubsystemName} in the cache`
            );
          }

          parentSubsystem.tests.push(test);
        }
      }
    }

    // for each subsystem that "owns" a missing behavior, number of missing tests is NUM_MISSING*NUM_TEST_TYPES

    for (const subsystem of Array.from(this.subsystemCache.values())) {
      const testsByKind = _.groupBy(subsystem.tests, "kind");
      const kindStatistics = Object.entries(testsByKind).map(
        ([kind, tests]) =>
          new TestKindStatistic(
            kind,
            (tests.length / subsystem.tests.length) * 100
          )
      );
      subsystem.testKindStats = new PercentageSet(kindStatistics);

      // figure out missing tests for this system
      const untestedBehaviors = _.flatten(
        subsystem.features.map((f) => f.behaviors)
      ).filter((b) => !b.tested);

      for (const untestedBehavior of untestedBehaviors) {
        for (const testKind of Array.from(this.testKinds.values())) {
          subsystem.tests.push(
            new Test(
              "missing",
              "missing",
              "missing",
              "missing",
              testKind,
              TestStatus.missing,
              [untestedBehavior]
            )
          );
        }
      }

      // now calculate the testStatus statistics
      const testsByStatus = _.groupBy(subsystem.tests, "status");
      const statusStatistics = Object.entries(testsByStatus).map(
        ([status, tests]) =>
          new TestStatusStatistic(
            status as TestStatus,
            (tests.length / subsystem.tests.length) * 100
          )
      );
      subsystem.testStatusStats = new PercentageSet(statusStatistics);
    }

    for (const system of Array.from(this.systemCache.values())) {
      const allSystemTests = _.flatten(system.subsystems.map((ss) => ss.tests));
      const testsByKind = _.groupBy(allSystemTests, "kind");
      const kindStatistics = Object.entries(testsByKind).map(
        ([kind, tests]) =>
          new TestKindStatistic(
            kind,
            (tests.length / allSystemTests.length) * 100
          )
      );
      system.testKindStats = new PercentageSet(kindStatistics);

      const testsByStatus = _.groupBy(allSystemTests, "status");
      const statusStatistics = Object.entries(testsByStatus).map(
        ([status, tests]) =>
          new TestStatusStatistic(
            status as TestStatus,
            (tests.length / allSystemTests.length) * 100
          )
      );
      system.testStatusStats = new PercentageSet(statusStatistics);
    }
  }

  private findTestsRelatedToBehaviors(behaviorIds: Set<string>) {
    return tests.filter((t) =>
      t.scenarios?.find((sc) =>
        sc.Behaviors.find((b) => behaviorIds.has(b.behavior))
      )
    );
  }
}
