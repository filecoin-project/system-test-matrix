export const chartDataWithPercentageAndKind = [
  {
    kind: 'api',
    percentage: 20,
  },
  {
    kind: 'unit',
    percentage: 30,
  },
  {
    kind: 'integration',
    percentage: 15.55555,
  },
  {
    kind: 'benchmark',
    percentage: 24.455555,
  },
  {
    kind: 'e2e',
    percentage: 10,
  },
]

export const chartDataWithPercentageAndStatus = [
  {
    status: 'api',
    percentage: 51,
  },
  {
    status: 'unit',
    percentage: 49,
  },
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

export const AllTestKinds = [
  {
    name: 'Unit',
    percentage: 20,
  },
  {
    name: 'Integration',
    percentage: 8,
  },
  {
    name: 'API Tests',
    percentage: 12,
  },
  {
    name: 'Lorem Ipsum',
    percentage: 4,
  },
  {
    name: 'Lorem Oposum',
    percentage: 7,
  },
  {
    name: 'Lorem Tupson',
    percentage: 3,
  },
  {
    name: 'CLI Tests',
    percentage: 10,
  },
  {
    name: 'End-to-End Tests',
    percentage: 25,
  },
  {
    name: 'API',
    percentage: 8,
  },
  {
    name: 'Unknown',
    percentage: 3,
  },
]

export const AllTestStatus = [
  {
    name: 'Missing tests',
    percentage: 35,
  },
  {
    name: 'Passing tests',
    percentage: 55,
  },
  {
    name: 'Failing tests',
    percentage: 15,
  },
]

export const Subsystems = [
  {
    subsystem: 'Message Pool',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
  },
  {
    subsystem: 'State Tree',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
  },
  {
    subsystem: 'Chain Sync',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
  },
  {
    subsystem: 'Consensus',
    testKindsData: chartDataWithPercentageAndKind,
    testStatusData: chartDataWithPercentageAndStatus,
  },
]
