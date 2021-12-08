import { Model } from '@/model'

describe('Model', () => {
  const model = Model.New()

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

  const expectedTestKinds = ['unit', 'integration', 'e2e', 'benchmark']

  describe('getAllSystems', () => {
    it('returns all expected systems', () => {
      const systems = model.getAllSystems()

      const systemNames = systems.map(s => s.name)
      expect(systemNames.sort()).toEqual(expectedSystemNames.sort())

      for (const sys of systems) {
        expect(sys.testKindStats.percentages.length).toBeGreaterThan(0)
        expect(sys.testStatusStats.percentages.length).toBeGreaterThan(0)
        expect(sys.cached).toBe(false)
      }
    })
  })

  describe('findSystemByName', () => {
    it('works for all system names', () => {
      for (const systemName of expectedSystemNames) {
        const sys = model.findSystemByName(systemName)
        expect(sys).toBeDefined()
        expect(sys!.name).toBe(systemName)
        expect(sys!.testKindStats.percentages.length).toBeGreaterThan(0)
        expect(sys!.testStatusStats.percentages.length).toBeGreaterThan(0)
      }
    })
  })

  describe('getAllTests', () => {
    const expectedNumTests = 1

    it('returns the expected number of tests', () => {
      const allTests = model.getAllTests()
      expect(allTests.length).toBeGreaterThanOrEqual(expectedNumTests)
    })
  })

  describe('getAllTestKinds', () => {
    it('returns all expected test kinds', () => {
      const testKinds = model.getAllTestKinds()
      expect(testKinds.length).toBeGreaterThan(0)
      for (const testKind of expectedTestKinds) {
        expect(testKinds.includes(testKind)).toBeTruthy()
      }
    })
  })

  describe('getAllBehaviors', () => {
    const expectedBehaviorsMin = 300
    it('returns all behaviors', () => {
      const allBehaviors = model.getAllBehaviors()
      expect(allBehaviors.length).toBeGreaterThanOrEqual(expectedBehaviorsMin)
    })
  })
})

export {}
