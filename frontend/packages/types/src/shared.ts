// PercentageSet makes sure you can't create a set of statistics where the sum of percentages is != 100, with a given rounding error
export class PercentageSet {
  constructor(
    public percentages: Array<{
      kind?: string
      status?: string
      percentage: number
      numberOfTests: number
    }>,
    public roundingError = 0.2,
  ) {
    const percentageSum = percentages.reduce(
      (sum: number, next) => (sum += next.percentage),
      0,
    )
    if (percentageSum > 0 && Math.abs(percentageSum - 100) > roundingError) {
      throw new Error(
        `Percentage sum is ${percentageSum} (!=100+-${roundingError}). Given: ${JSON.stringify(
          percentages,
        )}`,
      )
    }
  }
}
