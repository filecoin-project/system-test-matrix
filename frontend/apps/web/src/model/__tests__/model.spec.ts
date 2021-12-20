import { DEFAULT_TEST_KINDS, Model } from '@/model'
import { SystemScore, TestStatus } from '@filecoin/types'
import { testSystemIntegrity } from './helpers'
import _ from 'lodash'

describe('Model', () => {
  const model = Model.New()

  // we expect AT LEAST these systems to be returned
  const expectedSystemNames = [
    'api',
    'chain',
    'client',
    'market',
    'miner',
    'network',
    'token',
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

      // integrity check for each returned system
      for (const sys of systems) {
        testSystemIntegrity(sys)

        // subsystem checks
        expect(sys.subsystems.length).toBeGreaterThan(0)
        expect(sys.subsystems.map(s => s.name)).noDuplicates()

        for (const subsystem of sys.subsystems) {
          testSystemIntegrity(subsystem)
          expect(subsystem.parentSystemName).toBe(sys.name)

          // feature integrity check
          expect(subsystem.features.length).toBeGreaterThan(0)
          expect(subsystem.features.map(f => f.name)).noDuplicates()
          for (const feature of subsystem.features) {
            expect(feature.name).toBeDefined()
            expect(feature.name.length).toBeGreaterThan(0)
            expect(feature.parentSubsystemName).toBe(subsystem.name)

            // behavior integrity check
            expect(feature.behaviors.length).toBeGreaterThan(0)
            expect(feature.behaviors.map(b => b.id)).noDuplicates()
            for (const behavior of feature.behaviors) {
              expect(behavior.id).toBeDefined()
              expect(behavior.id.length).toBeGreaterThan(0)
              expect(behavior.parentFeatureName).toBe(feature.name)
              expect(behavior.description).toBeDefined()
              expect(behavior.description.length).toBeGreaterThan(0)
              expect(behavior.subsystemName).toBe(subsystem.name)
              expect(behavior.systemName).toBe(sys.name)
            }

            expect(feature.systemName).toBe(sys.name)
          }

          // testIntegrityCheck
          expect(subsystem.tests.map(t => t.id)).noDuplicates()
          expect(subsystem.tests.length).toBeGreaterThan(0)
        }
      }

      // at least one system should have score > bad
      const notBadSystem = systems.find(
        s => s.score === SystemScore.mediocre || s.score === SystemScore.good,
      )
      expect(notBadSystem).toBeDefined()
    })
  })

  describe('findSystemByName', () => {
    it('works for all system names', () => {
      for (const systemName of expectedSystemNames) {
        const sys = model.findSystemByName(systemName)
        expect(sys).toBeDefined()
        expect(sys!.name).toBe(systemName)
        testSystemIntegrity(sys)
      }
    })
  })

  describe('getAllTests', () => {
    const expectedNumTests = 1

    it('returns the expected number of tests', () => {
      const allTests = model.getAllTests()
      expect(allTests.length).toBeGreaterThanOrEqual(expectedNumTests)
      expect(allTests.map(t => t.id)).noDuplicates()
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
    })
  })
})

export {}
