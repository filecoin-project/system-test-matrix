/* globals describe, expect, it */
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
    'chain',
    'client',
    'cmd',
    'conformance',
    'events',
    'journal',
    'market',
    'miner',
    'network',
    'splitstore',
    'token',
    'tools',
    'types',
    'vm',
    'repo',
  ]

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
    const expectedNumTests = 500

    it('returns the expected number of tests', () => {
      const allTests = model.getAllTests()
      expect(allTests.length).toBeGreaterThanOrEqual(expectedNumTests)
      expect(allTests.map(t => t.id)).noDuplicates()

      for (const test of allTests) {
        testTestIntegrity(test)
      }

      // some tests should be unparsed
      const unparsed = allTests.filter(t => t.status === TestStatus.unparsed)
      expect(unparsed.length).toBeGreaterThan(0)
      // but not all
      expect(unparsed.length).toBeLessThan(allTests.length)

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
    it('returns all behaviors', () => {
      const allBehaviors = model.getAllBehaviors()
      expect(allBehaviors.length).toBeGreaterThanOrEqual(expectedBehaviorsMin)
      expect(allBehaviors.map(b => b.id)).noDuplicates()

      for (const behavior of allBehaviors) {
        testBehaviorIntegrity(behavior)
      }
    })
  })
})

export {}
