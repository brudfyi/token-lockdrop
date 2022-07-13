import BigNumber from 'bignumber.js'
import {Nanoflow} from './types'

const getBlockchainDecimals = () => 8

const getAssetBase = (): BigNumber =>
  new BigNumber(10).pow(getBlockchainDecimals())

const assetBaseUnitToMain = (amount: BigNumber): string => {
  return amount.dividedBy(getAssetBase()).toFixed()
}

const assetMainToBaseUnit = (amount: string): BigNumber => {
  return new BigNumber(amount).multipliedBy(getAssetBase())
}

export function nanoFlowToFlow(nanoFlow: Nanoflow): string {
  return assetBaseUnitToMain(nanoFlow)
}

export function flowToNanoflow(flow: string): Nanoflow {
  return assetMainToBaseUnit(flow) as Nanoflow
}
