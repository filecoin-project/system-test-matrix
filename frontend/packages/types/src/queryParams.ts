export interface TestQueryParams extends SystemPageQueryParams {
  behaviorId?: string
}

export interface SystemPageQueryParams {
  tab?: 'overview' | 'detailedView'
  id?: string
}
