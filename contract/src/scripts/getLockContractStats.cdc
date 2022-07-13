import FlowTokenTimeLockV6 from "../contracts/FlowTokenTimeLock.cdc"

pub fun main(): {String: AnyStruct} {
  return {
    "totalLockedFlow": FlowTokenTimeLockV6.totalLockedFlowAmount,
    "totalLockedWeight": FlowTokenTimeLockV6.totalLockedWeight
  }
}
