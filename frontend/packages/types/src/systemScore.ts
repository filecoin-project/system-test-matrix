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
  const stats = testStatusStats.percentages

  const untested = stats.find(s => s.status === 'untested')

  if (untested && untested.percentage > 66) {
    return SystemScore.bad
  } else if (untested && untested.percentage > 33) {
    return SystemScore.mediocre
  } else {
    return SystemScore.good
  }
}
