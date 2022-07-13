import {emulator} from 'flow-js-testing'
import {deployTokenTimeLockContract, setupFlowEmulator} from './utils'

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000)

describe('Deploy', () => {
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
})
