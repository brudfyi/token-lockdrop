import BigNumber from 'bignumber.js'
import {FLOW_DECIMALS} from './constants'
import {Nanoflow} from './types'

const getAssetBase = (): BigNumber => new BigNumber(10).pow(FLOW_DECIMALS)

const assetMainToBaseUnit = (amount: string): BigNumber => {
  return new BigNumber(amount).multipliedBy(getAssetBase())
}

function flowToNanoflow(flow: string): Nanoflow {
  return assetMainToBaseUnit(flow) as Nanoflow
}

export const getLockWeight = (
  flowAmount: string,
  rewardFactor: {numerator: number; denominator: number},
): BigNumber => {
  const nanoflowAmount = flowToNanoflow(flowAmount)

  return new BigNumber(rewardFactor.numerator)
    .times(nanoflowAmount.sqrt())
    .dividedBy(new BigNumber(rewardFactor.denominator))
    .integerValue(BigNumber.ROUND_CEIL)
}
