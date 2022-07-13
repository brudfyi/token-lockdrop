import React, {useEffect, useState} from 'react'
import BigNumber from 'bignumber.js'

import {useGetBalance, useLock, useGetContractConfig} from '../../../api'
import {FlowAddress} from '../../../types'
import config from '../../../config'
import {useGetRewardStats} from '../../../hooks'
import ContentBlock from './ContentBlock/ContentBlock'
import {Input, SelectInput} from '../../../components'
import {formatDistanceStrict} from 'date-fns'

type LockProps = {
  address: FlowAddress
}

const Lock = ({address}: LockProps) => {
  const {data: balance, ...balanceQuery} = useGetBalance(address)
  const {mutateAsync: lock, isLoading: lockLoading} = useLock(address)
  const {data: contractConfig, ...contractConfigQuery} = useGetContractConfig()
  const [amount, setAmount] = useState('')
  const [lockDuration, setlockDuration] = useState('')
  const {userWeight, rewardEstimate} = useGetRewardStats(
    new BigNumber(amount || 0),
    Number(lockDuration || 0),
  )

  // Set selected lock duration after contract config loads
  useEffect(() => {
    const lockDuration =
      contractConfig?.lockDurationsRewardFactors &&
      Object.keys(contractConfig.lockDurationsRewardFactors)[0]

    if (lockDuration) {
      setlockDuration(lockDuration)
    }
  }, [contractConfig?.lockDurationsRewardFactors])

  const onAmountChange = (value: string) => {
    if (!value || value.match(/^\d{1,}(\.\d{0,4})?$/)) {
      setAmount(value)
    }
  }

  const onSubmit = (value: string) => {
    let result = null
    try {
      // Ensure the value has a decimal point before submitting
      const float = Number.parseFloat(value)
      const floatString = float.toString()
      result = floatString.includes('.') ? floatString : float.toFixed(1)
    } catch {
      return // Do not submit on error
    }

    if (result) {
      const lockParams = {
        amount: result,
        lockDuration,
        lockWeight: userWeight.toString(),
      }
      lock(lockParams)
    }
  }

  return (
    <ContentBlock
      values={[
        [
          {
            title: 'Available',
            value: balance ? `${balance} FLOW` : undefined,
            query: balanceQuery,
          },
        ],
      ]}
      action={{
        title: 'Lock',
        loading: lockLoading,
        loadingText: 'Locking',
        onClick: () => onSubmit(amount),
        disabled: !amount || lockLoading || contractConfigQuery.isLoading,
        actionColComponent: (
          <div className="mb-3">
            <div className="input-container">
              <SelectInput
                value={lockDuration}
                onChange={(e) => setlockDuration(e.target.value)}
                label="Lock duration"
                loading={contractConfigQuery.isLoading}
                options={
                  contractConfig
                    ? Object.keys(
                        contractConfig.lockDurationsRewardFactors,
                      ).map((seconds) => ({
                        value: seconds,
                        label: formatDistanceStrict(0, Number(seconds) * 1000),
                      }))
                    : []
                }
              />
            </div>
            <div className="input-container">
              <Input
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                label="Amount FLOW"
                placeholder="0.00"
              />
            </div>
            <div className="input-container">
              <Input
                value={(rewardEstimate !== undefined
                  ? rewardEstimate
                  : 0
                ).toFixed(2)}
                onChange={() => {}}
                label={`Estimated ${config.rewardTokenName} rewards`}
                disabled
              />
            </div>
          </div>
        ),
      }}
    />
  )
}

export default Lock
