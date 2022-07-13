import FlowTokenTimeLockV6 from "../contracts/FlowTokenTimeLock.cdc"
import FlowToken from "../contracts/standard/FlowToken.cdc"

transaction(amount: UFix64, lockDuration: Int, lockWeight: Int) {
  prepare(acct: AuthAccount) {

    if acct.borrow<&FlowTokenTimeLockV6.TokenTimeLockManager>(from: FlowTokenTimeLockV6.lockedTokenStoragePath) != nil {
      panic("Locked token vault already exists")
    }

    let flowVaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
        ?? panic("Could not borrow a reference to the owner's vault")
    let temporaryVault <- flowVaultRef.withdraw(amount: amount) as! @FlowToken.Vault

    acct.save(
      <-FlowTokenTimeLockV6.createFlowTokenTimeLockManager(),
      to: FlowTokenTimeLockV6.lockedTokenStoragePath
    )

    let lockedVaultRef = acct.borrow<&FlowTokenTimeLockV6.TokenTimeLockManager>(from: FlowTokenTimeLockV6.lockedTokenStoragePath)
        ?? panic("Could not borrow a reference to the owner's locked vault")

    lockedVaultRef.lock(vault: <-temporaryVault, lockDuration: lockDuration, lockWeight: lockWeight)

    acct.link<&FlowTokenTimeLockV6.TokenTimeLockManager{FlowTokenTimeLockV6.TokenTimeLockManagerPublic}>(
        FlowTokenTimeLockV6.lockedTokensPublicPath,
        target: FlowTokenTimeLockV6.lockedTokenStoragePath
    )
  }
}
