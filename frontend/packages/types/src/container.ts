export interface Action<T extends string> {
  type: T
  value?: any
  [key: string]: any
}
