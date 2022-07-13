import FlowTokenTimeLockV6 from "../contracts/FlowTokenTimeLock.cdc"

pub fun main(acct: Address): {String: AnyStruct} {
  let lockedTokensRef = getAccount(acct)
      .getCapability(FlowTokenTimeLockV6.lockedTokensPublicPath)
      .borrow<&FlowTokenTimeLockV6.TokenTimeLockManager{FlowTokenTimeLockV6.TokenTimeLockManagerPublic}>()

  return {
    "lockedUntil": lockedTokensRef?.lockedUntil,
    "weight": FlowTokenTimeLockV6.getAddressLockWeight(address: acct),
    "duration": lockedTokensRef?.lockDuration,
    "balance": lockedTokensRef?.getBalance(),
    "amount": lockedTokensRef?.lockAmount,
    "lockedAt": lockedTokensRef?.lockedAt,
    "unlockedAt": lockedTokensRef?.unlockedAt
  }
}
