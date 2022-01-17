import { RawScenario } from './RawScenario'

export interface RawTestFile {
  file: string
  path: string
  repository: string
  parent_folder: string
  package: string
  test_type: string
  ignore: boolean
  scenarios: RawScenario[]
}
