import {useState, useEffect} from 'react'
// @ts-ignore
import * as fcl from '@onflow/fcl'
import BigNumber from 'bignumber.js'

import contract from 'contract'
import {useGetContractStats, useGetContractConfig} from './api'
import type {User} from './types'
import config from './config'
import {flowToNanoflow} from './parseUtils'

// Replace with ENV variables
const configValues = {
  'flow.network': 'testnet',
  'accessNode.api': ' https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn', // Endpoint set to Testnet
  'app.detail.icon': 'https://placekitten.com/g/200/200', // Replace this kitten with a real app icon asset
  'app.detail.title': config.rewardTokenName,
  ...contract.vars['testnet'], // Mapping of relevant contract addresses
}

export function useConfig() {
  const [config, setConfig] = useState(null)

  useEffect(() => fcl.config(configValues).subscribe(setConfig), [])
  return config
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  useEffect(() => fcl.currentUser().subscribe(setCurrentUser), [])
  return currentUser
}

// Rewards calculation:
// Let A = (# of Flow Tokens Staked by an Individual)
// Let B = (Time-Based Multiplier)
// Let C = (Post-Quadratic-Weighting, Post-Multiplier "Score")
// Let D = (Sum of C for All Participants)
// Let E = (% of Total Reward Token Allocation Distributed to an Individual)
// C = (√A) * B
// E = C / D
export const useGetRewardStats = (
  amount: BigNumber,
  duration: number,
  isLocked?: boolean,
) => {
  const {data: contractStats} = useGetContractStats()
  const {data: contractConfig} = useGetContractConfig()

  if (!contractStats || !contractConfig || amount.isZero() || duration === 0) {
    return {
      userWeight: new BigNumber(0),
      rewardEstimate: new BigNumber(0),
    }
  }

  const {totalLockedWeight} = contractStats
  const {lockDurationsRewardFactors} = contractConfig

  const nanoflowAmount = flowToNanoflow(amount.toString())

  const userWeight = new BigNumber(
    lockDurationsRewardFactors[duration].numerator,
  )
    .times(nanoflowAmount.sqrt())
    .dividedBy(new BigNumber(lockDurationsRewardFactors[duration].denominator))
    .integerValue(BigNumber.ROUND_CEIL)

  const allParticipantsWeight = isLocked
    ? new BigNumber(totalLockedWeight)
    : new BigNumber(totalLockedWeight).plus(userWeight)

  const rewardsFraction = !allParticipantsWeight.isZero()
    ? userWeight.dividedBy(allParticipantsWeight)
    : 0

  return {
    userWeight,
    rewardEstimate: new BigNumber(config.rewardTokenSupply).times(
      rewardsFraction,
    ),
  }
}
