// @ts-ignore
import * as fcl from '@onflow/fcl'
import BigNumber from 'bignumber.js'
import contract from 'contract'
import {Nanoflow} from '../types'
import {
  ContractParamsResponse,
  ContractConfigResponse,
  LockedInfoResponse,
} from './types'

export async function getBalance(address: string): Promise<string> {
  const accountInfoResponse =
    await fcl.send<fcl.FlowNodeApiAccountInfoResponse>([
      fcl.getAccount(address),
    ])

  return (accountInfoResponse?.account.balance / 100_000_000 ?? 0).toString()
}

export async function getLockedInfo(
  address: string,
): Promise<LockedInfoResponse> {
  const result = await fcl.query({
    cadence: contract.scripts.getLockedInfo,
    // @ts-ignore
    args: (arg, t) => [arg(address, t.Address)],
  })

  return result.amount != null
    ? {
        amount: new BigNumber(result.amount),
        balance: new BigNumber(result.balance),
        weight: Number(result.weight),
        duration: Number(result.duration),
        lockedUntil: result.lockedUntil
          ? new Date(result.lockedUntil * 1000)
          : null,
        lockedAt: result.lockedAt ? new Date(result.lockedAt * 1000) : null,
        unlockedAt: result.unlockedAt
          ? new Date(result.unlockedAt * 1000)
          : null,
      }
    : null
}

export async function getContractStats(): Promise<ContractParamsResponse> {
  const result = await fcl.query({
    cadence: contract.scripts.getLockContractStats,
  })

  return {
    totalLockedFlow: new BigNumber(result.totalLockedFlow) as Nanoflow,
    totalLockedWeight: result.totalLockedWeight,
  }
}

export async function getContractConfig(): Promise<ContractConfigResponse> {
  const result = await fcl.query({
    cadence: contract.scripts.getLockContractConfig,
  })

  return {
    lockDurationsRewardFactors: result.lockDurationsRewardFactors,
    lockPeriodStart: new Date(result.lockPeriodStart * 1000),
  }
}
