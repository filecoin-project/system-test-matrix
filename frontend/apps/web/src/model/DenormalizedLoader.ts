import {
  Behavior,
  calculateSystemScore,
  Feature,
  PercentageSet,
  SubSystem,
  System,
  SystemScore,
  Test,
  TestKindStatistic,
  TestStatus,
  TestStatusStatistic,
} from '@filecoin/types'
import { IModelLoader } from './IModelLoader'
import _ from 'lodash'
import { pascalCase } from 'change-case'
import behaviors from '@/behaviors.json'
import testCrawlerOutput from '@/tests.json'

export const DEFAULT_TEST_KINDS = ['unit', 'integration', 'e2e', 'unknown']

export class DenormalizedLoader implements IModelLoader {
  public load() {
    const systems = new Map<string, System>()
    const subsystems = new Map<string, SubSystem>()
    const behaviors = new Map<string, Behavior>()
    const tests = new Map<string, Test>()
    const features = new Map<string, Feature>()
    const testKinds = new Set<string>(DEFAULT_TEST_KINDS)

    this.loadBehaviors(behaviors, features, subsystems, systems)

    this.loadAndLinkTests(behaviors, testKinds, tests, features, subsystems)

    this.calculateSummaryStatistics(subsystems, testKinds, systems)

    return {
      systems,
      subsystems,
      behaviors,
      tests,
      features,
      testKinds,
    }
  }

  private calculateSummaryStatistics(
    subsystemCache: Map<string, SubSystem>,
    testKinds: Set<string>,
    systemCache: Map<string, System>,
  ) {
    for (const subsystem of Array.from(subsystemCache.values())) {
      this.calculateSubsystemStatistics(subsystem, testKinds)
    }

    for (const system of Array.from(systemCache.values())) {
      this.calculateSystemStatistics(system)
    }
  }

  private calculateSystemStatistics(system: System) {
    const allSystemTests = _.flatten(system.subsystems.map(ss => ss.tests))

    system.testKindStats = new PercentageSet(
      this.calculateTestKindStatistics(allSystemTests),
    )

    system.testStatusStats = new PercentageSet(
      this.calculateTestStatusStatistics(allSystemTests),
    )
    system.score = calculateSystemScore(system.testStatusStats)
  }

  private calculateSubsystemStatistics(
    subsystem: SubSystem,
    testKinds: Set<string>,
  ) {
    const untestedBehaviors = _.flatten(
      subsystem.features.map(f => f.behaviors),
    ).filter((b: Behavior) => !b.tested)

    for (const untestedBehavior of untestedBehaviors) {
      this.handleUntestedBehaviors(testKinds, subsystem, untestedBehavior)
    }

    subsystem.testKindStats = new PercentageSet(
      this.calculateTestKindStatistics(subsystem.tests),
    )

    subsystem.testStatusStats = new PercentageSet(
      this.calculateTestStatusStatistics(subsystem.tests),
    )

    subsystem.score = calculateSystemScore(subsystem.testStatusStats)
  }

  private calculateTestStatusStatistics(tests: Test[]) {
    const testsByStatus = _.groupBy(tests, 'status') as {
      [key: string]: Test[]
    }
    const statusStatistics = Object.entries(testsByStatus).map(
      ([status, testsWithStatus]) =>
        new TestStatusStatistic(
          status as TestStatus,
          (testsWithStatus.length / tests.length) * 100,
          testsWithStatus.length,
        ),
    )
    return statusStatistics
  }

  private calculateTestKindStatistics(tests: Test[]) {
    const testsByKind = _.groupBy(tests, 'kind') as {
      [key: string]: Test[]
    }
    const kindStatistics = Object.entries(testsByKind).map(
      ([kind, testsWithKind]) =>
        new TestKindStatistic(
          kind,
          (testsWithKind.length / tests.length) * 100,
          testsWithKind.length,
        ),
    )
    return kindStatistics
  }

  private handleUntestedBehaviors(
    testKinds: Set<string>,
    subsystem: SubSystem,
    untestedBehavior: any,
  ) {
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

  private loadAndLinkTests(
    behaviorCache: Map<string, Behavior>,
    testKinds: Set<string>,
    testCache: Map<string, Test>,
    featureCache: Map<string, Feature>,
    subsystemCache: Map<string, SubSystem>,
  ) {
    for (const testFile of testCrawlerOutput) {
      if (!testFile.test_type) {
        testFile.test_type = 'unknown'
      }

      if (!testFile.scenarios || testFile.scenarios.length === 0) {
        this.handleUnparsedTest(testFile, testCache, testKinds)
      } else {
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

  private handleUnparsedTest(
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

  private subsystemKey(subsystem: SubSystem): string {
    return `${subsystem?.parentSystemName}/${subsystem?.name}`
  }

  private loadBehaviors(
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
        subsystemCache.set(this.subsystemKey(subsystem), subsystem)
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
}
