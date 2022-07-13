import {useQuery} from 'react-query'
import {
  getBalance,
  getLockedInfo,
  getContractStats,
  getContractConfig,
} from './scripts'
import {FlowAddress} from '../types'
import {
  ApiError,
  ContractParamsResponse,
  ContractConfigResponse,
  LockedInfoResponse,
} from './types'

export const queryKeys = {
  getBalance: (address: string) => ['getBalance', address],
  getLockedInfo: (address: string) => ['getLockedInfo', address],
  getContractStats: 'getContractStats',
  getContractConfig: 'getContractConfig',
}

export const useGetBalance = (address: FlowAddress) => {
  return useQuery<string, ApiError>(queryKeys.getBalance(address), () =>
    getBalance(address),
  )
}

export const useGetLockedInfo = (address: FlowAddress) => {
  return useQuery<LockedInfoResponse, ApiError>(
    queryKeys.getLockedInfo(address),
    () => getLockedInfo(address),
  )
}

export const useGetContractStats = () => {
  return useQuery<ContractParamsResponse, ApiError>(
    queryKeys.getContractStats,
    getContractStats,
  )
}

export const useGetContractConfig = () => {
  return useQuery<ContractConfigResponse, ApiError>(
    queryKeys.getContractConfig,
    getContractConfig,
    // Contract static params are only needed to be loaded once
    {staleTime: Infinity},
  )
}
