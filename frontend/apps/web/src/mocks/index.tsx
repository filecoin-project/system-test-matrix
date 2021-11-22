export const chartDataWithPercentageAndKind = [
  {
    kind: 'api',
    percentage: 20
  },
  {
    kind: 'unit',
    percentage: 30
  },
  {
    kind: 'integration',
    percentage: 15.5555550
  },
  {
    kind: 'benchmark',
    percentage: 24.5555550
  },
  {
    kind: 'e2e',
    percentage: 10
  }
]

export const chartDataWithPercentageAndStatus = [
  {
    status: 'api',
    percentage: 51
  },
  {
    status: 'unit',
    percentage: 49
  }
]

export const RepositoryData = [
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
    score: 'Good',
  },
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
    score: 'Bad',
  },
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
    score: 'Mediocre',
  },
]
