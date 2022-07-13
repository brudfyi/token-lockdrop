import FlowTokenTimeLockV6 from "../contracts/FlowTokenTimeLock.cdc"

pub fun main(): {String: AnyStruct} {
  return {
    "weight": FlowTokenTimeLockV6.getAddressLockWeights()
  }
}
