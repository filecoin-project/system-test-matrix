import _ from 'lodash'
import {
  Behavior,
  BehaviorStatus,
  calculateSystemScore,
  calculateTestStatistics,
  calculateBehaviorStatistics,
  Feature,
  PercentageSet,
  SubSystem,
  System,
  SystemScore,
  Test,
  TestStatus,
} from '@filecoin/types'
import { pascalCase } from 'change-case'

import { ModelLoader } from './ModelLoader'
import { RawTestFile } from './RawTestFile'
import { RawBehavior } from './RawBehavior'

import behaviors from '@/behaviors.json'
import testCrawlerOutput from '@/tests.json'

export const DEFAULT_TEST_KINDS = ['unit', 'integration', 'e2e', 'unknown']

export class DenormalizedLoader implements ModelLoader {
  private systems = new Map<string, System>()
  private subsystems = new Map<string, SubSystem>()
  private behaviors = new Map<string, Behavior>()
  private tests = new Map<string, Test>()
  private features = new Map<string, Feature>()
  private testKinds = new Set<string>(DEFAULT_TEST_KINDS)

  public load() {
    this.loadBehaviors()

    this.loadAndLinkTests()

    this.calculateSummaryStatistics()

    return {
      systems: this.systems,
      behaviors: this.behaviors,
      tests: this.tests,
      testKinds: this.testKinds,
    }
  }

  // calculateSummaryStatistics calculates test kind & status statistics and assigns scores for all systems and subsystems
  private calculateSummaryStatistics() {
    for (const subsystem of Array.from(this.subsystems.values())) {
      this.calculateSubsystemStatistics(subsystem)
    }

    for (const system of Array.from(this.systems.values())) {
      this.calculateSystemStatistics(system)
    }
  }

  // calculateSystemStatistics calculates test kind & status statistics and assigns a score for a given system
  private calculateSystemStatistics(system: System) {
    const allSystemTests = _.flatten(system.subsystems.map(ss => ss.tests))
    const allSystemBehaviors = _.flatten(
      system.subsystems.map(ss => ss.behaviors),
    )

    system.testStatistics = new PercentageSet(
      calculateTestStatistics(allSystemTests),
    )

    system.behaviorStatistics = new PercentageSet(
      calculateBehaviorStatistics(allSystemBehaviors),
    )
    system.score = calculateSystemScore(system.behaviorStatistics)
  }

  // calculateSubsystemStatistics calculates test kind & status statistics and assigns a score for a given subsystem
  private calculateSubsystemStatistics(subsystem: SubSystem) {
    const subsystemBehaviors = _.flatten(
      subsystem.features.map(f => f.behaviors),
    )

    for (const behavior of subsystemBehaviors) {
      this.checkBehaviorTested(this.testKinds, subsystem, behavior)
    }

    subsystem.testStatistics = new PercentageSet(
      calculateTestStatistics(subsystem.tests),
    )

    subsystem.behaviorStatistics = new PercentageSet(
      calculateBehaviorStatistics(subsystemBehaviors),
    )

    subsystem.score = calculateSystemScore(subsystem.behaviorStatistics)
  }

  // handleUntestedBehaviors creates an "unimplemented" test with status=missing
  // for each untested behavior for each known test kind.
  private checkBehaviorTested(
    testKinds: Set<string>,
    subsystem: SubSystem,
    behavior: Behavior,
  ) {
    for (const testKind of behavior.expectedTestKinds) {
      const status = behavior.statusByKind(testKind)
      if (status === BehaviorStatus.untested) {
        this.createMissingTest(subsystem, behavior, testKind)
      }
    }
  }

  // createMissingTest creates a special "missing" test type that's unique and doesn't appear in the test crawler results
  private createMissingTest(
    subsystem: SubSystem,
    untestedBehavior: Behavior,
    testKind: string,
  ) {
    // Missing test have an auto-generated name in the format:
    // <SUBSYSTEM>_test.go/Test<BEHAVIOR_ID>
    const subsystemNameClean = subsystem.name.replace(/ /g, '_')
    const behaviorIdClean = pascalCase(untestedBehavior.id)
    const missingTestName = `${subsystemNameClean}_${testKind}_test.go/Test${behaviorIdClean}`

    const missingTest = new Test(
      missingTestName,
      'missing',
      'missing',
      'missing',
      testKind,
      TestStatus.missing,
      [untestedBehavior],
    )

    untestedBehavior.testedBy.push(missingTest)
    subsystem.tests.push(missingTest)
  }

  // loadAndLinkTests reads the test crawler results from tests.json and links them to behaviors,
  // subsystems and systems from the behavior catalogue.
  // ⚠️ Make sure the behavior catalogue is parsed and cached before calling this method, or it will do nothing
  private loadAndLinkTests() {
    if (this.behaviors.size === 0 || this.subsystems.size === 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `⚠️ loadAndLinkTests is called on an empty behavior catalogue. Did you forget to call .loadBehaviors()?`,
      )
    }

    for (const testFile of testCrawlerOutput) {
      if (testFile.ignore) {
        continue
      }

      this.preprocessRawTestFile(testFile)

      if (!testFile.scenarios || testFile.scenarios.length === 0) {
        this.handleUnparsedTest(testFile)
      } else {
        this.handleParsedTest(testFile)
      }
    }
  }

  private handleParsedTest(testFile: RawTestFile) {
    for (const rawScenario of testFile.scenarios) {
      const test = new Test(
        `${testFile.file}/${rawScenario.function}`,
        testFile.file,
        rawScenario.function,
        testFile.repository,
        testFile.test_type,
        TestStatus.unannotated,
      )

      if (rawScenario.Behaviors) {
        for (const rawBehavior of rawScenario.Behaviors) {
          test.status = TestStatus.pass
          this.linkTestToBehavior(rawBehavior, test)
        }
      }

      if (testFile.test_type) {
        this.testKinds.add(testFile.test_type)
      }
      this.tests.set(test.id, test)

      // update the subsystems in the cache
      for (const behavior of test.linkedBehaviors) {
        this.updateCachedSubsystems(behavior, test)
      }
    }
  }

  private updateCachedSubsystems(behavior: Behavior, test: Test) {
    const parentFeature = this.features.get(behavior.feature)
    if (!parentFeature) {
      throw new Error(`Can't find feature: ${behavior.feature} in the cache`)
    }

    const parentSubsystem = this.subsystems.get(parentFeature.subsystem)

    if (!parentSubsystem) {
      throw new Error(
        `Can't find subsystem: ${parentFeature.subsystem} in the cache`,
      )
    }

    if (!parentSubsystem.tests.find(t => t.id === test.id)) {
      parentSubsystem.tests.push(test)
    }
  }

  private linkTestToBehavior(rawBehavior: RawBehavior, test: Test) {
    const behavior = this.behaviors.get(rawBehavior.behavior)

    if (behavior) {
      behavior.testedBy.push({
        functionName: test.functionName,
        id: test.id,
        kind: test.kind,
        path: test.path,
        repository: test.repository,
        status: test.status,
      })
      test.linkedBehaviors.push(behavior)
    } else {
      throw new Error(
        `Unknown behavior ${rawBehavior.behavior} for test ${test.path}/${test.functionName}`,
      )
    }
  }

  private preprocessRawTestFile(testFile: RawTestFile) {
    if (!testFile.test_type) {
      testFile.test_type = 'unknown'
    }
  }

  private handleUnparsedTest(testFile: RawTestFile) {
    const test = new Test(
      `${testFile.file}/${this.tests.size}`,
      testFile.file,
      '',
      testFile.repository,
      testFile.test_type.length > 0 ? testFile.test_type : 'unknown',
      TestStatus.unparsed,
      [],
    )

    if (testFile.test_type) {
      this.testKinds.add(testFile.test_type)
    }
    this.tests.set(test.id, test)
  }

  private loadBehaviors() {
    for (const systemName in behaviors.systems) {
      this.loadSystem(systemName)
    }
  }

  private loadSystem(systemName: string) {
    const systemDetails = (behaviors.systems as any)[systemName]

    const system = new System(
      systemName,
      new PercentageSet([]),
      new PercentageSet([]),
      SystemScore.bad,
      [],
    )

    for (const subsystemName in systemDetails.subsystems) {
      this.loadSubsystem(
        subsystemName,
        systemDetails.subsystems[subsystemName],
        system,
      )
    }

    if (!this.systems.has(system.id)) {
      this.systems.set(system.id, system)
    } else {
      throw new Error(
        `System with id=${system.id} already exists in cache. Overwrites are not allowed.`,
      )
    }
  }

  private loadSubsystem(
    subsystemName: string,
    subsystemDetails: any,
    system: System,
  ) {
    const subsystem = new SubSystem(
      system.id,
      [],
      [],
      subsystemName,
      new PercentageSet([]),
      new PercentageSet([]),
      SystemScore.bad,
    )
    for (const rawFeature of subsystemDetails.features) {
      this.loadFeature(rawFeature, subsystem)
    }

    if (!this.subsystems.has(subsystem.id)) {
      this.subsystems.set(subsystem.id, subsystem)
    } else {
      throw new Error(
        `Subsystem with id=${subsystem.id} already exists in cache. Overwrites are not allowed.`,
      )
    }
    system.subsystems.push(subsystem)
  }

  private loadFeature(rawFeature: any, subsystem: SubSystem) {
    const feature = new Feature(
      rawFeature.name,
      subsystem.id,
      [],
      subsystem.system,
    )
    for (const rawBehavior of rawFeature.behaviors) {
      this.loadBehavior(rawBehavior, feature, subsystem)
    }
    this.features.set(feature.id, feature)
    subsystem.features.push(feature)
  }

  private loadBehavior(
    rawBehavior: any,
    feature: Feature,
    subsystem: SubSystem,
  ) {
    const behavior = new Behavior(
      rawBehavior.id,
      feature.id,
      rawBehavior.description,
      feature.subsystem,
      feature.system,
    )
    this.behaviors.set(behavior.id, behavior)
    feature.behaviors.push(behavior)
  }
}
