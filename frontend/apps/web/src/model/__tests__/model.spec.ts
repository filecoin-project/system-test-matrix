/* globals describe, expect, it */
import _ from 'lodash'

import { TestStatus } from '@filecoin/types'

import { DEFAULT_TEST_KINDS } from '../DenormalizedLoader'

import {
  testBehaviorIntegrity,
  testSubsystemIntegrity,
  testSystemIntegrity,
  testTestIntegrity,
} from './helpers'

import { Model } from '@/model'

describe('Model', () => {
  const model = Model.New()

  // we expect AT LEAST these systems to be returned
  const expectedSystemNames = [
    'api',
    'blockstore',
    'chain',
    'client',
    'cmd',
    'journal',
    'market',
    'miner',
    'network',
    'token',
    'tools',
    'repo',
  ]

  // Rules of referential integrity for this model:
  // the System Test Matrix contains one or more Systems, each System is unique and contains at least one Subsystem;
  // each Subsystem is unique, can belong to exactly one System, contains zero or more Features & Tests;
  // Each Feature is unique, can belong to exactly one Subsystem, contains one or more Behaviors;
  // Each Behavior is unique, cna belong to exactly one Feature, and is tested by zero or more tests;
  // Each Test is unique and tests zero or more Behaviors;

  describe('getAllSystems', () => {
    it('returns all expected systems', () => {
      const systems = model.getAllSystems()

      // check if it returns at least the expected systems
      const systemNames = systems.map(s => s.name)
      for (const expectedSystemName of expectedSystemNames) {
        expect(systemNames).toContain(expectedSystemName)
      }
      expect(systemNames).noDuplicates()

      // check each system
      for (const sys of systems) {
        testSubsystemIntegrity(sys)
      }
    })
  })

  describe('findSystemByName', () => {
    it('works for all system names', () => {
      for (const systemName of expectedSystemNames) {
        const sys = model.findSystemByName(systemName)
        expect(sys).toBeDefined()
        expect(sys.name).toBe(systemName)
        testSystemIntegrity(sys)
      }
    })
  })

  describe('getAllTests', () => {
    const expectedNumTests = 300

    it('returns the expected number of tests', () => {
      const allTests = model.getAllTests()
      expect(allTests.length).toBeGreaterThanOrEqual(expectedNumTests)
      expect(allTests.map(t => t.id)).noDuplicates()

      for (const test of allTests) {
        testTestIntegrity(test)
      }

      // // some tests should be unparsed
      // const unparsed = allTests.filter(t => t.status === TestStatus.unparsed)
      // expect(unparsed.length).toBeGreaterThan(0)
      // // but not all
      // expect(unparsed.length).toBeLessThan(allTests.length)

      // some tests should be unannotated
      const unannotated = allTests.filter(
        t => t.status === TestStatus.unannotated,
      )
      expect(unannotated.length).toBeGreaterThan(0)
      // but not all
      expect(unannotated.length).toBeLessThan(allTests.length)
    })
  })

  describe('getAllTestKinds', () => {
    it('returns all expected test kinds', () => {
      const testKinds = model.getAllTestKinds()
      expect(testKinds.length).toBeGreaterThan(0)
      for (const testKind of DEFAULT_TEST_KINDS) {
        expect(testKinds.includes(testKind)).toBeTruthy()
      }
    })
  })

  describe('getAllBehaviors', () => {
    const expectedBehaviorsMin = 300
    const allBehaviors = model.getAllBehaviors()
    it('returns all behaviors', () => {
      expect(allBehaviors.length).toBeGreaterThanOrEqual(expectedBehaviorsMin)
      expect(allBehaviors.map(b => b.id)).noDuplicates()

      for (const behavior of allBehaviors) {
        testBehaviorIntegrity(behavior)
      }

      // expect some behaviors for every status
      // TODO: Remove this test after everything is tested
      const behaviorsByStatus = _.groupBy(allBehaviors, 'status')
      expect(Object.keys(behaviorsByStatus)).toHaveLength(3) // there are 3 different behav statuses
      // console.log(testBeh.tests)
      // for debugging purposes
      // for (const [status, behaviors] of Object.entries(behaviorsByStatus)) {
      //   console.log(`Status: ${status}, behaviors: ${behaviors.length}`)
      // }
    })
  })

  // TODO: See how to properly test this
  // describe('matrix integrity', () => {
  //   it('numTests = numBehaviors * numTestKinds', () => {
  //     const allBehaviors = model.getAllBehaviors()
  //     const allTests = model.getAllTests()
  //     const allTestKinds = model.getAllTestKinds()

  //     console.log(`Num behaviors: ${allBehaviors.length}`)
  //     console.log(`Num tests: ${allTests.length}`)
  //     console.log(`Num test kinds: ${allTestKinds.length}`)
  //   })
  // })
})

export {}
