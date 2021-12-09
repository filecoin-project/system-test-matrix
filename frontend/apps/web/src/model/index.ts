import _ from 'lodash'
import {
  Behavior,
  Feature,
  PercentageSet,
  TestKind,
  TestStatus,
  Test,
  SubSystem,
  System,
  SystemScore,
  TestKindStatistic,
  TestStatusStatistic,
} from '@filecoin/types'

import behaviors from '@/behaviors.json'
import tests from '@/tests.json'

// Abstract Model interface.
// I recommend importing this instead of the implementation, because the implementation may change
export interface Model {
  getAllSystems(): System[]
  findSystemByName(name: string): System | undefined
  getAllTests(): Test[]
  getAllBehaviors(): Behavior[]
}

export class Model implements Model {
  public static New(): Model {
    if (!this.singleton) {
      this.singleton = Model.loadDenormalized()
    }
    return this.singleton
  }

  private static loadDenormalized(): Model {
    const systemCache = new Map<string, System>()
    const subsystemCache = new Map<string, SubSystem>()
    const behaviorCache = new Map<string, Behavior>()
    const testCache = new Map<string, Test>()
    const featureCache = new Map<string, Feature>()
    const testKinds = new Set<string>([
      'unit',
      'integration',
      'e2e',
      'benchmark',
    ])

    Model.loadBehaviors(
      behaviorCache,
      featureCache,
      subsystemCache,
      systemCache,
    )

    // cache & link tests to behaviors
    Model.loadAndLinkTests(
      behaviorCache,
      testKinds,
      testCache,
      featureCache,
      subsystemCache,
    )

    Model.calculateSummaryStatistics(subsystemCache, testKinds, systemCache)

    return new Model(
      systemCache,
      subsystemCache,
      behaviorCache,
      testCache,
      featureCache,
      testKinds,
    )
  }

  private static singleton?: Model

  private constructor(
    private systemCache = new Map<string, System>(),
    private subsystemCache = new Map<string, SubSystem>(),
    private behaviorCache = new Map<string, Behavior>(),
    private testCache = new Map<string, Test>(),
    private featureCache = new Map<string, Feature>(),
    private testKinds = new Set<string>(),
  ) {}

  private static calculateSummaryStatistics(
    subsystemCache: Map<string, SubSystem>,
    testKinds: Set<string>,
    systemCache: Map<string, System>,
  ) {
    for (const subsystem of Array.from(subsystemCache.values())) {
      const testsByKind = _.groupBy(subsystem.tests, 'kind') as {
        [key: string]: Test[]
      }
      const kindStatistics = Object.entries(testsByKind).map(
        ([kind, tests]) =>
          new TestKindStatistic(
            kind,
            (tests.length / subsystem.tests.length) * 100,
          ),
      )
      subsystem.testKindStats = new PercentageSet(kindStatistics)

      // figure out missing tests for this system
      const untestedBehaviors = _.flatten(
        subsystem.features.map(f => f.behaviors),
      ).filter(b => !b.tested)

      for (const untestedBehavior of untestedBehaviors) {
        for (const testKind of Array.from(testKinds.values())) {
          subsystem.tests.push(
            new Test(
              'missing',
              'missing',
              'missing',
              'missing',
              testKind,
              TestStatus.missing,
              [untestedBehavior],
            ),
          )
        }
      }

      // now calculate the testStatus statistics
      const testsByStatus = _.groupBy(subsystem.tests, 'status') as {
        [key: string]: Test[]
      }
      const statusStatistics = Object.entries(testsByStatus).map(
        ([status, tests]) =>
          new TestStatusStatistic(
            status as TestStatus,
            (tests.length / subsystem.tests.length) * 100,
          ),
      )
      subsystem.testStatusStats = new PercentageSet(statusStatistics)

      // TODO: Apply failing tests to the score calculation
      const stats = subsystem.testStatusStats
        .percentages as TestStatusStatistic[]
      const missing = stats.find(s => s.status === 'missing')
      if (missing && missing.percentage > 50) {
        subsystem.score = SystemScore.bad
      } else if (missing && missing.percentage > 10) {
        subsystem.score = SystemScore.mediocre
      } else {
        subsystem.score = SystemScore.good
      }
    }

    for (const system of Array.from(systemCache.values())) {
      const allSystemTests = _.flatten(system.subsystems.map(ss => ss.tests))
      const testsByKind = _.groupBy(allSystemTests, 'kind') as {
        [key: string]: Test[]
      }
      const kindStatistics = Object.entries(testsByKind).map(
        ([kind, tests]) =>
          new TestKindStatistic(
            kind,
            (tests.length / allSystemTests.length) * 100,
          ),
      )
      system.testKindStats = new PercentageSet(kindStatistics)

      const testsByStatus = _.groupBy(allSystemTests, 'status') as {
        [key: string]: Test[]
      }

      const statusStatistics = Object.entries(testsByStatus).map(
        ([status, tests]) =>
          new TestStatusStatistic(
            status as TestStatus,
            (tests.length / allSystemTests.length) * 100,
          ),
      )
      system.testStatusStats = new PercentageSet(statusStatistics)
    }
  }

  private static loadAndLinkTests(
    behaviorCache: Map<string, Behavior>,
    testKinds: Set<string>,
    testCache: Map<string, Test>,
    featureCache: Map<string, Feature>,
    subsystemCache: Map<string, SubSystem>,
  ) {
    for (const rawTestFile of tests.filter(t => t.scenarios)) {
      for (const rawScenario of rawTestFile.scenarios) {
        const testBehaviors: Behavior[] = []

        if (rawScenario.Behaviors) {
          for (const rawBehavior of rawScenario.Behaviors) {
            const behavior = behaviorCache.get(rawBehavior.behavior)
            if (behavior) {
              behavior.tested = true
              testBehaviors.push(behavior)
            } else {
              throw new Error(
                `Unknown behavior ${rawBehavior.behavior} for test ${rawTestFile.file}/${rawScenario.function}`,
              )
            }
          }
        }
        const test = new Test(
          `${rawTestFile.file}/${rawScenario.function}`,
          rawTestFile.file,
          rawScenario.function,
          rawTestFile.repository,
          rawTestFile.test_type,
          TestStatus.pass,
          testBehaviors,
        )

        if (rawTestFile.test_type) {
          testKinds.add(rawTestFile.test_type)
        }
        testCache.set(test.id, test)

        // update the subsystems in the cache
        for (const behavior of test.linkedBehaviors) {
          // find the appropriate subsystem
          const parentFeature = featureCache.get(behavior.parentFeatureName)
          if (!parentFeature) {
            throw new Error(
              `Can't find feature: ${behavior.parentFeatureName} in the cache`,
            )
          }

          const parentSubsystem = subsystemCache.get(
            `${parentFeature.systemName}/${parentFeature.parentSubsystemName}`,
          )

          if (!parentSubsystem) {
            throw new Error(
              `Can't find subsystem: ${parentFeature.parentSubsystemName} in the cache`,
            )
          }

          parentSubsystem.tests.push(test)
        }
      }
    }
  }

  private static subsystemKey(subsystem: SubSystem): string {
    return `${subsystem?.parentSystemName}/${subsystem?.name}`
  }

  private static loadBehaviors(
    behaviorCache: Map<string, Behavior>,
    featureCache: Map<string, Feature>,
    subsystemCache: Map<string, SubSystem>,
    systemCache: Map<string, System>,
  ) {
    for (const systemName in behaviors.systems) {
      const systemDetails = (behaviors.systems as any)[systemName]
      const subsystems: SubSystem[] = []
      for (const subsystemName in systemDetails.subsystems) {
        const subsystemDetails = systemDetails.subsystems[subsystemName]
        const subsystemFeatures: Feature[] = []
        for (const rawFeature of subsystemDetails.features) {
          const featureBehaviors: Behavior[] = []
          for (const rawBehavior of rawFeature.behaviors) {
            const behavior = new Behavior(
              rawBehavior.id,
              rawFeature.name,
              rawBehavior.description,
            )
            behaviorCache.set(behavior.id, behavior)
            featureBehaviors.push(behavior)
          }
          const feature = new Feature(
            rawFeature.name,
            subsystemName,
            featureBehaviors,
            systemName,
          )
          featureCache.set(feature.name, feature)
          subsystemFeatures.push(feature)
        }
        const subsystem = new SubSystem(
          systemName,
          subsystemFeatures,
          [],
          subsystemName,
          new PercentageSet([]),
          new PercentageSet([]),
          SystemScore.bad,
          [],
        )
        subsystemCache.set(Model.subsystemKey(subsystem), subsystem)
        subsystems.push(subsystem)
      }
      const system = new System(
        systemName,
        new PercentageSet([]),
        new PercentageSet([]),
        SystemScore.bad,
        subsystems,
      )
      systemCache.set(system.name, system)
    }
  }

  getAllSystems(): System[] {
    const systems = Array.from(this.systemCache.values())
    return systems
  }
  findSystemByName(name: string): System | undefined {
    return this.systemCache.get(name)
  }

  getAllTests(): Test[] {
    return Array.from(this.testCache.values())
  }
  getAllBehaviors(): Behavior[] {
    return Array.from(this.behaviorCache.values())
  }

  getAllTestKinds(): TestKind[] {
    return Array.from(this.testKinds)
  }
}
