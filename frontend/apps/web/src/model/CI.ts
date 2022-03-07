// generated from JSON using https://app.quicktype.io/

export interface CiTest {
  name: string
  classname: string
  result: string
  source: string
  job: Job
}

export interface Job {
  job_number: number
  id: string
  name: string
  number: number
  status: string
  workflow: Workflow
  url: string
}

export interface Workflow {
  id: string
  name: string
  status: string
  pipeline: Pipeline
}

export interface Pipeline {
  id: string
  state: string
  number: number
  VCS: Vcs
  Trigger: Trigger
}

export interface Trigger {
  type: string
}

export interface Vcs {
  branch: string
}
