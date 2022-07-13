import {
  emulator,
  getAccountAddress,
  getFlowBalance,
  setTimestampOffset,
} from 'flow-js-testing'
import {
  deployTokenTimeLockContract,
  sendFundAccountTransaction,
  sendLockFlowTransaction,
  sendUnlockFlowTransaction,
  executeGetLockedInfoScript,
  executeGetLockContractConfig,
  setupFlowEmulator,
  LOCK_DURATION_REWARD_FACTORS,
} from './utils'

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000)

describe('FlowTokenTimeLock', () => {
  beforeEach(async () => {
    await setupFlowEmulator()
  })

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    await emulator.stop()
  })

  it('should deploy FlowTokenTimeLock contract', async () => {
    await deployTokenTimeLockContract()
  })

  it('should successfully retrieve contract params', async () => {
    await deployTokenTimeLockContract()
    const result = await executeGetLockContractConfig()

    expect(result).toEqual({
      lockDurationsRewardFactors: LOCK_DURATION_REWARD_FACTORS,

      lockPeriodStart: (result as unknown as any).lockPeriodStart,
      minLockableFlowAmount: '0.10000000',
    })
  })

  it('should successfully lock 0.5 FLOW', async () => {
    await deployTokenTimeLockContract()
    const user = (await getAccountAddress('Alice')) as string
    await sendFundAccountTransaction(user, 10)
    await sendLockFlowTransaction(user, '0.5', '259200')
    expect((await getFlowBalance(user))[0]).toEqual('9.50100000')
    expect((await executeGetLockedInfoScript(user)).amount).toEqual(
      '0.50000000',
    )
  })

  it('should successfully unlock 0.5 FLOW', async () => {
    await deployTokenTimeLockContract()
    const user = (await getAccountAddress('Alice')) as string
    await sendFundAccountTransaction(user, 10)
    await sendLockFlowTransaction(user, '0.5', '259200')
    await setTimestampOffset(3600000 + 259200)
    await sendUnlockFlowTransaction(user)
    expect((await getFlowBalance(user))[0]).toEqual('10.00100000')
  })
})
