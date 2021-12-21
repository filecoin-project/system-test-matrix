import {
  Behavior,
  Feature,
  PercentageSet,
  SubSystem,
  System,
  SystemScore,
  Test,
  TestKind,
  TestKindStatistic,
  TestStatus,
  TestStatusStatistic,
} from '@filecoin/types'
import _ from 'lodash'

import { pascalCase } from 'change-case'

import behaviors from '@/behaviors.json'
import testCrawlerOutput from '@/tests.json'

export const DEFAULT_TEST_KINDS = ['unit', 'integration', 'e2e', 'unknown']

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
    const testKinds = new Set<string>(DEFAULT_TEST_KINDS)

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

    return new Model(systemCache, behaviorCache, testCache, testKinds)
  }

  private static singleton?: Model

  private constructor(
    private systemCache = new Map<string, System>(),
    private behaviorCache = new Map<string, Behavior>(),
    private testCache = new Map<string, Test>(),
    private testKinds = new Set<string>(),
  ) {}

  private static calculateSummaryStatistics(
    subsystemCache: Map<string, SubSystem>,
    testKinds: Set<string>,
    systemCache: Map<string, System>,
  ) {
    for (const subsystem of Array.from(subsystemCache.values())) {
      // figure out missing tests for this system
      const untestedBehaviors = _.flatten(
        subsystem.features.map(f => f.behaviors),
      ).filter(b => !b.tested)

      for (const untestedBehavior of untestedBehaviors) {
        for (const testKind of Array.from(testKinds.values()).filter(
          t => t !== 'unknown',
        )) {
          subsystem.tests.push(
            new Test(
              `${subsystem.name.replace(
                / /g,
                '_',
              )}_${testKind}_test.go/Test${pascalCase(untestedBehavior.id)}`,
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

      const testsByKind = _.groupBy(subsystem.tests, 'kind') as {
        [key: string]: Test[]
      }
      const kindStatistics = Object.entries(testsByKind).map(
        ([kind, tests]) =>
          new TestKindStatistic(
            kind,
            (tests.length / subsystem.tests.length) * 100,
            tests.length,
          ),
      )
      subsystem.testKindStats = new PercentageSet(kindStatistics)

      // now calculate the testStatus statistics
      const testsByStatus = _.groupBy(subsystem.tests, 'status') as {
        [key: string]: Test[]
      }
      const statusStatistics = Object.entries(testsByStatus).map(
        ([status, tests]) =>
          new TestStatusStatistic(
            status as TestStatus,
            (tests.length / subsystem.tests.length) * 100,
            tests.length,
          ),
      )
      subsystem.testStatusStats = new PercentageSet(statusStatistics)

      // TODO: Apply failing tests to the score calculation
      const stats = subsystem.testStatusStats
        .percentages as TestStatusStatistic[]
      const missing = stats.find(s => s.status === 'missing')
      if (missing && missing.percentage > 66) {
        subsystem.score = SystemScore.bad
      } else if (missing && missing.percentage > 33) {
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
            tests.length,
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
            tests.length,
          ),
      )
      system.testStatusStats = new PercentageSet(statusStatistics)
      const missing = system.testStatusStats.percentages.find(
        p => p.status === 'missing',
      )

      if (missing && missing.percentage > 66) {
        system.score = SystemScore.bad
      } else if (missing && missing.percentage > 33) {
        system.score = SystemScore.mediocre
      } else {
        system.score = SystemScore.good
      }
    }
  }

  private static loadAndLinkTests(
    behaviorCache: Map<string, Behavior>,
    testKinds: Set<string>,
    testCache: Map<string, Test>,
    featureCache: Map<string, Feature>,
    subsystemCache: Map<string, SubSystem>,
  ) {
    for (const testFile of testCrawlerOutput) {
      if (!testFile.scenarios || testFile.scenarios.length === 0) {
        Model.handleUnparsedTest(testFile, testCache, testKinds)
      } else {
        if (!testFile.test_type) {
          testFile.test_type = 'unknown'
        }

        for (const rawScenario of testFile.scenarios) {
          const testBehaviors: Behavior[] = []

          if (rawScenario.Behaviors) {
            for (const rawBehavior of rawScenario.Behaviors) {
              const behavior = behaviorCache.get(rawBehavior.behavior)
              if (behavior) {
                behavior.tested = true
                testBehaviors.push(behavior)
              } else {
                throw new Error(
                  `Unknown behavior ${rawBehavior.behavior} for test ${testFile.file}/${rawScenario.function}`,
                )
              }
            }
          }
          const test = new Test(
            `${testFile.file}/${rawScenario.function}`,
            testFile.file,
            rawScenario.function,
            testFile.repository,
            testFile.test_type,
            testBehaviors.length > 0 ? TestStatus.pass : TestStatus.unannotated,
            testBehaviors,
          )

          if (testFile.test_type) {
            testKinds.add(testFile.test_type)
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

            if (!parentSubsystem.tests.find(t => t.id === test.id)) {
              parentSubsystem.tests.push(test)
            }
          }
        }
      }
    }
  }

  private static handleUnparsedTest(
    testFile: {
      file: string
      path: string
      repository: string
      parent_folder: string
      package: string
      test_type: string
      ignore: boolean
      scenarios: {
        function: string
        Behaviors: { behavior_id: string; behavior: string; ignore: boolean }[]
      }[]
    },
    testCache: Map<string, Test>,
    testKinds: Set<string>,
  ) {
    const test = new Test(
      `${testFile.file}/${testCache.size}`,
      testFile.file,
      '',
      testFile.repository,
      testFile.test_type.length > 0 ? testFile.test_type : 'unknown',
      TestStatus.unparsed,
      [],
    )

    if (testFile.test_type) {
      testKinds.add(testFile.test_type)
    }
    testCache.set(test.id, test)
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
              subsystemName,
              systemName,
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

  // getAllTests returns all tests from the database,
  // sorted lexicographically by file name
  getAllTests(): Test[] {
    return Array.from(this.testCache.values()).sort((a, b) =>
      a.path.localeCompare(b.path),
    )
  }

  // getAllBehaviors returns all behaviors from the database,
  // sorted lexicographically by ID
  getAllBehaviors(): Behavior[] {
    return Array.from(this.behaviorCache.values()).sort((a, b) =>
      a.id.localeCompare(b.id),
    )
  }

  getAllTestKinds(): TestKind[] {
    return Array.from(this.testKinds)
  }
}
