import {emulator, getAccountAddress, setTimestampOffset} from 'flow-js-testing'
import {
  deployTokenTimeLockContract,
  executeGetAddressLockWeightsScript,
  executeGetLockContractConfig,
  executeGetLockContractStatsScript,
  executeGetLockedInfoScript,
  getLockWeight,
  LOCK_DURATION_REWARD_FACTORS,
  sendFundAccountTransaction,
  sendLockFlowTransaction,
  sendUnlockFlowTransaction,
  setupFlowEmulator,
} from './utils'

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000)

describe('Scripts', () => {
  let user: string
  beforeEach(async () => {
    await setupFlowEmulator()
    await deployTokenTimeLockContract()
    user = (await getAccountAddress('Alice')) as string
    await sendFundAccountTransaction(user, 10)
  })

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    await emulator.stop()
  })

  describe('Contract config', () => {
    it('should successfully retrieve contract config', async () => {
      const result = await executeGetLockContractConfig()

      expect(result).toEqual({
        lockDurationsRewardFactors: {
          '1209600': {
            denominator: 100,
            numerator: 115,
          },
          '259200': {
            denominator: 1,
            numerator: 1,
          },
          '2592000': {
            denominator: 10,
            numerator: 13,
          },
          '604800': {
            denominator: 10,
            numerator: 11,
          },
        },

        lockPeriodStart: (result as unknown as any).lockPeriodStart,
        minLockableFlowAmount: '0.10000000',
      })
    })
  })

  describe('Contract config', () => {
    it('should successfully retrieve contract stats', async () => {
      const result = await executeGetLockContractStatsScript()

      expect(result).toEqual({
        totalLockedFlow: '0.00000000',
        totalLockedWeight: 0,
      })
    })
    it('should update contract stats after lock', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      const result = await executeGetLockContractStatsScript()

      expect(result).toEqual({
        totalLockedFlow: '0.50000000',
        totalLockedWeight: 7072,
      })
    })
  })

  describe('Lock info', () => {
    it('should return nil lock info before locking', async () => {
      expect(await executeGetLockedInfoScript(user)).toEqual({
        lockedUntil: null,
        weight: null,
        duration: null,
        balance: null,
        amount: null,
        lockedAt: null,
        unlockedAt: null,
      })
    })
    it('should update lock info after locking', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      const result = await executeGetLockedInfoScript(user)
      expect(result.balance).toEqual('0.50000000')
      expect(result.amount).toEqual('0.50000000')
      expect(result.duration).toEqual(259200)
      expect(result.weight).toEqual(7072)
      expect(result.lockedUntil).toBeDefined()
      expect(result.unlockedAt).toEqual(null)
      expect(result.lockedAt).toBeDefined()
    })
    it('should get lock weights after locking', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      const result = await executeGetAddressLockWeightsScript()

      const expectedWeight = getLockWeight(
        '0.5',
        LOCK_DURATION_REWARD_FACTORS['259200'],
      ).toNumber()
      expect(result).toEqual({
        weight: {
          '0x179b6b1cb6755e31': expectedWeight,
        },
      })
    })
    it('should return nil lock info before locking', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      await setTimestampOffset(3600000 + 259200)
      await sendUnlockFlowTransaction(user)
      const result = await executeGetLockedInfoScript(user)
      expect(result.balance).toEqual(null)
      expect(result.amount).toEqual('0.50000000')
      expect(result.duration).toEqual(259200)
      expect(result.weight).toEqual(7072)
      expect(result.lockedUntil).toBeDefined()
      expect(result.unlockedAt).toBeDefined()
      expect(result.lockedAt).toBeDefined()
    })
  })
})
