import FlowTokenTimeLockV6 from "../contracts/FlowTokenTimeLock.cdc"
import FlowToken from "../contracts/standard/FlowToken.cdc"

transaction() {
  prepare(acct: AuthAccount) {
    let lockedVaultRef = acct.borrow<&FlowTokenTimeLockV6.TokenTimeLockManager>(from: FlowTokenTimeLockV6.lockedTokenStoragePath)
        ?? panic("Could not borrow a reference to the owner's locked vault")

    lockedVaultRef.unlock()
  }
}
