import path from 'path'
import {
  emulator,
  init,
  getServiceAddress,
  getContractCode,
} from 'flow-js-testing'
import {
  deployContractWithErrorRaised,
  getLockedTokenAdminAddress,
  sendTransactionWithErrorRaised,
  executeScriptWithErrorRaised,
  toUFix64,
} from './common'
import {getLockWeight} from './rewardCalculation'
import {LOCK_DURATION_REWARD_FACTORS} from './constants'

export * from './rewardCalculation'
export * from './constants'

export const setupFlowEmulator = async () => {
  const basePath = path.resolve(__dirname, '../../')
  // You can specify different port to parallelize execution of describe blocks
  const port = 8080
  // Setting logging flag to true will pipe emulator output to console
  const logging = false

  await init(basePath, {
    port,
  })
  await emulator.start(port, {logging, flags: '--config-path=../flow.json'})
}

export const deployTokenTimeLockContract = async () => {
  const adminAddress = await getLockedTokenAdminAddress()

  const code = await getContractCode({
    name: 'FlowTokenTimeLock',
    addressMap: {},
  })

  return await deployContractWithErrorRaised({
    to: adminAddress,
    name: 'FlowTokenTimeLockV6',
    code,
  })
}

export const sendFundAccountTransaction = async (
  account: any,
  flowAmount: number,
) => {
  const serviceAccount = await getServiceAddress()

  return await sendTransactionWithErrorRaised({
    name: 'transferFlow',
    args: [toUFix64(flowAmount), account],
    signers: [serviceAccount],
  })
}

export const sendLockFlowTransactionRaw = async (
  account: string,
  flowAmount: string,
  lockType: string,
  lockWeight: number,
) => {
  return await sendTransactionWithErrorRaised({
    name: 'lock',
    args: [toUFix64(flowAmount), Number(lockType), lockWeight],
    signers: [account],
  })
}

export const sendLockFlowTransaction = async (
  account: string,
  flowAmount: string,
  lockType: keyof typeof LOCK_DURATION_REWARD_FACTORS,
) => {
  return await sendLockFlowTransactionRaw(
    account,
    flowAmount,
    lockType,
    getLockWeight(
      flowAmount,
      LOCK_DURATION_REWARD_FACTORS[lockType],
    ).toNumber(),
  )
}

export const sendUnlockFlowTransaction = async (account: string) => {
  return await sendTransactionWithErrorRaised({
    name: 'unlock',
    signers: [account],
  })
}

export const executeGetLockedInfoScript = async (
  account: string,
): Promise<any> => {
  return await executeScriptWithErrorRaised({
    name: 'getLockedInfo',
    args: [account],
  })
}

export const executeGetLockContractConfig = async (): Promise<
  [[Record<string, string>], string, string]
> => {
  return await executeScriptWithErrorRaised({
    name: 'getLockContractConfig',
    args: [],
  })
}

export const executeGetLockContractStatsScript = async (): Promise<
  [[Record<string, string>], string, string]
> => {
  return await executeScriptWithErrorRaised({
    name: 'getLockContractStats',
    args: [],
  })
}

export const executeGetAddressLockWeightsScript = async (): Promise<any> => {
  return await executeScriptWithErrorRaised({
    name: 'getAddressLockWeights',
    args: [],
  })
}
