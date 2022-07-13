import {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
  useMutation as _useMutation,
  UseMutationResult,
} from 'react-query'
import {queryClient} from './queryClient'

export const useMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  key: MutationKey,
  func?: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext> & {
    invalidationKeys?: MutationKey[]
  },
): UseMutationResult<TData, TError, TVariables, TContext> => {
  return _useMutation<TData, TError, TVariables, TContext>(key, func, {
    ...options,
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options?.onSuccess(data, variables, context)
      }
      if (options?.invalidationKeys) {
        Promise.all(
          options.invalidationKeys.map((key) =>
            queryClient.invalidateQueries(key),
          ),
        )
      }
    },
  })
}
