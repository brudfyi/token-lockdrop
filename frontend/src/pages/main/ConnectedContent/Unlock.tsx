import React from 'react'
import BigNumber from 'bignumber.js'

import ContentBlock from './ContentBlock/ContentBlock'
import {
  useGetContractStats,
  useGetContractConfig,
  useGetLockedInfo,
  useUnlock,
} from '../../../api'
import {FlowAddress} from '../../../types'
import config from '../../../config'
import {useGetRewardStats} from '../../../hooks'

type UnlockProps = {
  address: FlowAddress
}

const Unlock = ({address}: UnlockProps) => {
  const {mutateAsync: unlock, isLoading: unlockLoading} = useUnlock(address)
  const {data: lockInfo, ...lockInfoQuery} = useGetLockedInfo(address)
  const {data: contractStats, ...contractParamsQuery} = useGetContractStats()
  const {data: contractConfig, ...contractConfigQuery} = useGetContractConfig()
  const {rewardEstimate} = useGetRewardStats(
    lockInfo?.amount || new BigNumber(0),
    lockInfo?.duration || 0,
    true,
  )

  return (
    <div className="content-col">
      <ContentBlock
        values={[
          [
            {
              title: 'Locked total',
              value:
                contractStats?.totalLockedFlow !== undefined
                  ? `${
                      !contractStats.totalLockedFlow.isZero()
                        ? contractStats.totalLockedFlow
                        : '0.00'
                    } FLOW`
                  : undefined,
              query: contractParamsQuery,
            },
            {
              title: 'Rewards total',
              value: `${config.rewardTokenSupply} ${config.rewardTokenName}`,
              query: contractConfigQuery,
            },
          ],
        ]}
      />

      <div className="mb-3" />

      <ContentBlock
        values={[
          [
            {
              title: 'My lock',
              value: lockInfo
                ? `${lockInfo.amount.toString()} FLOW ${
                    lockInfo.unlockedAt ? '(Unlocked)' : ''
                  }`
                : undefined,
              query: lockInfoQuery,
            },
            {
              title: 'Reward estimate',
              isLabel: true,
              value: `${rewardEstimate.toFixed(2)} ${config.rewardTokenName}`,
              query: lockInfoQuery,
            },
          ],

          [
            {
              title: 'Locked',
              isLabel: true,
              value: lockInfo?.lockedAt
                ? lockInfo.lockedAt.toLocaleString()
                : undefined,
              query: lockInfoQuery,
            },
            {
              title: 'Unlocked',
              isLabel: true,
              value: lockInfo?.unlockedAt
                ? lockInfo.unlockedAt.toLocaleString()
                : undefined,
              query: lockInfoQuery,
            },
          ],
          [
            {
              title: 'Lock start',
              isLabel: true,
              value:
                contractConfig && lockInfo
                  ? contractConfig.lockPeriodStart.toLocaleString()
                  : undefined,
              query: {
                isFetching:
                  lockInfoQuery.isFetching || contractConfigQuery.isFetching,
                isLoading:
                  lockInfoQuery.isLoading || contractConfigQuery.isLoading,
                error: lockInfoQuery.error || contractConfigQuery.error,
              },
            },
            {
              title: 'Lock end',
              isLabel: true,
              value: lockInfo?.lockedUntil
                ? lockInfo.lockedUntil.toLocaleString()
                : undefined,
              query: lockInfoQuery,
            },
          ],
        ]}
        action={{
          title: 'Unlock',
          loading: unlockLoading,
          loadingText: 'Unlocking',
          onClick: unlock,
          disabled: unlockLoading,
        }}
      />
    </div>
  )
}

export default Unlock
