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
  setupFlowEmulator,
  getLockWeight,
  LOCK_DURATION_REWARD_FACTORS,
  sendLockFlowTransactionRaw,
} from './utils'

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000)

describe('Transactions', () => {
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

  describe('Lock', () => {
    it('should successfully lock 0.5 FLOW', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      expect((await getFlowBalance(user))[0]).toEqual('9.50100000')
      expect((await executeGetLockedInfoScript(user)).amount).toEqual(
        '0.50000000',
      )
    })
    it('should successfully lock with 0.5 FLOW with reward factor', async () => {
      await sendLockFlowTransaction(user, '0.5', '2592000')
      expect((await getFlowBalance(user))[0]).toEqual('9.50100000')
      expect((await executeGetLockedInfoScript(user)).amount).toEqual(
        '0.50000000',
      )
    })
    it('should fail when locking more than available', async () => {
      expect(
        async () => await sendLockFlowTransaction(user, '11.0', '2592000'),
      ).rejects.toThrow()
    })
    it('should fail when provided incorrect weight', async () => {
      expect(
        async () => await sendLockFlowTransactionRaw(user, '0.5', '2592000', 1),
      ).rejects.toThrow()
    })
    it('should fail when provided lower boundary weight', async () => {
      expect(
        async () =>
          await sendLockFlowTransactionRaw(
            user,
            '0.5',
            '2592000',
            getLockWeight(
              '0.5',
              LOCK_DURATION_REWARD_FACTORS['2592000'],
            ).toNumber() - 1,
          ),
      ).rejects.toThrow()
    })
    it('should fail when provided higher boundary weight', async () => {
      expect(
        async () =>
          await sendLockFlowTransactionRaw(
            user,
            '0.5',
            '2592000',
            getLockWeight(
              '0.5',
              LOCK_DURATION_REWARD_FACTORS['2592000'],
            ).toNumber() + 1,
          ),
      ).rejects.toThrow()
    })
    it('should fail when provided incorrect lock period', async () => {
      expect(
        async () =>
          await sendLockFlowTransactionRaw(
            user,
            '0.5',
            '2592001',
            getLockWeight(
              '0.5',
              LOCK_DURATION_REWARD_FACTORS['2592000'],
            ).toNumber(),
          ),
      ).rejects.toThrow()
    })
    it('should fail when amount less then minimum', async () => {
      expect(
        async () => await sendLockFlowTransaction(user, '0.01', '2592000'),
      ).rejects.toThrow()
    })
    it('should fail if locking period has already ended', async () => {
      await setTimestampOffset(3600000 + 5000)
      expect(
        async () => await sendLockFlowTransaction(user, '0.5', '259200'),
      ).rejects.toThrow()
    })
    it('should fail if there already is a token time lock', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      expect(
        async () => await sendLockFlowTransaction(user, '0.5', '259200'),
      ).rejects.toThrow()
    })
  })

  describe('Unlock', () => {
    it('should successfully unlock 0.5 FLOW', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      await setTimestampOffset(3600000 + 259200)
      await sendUnlockFlowTransaction(user)
      expect((await getFlowBalance(user))[0]).toEqual('10.00100000')
    })
    it('should fail before lock end', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      expect(
        async () => await sendUnlockFlowTransaction(user),
      ).rejects.toThrow()
    })
    it('should fail if there are no locked tokens', async () => {
      expect(
        async () => await sendUnlockFlowTransaction(user),
      ).rejects.toThrow()
    })
    it('should fail if tokens have already been unlocked', async () => {
      await sendLockFlowTransaction(user, '0.5', '259200')
      await setTimestampOffset(3600000 + 259200)
      await sendUnlockFlowTransaction(user)
      expect(
        async () => await sendUnlockFlowTransaction(user),
      ).rejects.toThrow()
    })
  })
})
