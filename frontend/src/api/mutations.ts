import {MutationFunction, MutationKey} from 'react-query'
import {toast} from 'react-toastify'

import {lock, unlock} from './transactions'
import {queryKeys} from './queries'
import {useMutation} from './useMutation'
import type {ApiError, LockParams} from './types'

const mutationKeys = {
  lock: 'lock',
  unlock: 'unlock',
}

// Queries that should be updated after a lock or unlock
const interactionsInvalidationKeys = (address: string) => [
  queryKeys.getBalance(address),
  queryKeys.getLockedInfo(address),
  queryKeys.getContractStats,
]

const useMutationWithErrorHandling = <TData>(
  key: string,
  fn: MutationFunction<unknown, TData>,
  invalidationKeys: MutationKey[] | undefined,
  successMessage: string,
) => {
  return useMutation<unknown, ApiError, TData>(key, fn, {
    invalidationKeys,
    onError: (e) => {
      toast.error(typeof e === 'string' ? e : e?.message)
    },
    onSuccess: () => {
      toast.success(successMessage)
    },
  })
}

export const useLock = (address: string) =>
  useMutationWithErrorHandling<LockParams>(
    mutationKeys.lock,
    lock,
    interactionsInvalidationKeys(address),
    'Locked successfully!',
  )

export const useUnlock = (address: string) =>
  useMutationWithErrorHandling<void>(
    mutationKeys.unlock,
    unlock,
    interactionsInvalidationKeys(address),
    'Unlocked successfully!',
  )
