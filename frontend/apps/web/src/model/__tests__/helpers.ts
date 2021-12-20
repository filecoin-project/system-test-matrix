import { System } from '@filecoin/types'
import _ from 'lodash'

export function testSystemIntegrity(sys: System) {
  // console.log(`Checking system=${sys.name}`)
  // if (sys.name === 'auth') {
  //   console.log(JSON.stringify(sys, null, 2))
  // }
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
