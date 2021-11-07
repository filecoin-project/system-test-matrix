import { Colors } from '@filecoin/ui'

export const ChartData = [
  {
    color: Colors.green90,
    border: Colors.green90,
    value: 22,
    description: '35% Unit',
  },
  {
    color: Colors.green30,
    border: Colors.green30,
    value: 22,
    description: '25% Integration',
  },
  {
    color: Colors.yellow,
    border: Colors.yellow,
    value: 6,
    description: '15% API',
  },
  {
    color: Colors.warningNotification,
    border: Colors.warningNotification,
    value: 10,
    description: '10% CLI',
  },
  {
    color: Colors.red90,
    border: Colors.red90,
    value: 30,
    description: '8% E2E',
  },
  {
    color: Colors.inputHoverPlaceholder,
    border: Colors.inputHoverPlaceholder,
    value: 30,
    description: '7% unkown',
  },
]

export const RepositoryData = [
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: 'Good',
  },
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: 'Bad',
  },
  {
    projectName: 'system-test-matrix',
    projectURL: 'https://github.com/filecoin-project/system-test-matrix',
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: 'Mediocre',
  },
]
