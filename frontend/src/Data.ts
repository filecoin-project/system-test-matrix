export const green = "#00876c";
export const lightGreen = "#88bb72";
export const yellow = "#fde987";
export const orange = "#f49654";
export const red = "#d43d51";
export const grey = "grey";

export type ChartDataType = {
  color: string;
  border: string;
  value: number;
  description: string;
};

export type TableRowType = {
  projectName: string;
  projectURL: string;
  testKindsData: ChartDataType[];
  testStatusData: ChartDataType[];
  score: string;
};

export type AllTestsRowType = {
  suiteName: string;
  suiteURL: string;
  functionName: string;
  repositoryName: string;
  tags: string[];
  behaviours: string[];
  status: string;
};

export type LinkedBehavoiurRowType = {
  behaviourName: string;
  description: string;
  tags: string[];
  behaviourURL: string;
};

export const LinkedBehavoiurData = [
  {
    behaviourName: "PAYCH_ALLOC_004",
    tags: ["Payment", "Channel Allocation"],
    description: "Lorem ipsum",
    behaviourURL: "/lotus/paychmgr",
  },
  {
    behaviourName: "PAYCH_ALLOC_005",
    tags: ["Payment", "Channel Allocation"],
    description: "Lorem ipsum",
    behaviourURL: "/lotus/paychmgr",
  },
];

export const AllTestsData = [
  {
    suiteName: "first_test.go",
    suiteURL: "/lotus/paychmgr",
    functionName: "TestSomething",
    repositoryName: "Lotus",
    tags: ["unit", "cli", "integration"],
    behaviours: ["VOUCH_CREATE_001", "VOUCH_CREATE_002"],
    status: "Good",
  },

  {
    suiteName: "second_test.go",
    suiteURL: "/lotus/paychmgr",
    functionName: "TestSomething",
    repositoryName: "Lotus",
    tags: ["unit"],
    behaviours: ["VOUCH_CREATE_001", "VOUCH_CREATE_002"],
    status: "Bad",
  },
];

export const ChartData = [
  {
    color: green,
    border: green,
    value: 22,
    description: "35% Unit",
  },
  {
    color: lightGreen,
    border: lightGreen,
    value: 22,
    description: "25% Integration",
  },
  {
    color: yellow,
    border: yellow,
    value: 6,
    description: "15% API",
  },
  {
    color: orange,
    border: orange,
    value: 10,
    description: "10% CLI",
  },
  {
    color: red,
    border: red,
    value: 30,
    description: "8% E2E",
  },
  {
    color: grey,
    border: grey,
    value: 30,
    description: "7% unkown",
  },
];

export const RepositoryData = [
  {
    projectName: "system-test-matrix",
    projectURL: "https://github.com/filecoin-project/system-test-matrix",
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: "Good",
  },
  {
    projectName: "system-test-matrix",
    projectURL: "https://github.com/filecoin-project/system-test-matrix",
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: "Bad",
  },
  {
    projectName: "system-test-matrix",
    projectURL: "https://github.com/filecoin-project/system-test-matrix",
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: "Mediocre",
  },
];

export const RepositoryDetailsData = [
  {
    projectName: "paychmgr",
    projectURL: "https://github.com/filecoin-project/system-test-matrix",
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: "Mediocre",
  },
  {
    projectName: "miner",
    projectURL: "https://github.com/filecoin-project/system-test-matrix",
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: "Good",
  },
  {
    projectName: "sealing",
    projectURL: "https://github.com/filecoin-project/system-test-matrix",
    testKindsData: ChartData,
    testStatusData: ChartData,
    score: "Bad",
  },
];
