/* globals describe, expect, it */

import {
  Behavior,
  BehaviorStatus,
  Feature,
  SubSystem,
  System,
  Test,
  TestStatus,
} from '@filecoin/types'
import _ from 'lodash'

// Helper assertion that checks if there are duplicates in an array, and reports duplicates if there are any
expect.extend({
  noDuplicates(received: any[]) {
    const pass = new Set(received).size === received.length
    if (pass) {
      return {
        message: () => 'no duplicates',
        pass: true,
      }
    } else {
      const duplicates = _.filter(received, (val, i, iteratee) =>
        _.includes(iteratee, val, i + 1),
      )
      return {
        message: () =>
          `expected no duplicates, received duplicated values: [${duplicates}]`,
        pass: false,
      }
    }
  },
})

export function testSystemIntegrity(sys: System) {
  expect(sys.name.length).toBeGreaterThan(0)

  // test kind integrity checks
  expect(sys.testKindStats.percentages.length).toBeGreaterThan(0)
  const testKindSum = sys.testKindStats.percentages.reduce(
    (sum, next) => sum + next.percentage,
    0,
  )
  expect(Math.abs(testKindSum - 100)).toBeLessThan(
    sys.testKindStats.roundingError,
  )

  // test status integrity checks
  expect(sys.testStatusStats.percentages.length).toBeGreaterThan(0)
  const testStatusSum = sys.testStatusStats.percentages.reduce(
    (sum, next) => sum + next.percentage,
    0,
  )
  expect(Math.abs(testStatusSum - 100)).toBeLessThan(
    sys.testStatusStats.roundingError,
  )
}

export function testTestIntegrity(test: Test) {
  expect(test.id).toBeDefined()
  expect(test.id.length).toBeGreaterThan(0)
  expect(test.path).toBeDefined()
  expect(test.path.length).toBeGreaterThan(0)
  expect(test.functionName).toBeDefined()

  if (test.status !== TestStatus.unparsed) {
    expect(test.functionName.length).toBeGreaterThan(0)
  }

  expect(test.repository).toBeDefined()
  expect(test.repository.length).toBeGreaterThan(0)
  expect(test.kind).toBeDefined()
  expect(test.kind.length).toBeGreaterThan(0)
  expect(test.status).toBeDefined()
  expect(test.linkedBehaviors).toBeDefined()

  if (test.status === TestStatus.missing) {
    expect(test.linkedBehaviors).toHaveLength(1)
  }

  if (test.status === TestStatus.unannotated) {
    expect(test.linkedBehaviors).toHaveLength(0)
  }
}

export function testBehaviorIntegrity(behavior: Behavior) {
  expect(behavior.id).toBeDefined()
  expect(behavior.id.length).toBeGreaterThan(0)
  expect(behavior.feature).toBeDefined()
  expect(behavior.feature.length).toBeGreaterThan(0)
  expect(behavior.description).toBeDefined()
  expect(behavior.description.length).toBeGreaterThan(0)
  expect(behavior.subsystem).toBeDefined()
  expect(behavior.subsystem.length).toBeGreaterThan(0)
  expect(behavior.system).toBeDefined()
  expect(behavior.system.length).toBeGreaterThan(0)

  if (behavior.status === BehaviorStatus.untested) {
    expect(behavior.tests).toHaveLength(0)
  }
}

function testFeatureIntegrity(
  feature: Feature,
  subsystem: SubSystem,
  sys: System,
) {
  expect(feature.name).toBeDefined()
  expect(feature.name.length).toBeGreaterThan(0)
  expect(feature.subsystem).toBe(subsystem.id)

  // behavior integrity check
  expect(feature.behaviors.length).toBeGreaterThan(0)
  expect(feature.behaviors.map(b => b.id)).noDuplicates()
  for (const behavior of feature.behaviors) {
    testBehaviorIntegrity(behavior)
    expect(behavior.feature).toBe(feature.id)
    expect(behavior.subsystem).toBe(subsystem.id)
    expect(behavior.system).toBe(sys.id)
  }

  expect(feature.system).toBe(sys.id)
}

export function testSubsystemIntegrity(sys: System) {
  testSystemIntegrity(sys)

  // subsystem checks
  expect(sys.subsystems.length).toBeGreaterThan(0)
  expect(sys.subsystems.map(s => s.name)).noDuplicates()

  for (const subsystem of sys.subsystems) {
    testSystemIntegrity(subsystem)
    expect(subsystem.system).toBe(sys.id)

    // feature integrity check
    expect(subsystem.features.length).toBeGreaterThan(0)
    expect(subsystem.features.map(f => f.name)).noDuplicates()
    for (const feature of subsystem.features) {
      testFeatureIntegrity(feature, subsystem, sys)
    }

    // test Integrity Check
    expect(subsystem.tests.map(t => t.id)).noDuplicates()
    expect(subsystem.tests.length).toBeGreaterThan(0)
    for (const test of subsystem.tests) {
      testTestIntegrity(test)
    }

    // behavior integrity check
    expect(subsystem.behaviors.length).toBeGreaterThan(0)
    expect(subsystem.behaviors.map(b => b.id)).noDuplicates()
    for (const behavior of subsystem.behaviors) {
      testBehaviorIntegrity(behavior)
      expect(behavior.subsystem).toBe(subsystem.id)
    }
  }
}
