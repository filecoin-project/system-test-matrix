import { PercentageSet } from './shared'
import { TestStatusStatistic } from './testStatusStatistic'

export enum SystemScore {
  bad = 'bad',
  mediocre = 'mediocre',
  good = 'good',
}

export function calculateSystemScore(
  testStatusStats: PercentageSet,
): SystemScore {
  const stats = testStatusStats.percentages as TestStatusStatistic[]
  const missing = stats.find(s => s.status === 'missing')
  if (missing && missing.percentage > 66) {
    return SystemScore.bad
  } else if (missing && missing.percentage > 33) {
    return SystemScore.mediocre
  } else {
    return SystemScore.good
  }
}
