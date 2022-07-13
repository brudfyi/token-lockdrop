import BigNumber from 'bignumber.js'
import {Nanoflow} from '../types'

export type ApiError = string | null | {message: string}

export type LockedInfoResponse = {
  balance: BigNumber
  amount: BigNumber
  weight: number
  duration: number
  lockedUntil: Date | null
  lockedAt: Date | null
  unlockedAt: Date | null
} | null

export type ContractParamsResponse = {
  totalLockedFlow: Nanoflow
  totalLockedWeight: BigNumber
}

export type ContractConfigResponse = {
  lockDurationsRewardFactors: {
    [key in number]: {
      numerator: string
      denominator: string
    }
  }
  lockPeriodStart: Date
}

export type LockParams = {
  amount: string
  lockDuration: string
  lockWeight: string
}
