import FlowTokenTimeLockV6 from "../contracts/FlowTokenTimeLock.cdc"

pub fun main(): {String: AnyStruct} {
  return {
    "lockDurationsRewardFactors": FlowTokenTimeLockV6.lockDurationsRewardFactors,
    "lockPeriodStart": FlowTokenTimeLockV6.lockPeriodStart,
    "minLockableFlowAmount": FlowTokenTimeLockV6.minLockableFlowAmount
  }
}
