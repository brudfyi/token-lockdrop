import {getLockWeight} from './utils'

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000)

describe('Deploy', () => {
  it('should compute correct lock weight for 1 NanoFlow (factor = 1)', async () => {
    expect(
      getLockWeight('0.00000001', {numerator: 1, denominator: 1}).toString(),
    ).toEqual('1')
  })

  it('should compute correct lock weight for 25 NanoFlow (factor = 1)', async () => {
    expect(
      getLockWeight('0.00000025', {numerator: 1, denominator: 1}).toString(),
    ).toEqual('5')
  })

  it('should compute correct lock weight for 25 NanoFlow (factor = 2)', async () => {
    expect(
      getLockWeight('0.00000025', {numerator: 2, denominator: 1}).toString(),
    ).toEqual('10')
  })

  it('should compute correct lock weight for 25 NanoFlow (factor = 0.5)', async () => {
    expect(
      getLockWeight('0.00000025', {numerator: 1, denominator: 2}).toString(),
    ).toEqual('3')
  })

  it('should compute correct lock weight for 1 Flow (factor = 1.5)', async () => {
    expect(
      getLockWeight('1.0', {numerator: 3, denominator: 2}).toString(),
    ).toEqual('15000')
  })

  it('should compute correct lock weight for 100 Flow (factor = 1.5)', async () => {
    expect(
      getLockWeight('100.0', {numerator: 3, denominator: 2}).toString(),
    ).toEqual('150000')
  })
})
