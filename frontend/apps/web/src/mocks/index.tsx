import { Colors } from '@filecoin/ui'

export const ChartDataWithoutPercentage = [
  {
    color: Colors.green90,
    border: Colors.green90,
    size: 22,
    name: '35% Unit',
  },
  {
    color: Colors.green30,
    border: Colors.green30,
    size: 22,
    name: '25% Integration',
  },
  {
    color: Colors.yellow,
    border: Colors.yellow,
    size: 6,
    name: '15% API',
  },
  {
    color: Colors.warningNotification,
    border: Colors.warningNotification,
    size: 10,
    name: '10% CLI',
  },
  {
    color: Colors.red90,
    border: Colors.red90,
    size: 30,
    name: '8% E2E',
  },
  {
    color: Colors.inputHoverPlaceholder,
    border: Colors.inputHoverPlaceholder,
    size: 30,
    name: '7% unkown',
  },
]

export const chartDataWithPercentageAndKind = [
  {
    kind: 'api',
    percentage: 14.9
  },
  {
    kind: 'unit',
    percentage: 49
  },
  {
    kind: 'integration',
    percentage: 22.8
  },
  {
    kind: 'benchmark',
    percentage: 8
  },
  {
    kind: 'e2e',
    percentage: 6
  }
]

export const chartDataWithPercentageAndStatus = [
  {
    kind: 'api',
    percentage: 14
  },
  {
    kind: 'unit',
    percentage: 49
  }
]

export const RepositoryData = [
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
    testData: ChartDataWithoutPercentage,
    score: 'Good',
  },
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
    testData: ChartDataWithoutPercentage,
    score: 'Bad',
  },
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
    testData: ChartDataWithoutPercentage,
    score: 'Mediocre',
  },
]
