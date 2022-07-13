import BigNumber from 'bignumber.js'

type QueryResultStateProperties = {
  isLoading: boolean
  isFetching: boolean
  dataUpdatedAt: number
  error: unknown
  isSuccess: boolean
}

export function mergeQueryResultsState(
  ...queryResults: QueryResultStateProperties[]
): QueryResultStateProperties {
  const isLoading = queryResults.some((q) => q.isLoading)
  const isFetching = queryResults.some((q) => q.isFetching)
  const isSuccess = queryResults.every((q) => q.isSuccess)
  const dataUpdatedAt = Math.max(...queryResults.map((q) => q.dataUpdatedAt))
  const error = queryResults.find((q) => q.error)
  return {isLoading, isFetching, isSuccess, dataUpdatedAt, error}
}

export const arraySum = <T extends BigNumber>(values: T[]): T =>
  values.reduce((acc, val) => acc.plus(val), new BigNumber(0)) as T
