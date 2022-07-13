import FungibleToken from "./standard/FungibleToken.cdc"
import FlowToken from "./standard/FlowToken.cdc"

pub contract FlowTokenTimeLockV6 {

    pub event TokensLocked(amount: UFix64, lockDuration: Int, lockWeight: Int, rewardFactor: {String: Int}, from: Address, lockedUntil: UFix64, resourceUuid: UInt64)
    pub event TokensUnlocked(amount: UFix64, from: Address, resourceUuid: UInt64)

    pub let lockedTokenStoragePath: StoragePath
    pub let lockedTokensPublicPath: PublicPath

    pub var totalLockedFlowAmount: UFix64
    pub var totalLockedWeight: Int
    access(account) let addressLockWeights: {Address: Int}

    pub let lockDurationsRewardFactors: {Int: {String: Int}}
    pub let lockPeriodStart: UFix64

    pub let nanoflowFactor: UInt64
    pub let minLockableFlowAmount: UFix64

    pub fun getAddressLockWeight(address: Address): Int? {
      return self.addressLockWeights[address]
    }

    pub fun getAddressLockWeights(): {Address: Int} {
      return self.addressLockWeights
    }

    access(contract) fun getLockedUntil(lockDuration: Int): UFix64 {
      return self.lockPeriodStart + UFix64(lockDuration)
    }

    pub fun square(_ n: Int): Int {
      return n * n
    }

    pub fun uFix64ToInt(_ n: UFix64): Int {
      // UFix64 is not big enough to hold nanoflow so we have to convert everything to Int
      let wholePart: Int = Int(n) * Int(self.nanoflowFactor)
      let decimalPart = Int((n - UFix64(Int(n))) * UFix64(self.nanoflowFactor))
      return wholePart + decimalPart
    }

    pub fun isLockWeightCorrect(amount: UFix64, lockWeight: Int, lockDurationRewardFactor: {String: Int}): Bool {
      let nanoflowAmount: Int = self.uFix64ToInt(amount)
      let rewardFactorNumeratorSquared = self.square(lockDurationRewardFactor["numerator"]!)
      let rewardFactorDenominatorSquared = self.square(lockDurationRewardFactor["denominator"]!)

      // weight = sqrt(nanoflowAmount) * rewardFactor = sqrt(nanoflowAmount * rewardFactor^2)
      // weight = sqrt(nanoflowAmount * rewardFactor^2)
      // weight^2 = nanoflowAmount * rewardFactor^2
      // rewardFactor^2 = rewardFactorNumerator^2 / rewardFactorDenominator^2
      // weight^2 = nanoflowAmount * rewardFactorNumerator^2 / rewardFactorDenominator^2
      // weight^2 * rewardFactorDenominator^2 = nanoflowAmount * rewardFactorNumerator^2

      // inequalities below verify that the weight supplied, is between the integer ceiling and floor of the real decimal weight
      return self.square(lockWeight) * rewardFactorDenominatorSquared >= nanoflowAmount * rewardFactorNumeratorSquared
        && self.square(lockWeight - 1) * rewardFactorDenominatorSquared < nanoflowAmount * rewardFactorNumeratorSquared
    }

    access(contract) fun recordLock(address: Address, amount: UFix64, lockWeight: Int) {

      pre {
        FlowTokenTimeLockV6.addressLockWeights.containsKey(address) == false: "Tokens have already been locked"
      }

      // add to total locked flow amount
      FlowTokenTimeLockV6.totalLockedFlowAmount = FlowTokenTimeLockV6.totalLockedFlowAmount + amount

      // add to total lock weight
      FlowTokenTimeLockV6.totalLockedWeight = FlowTokenTimeLockV6.totalLockedWeight + lockWeight

      // store weight for address
      FlowTokenTimeLockV6.addressLockWeights.insert(key: address, lockWeight)
    }

    pub resource interface TokenTimeLockManagerPublic {
      pub var lockedUntil: UFix64?
      pub var lockDuration: Int?
      pub var lockedAt: UFix64?
      pub var unlockedAt: UFix64?
      pub var lockAmount: UFix64?
      pub fun getBalance(): UFix64?
      pub fun unlock()
    }

    pub resource TokenTimeLockManager: TokenTimeLockManagerPublic {
        access(self) var vault: @FlowToken.Vault?
        pub var lockedUntil: UFix64?
        pub var lockDuration: Int?
        pub var lockedAt: UFix64?
        pub var unlockedAt: UFix64?
        pub var lockAmount: UFix64?

        init () {
          self.vault <- nil
          self.lockedUntil = nil
          self.lockDuration = nil
          self.lockedAt = nil
          self.unlockedAt = nil
          self.lockAmount = nil
        }

        pub fun lock(vault: @FlowToken.Vault, lockDuration: Int, lockWeight: Int) {

          pre {
            self.vault == nil: "Tokens are already locked"
            self.owner?.address != nil: "Resource must be owned to lock tokens in it"

            FlowTokenTimeLockV6.lockDurationsRewardFactors.containsKey(lockDuration): "Invalid lock interval"
            FlowTokenTimeLockV6.lockPeriodStart > getCurrentBlock().timestamp: "Locking period has ended"
            FlowTokenTimeLockV6.minLockableFlowAmount <= vault.balance: "Lock amount is less than minimum"

            FlowTokenTimeLockV6.isLockWeightCorrect(
              amount: vault.balance,
              lockWeight: lockWeight,
              lockDurationRewardFactor: FlowTokenTimeLockV6.lockDurationsRewardFactors[lockDuration]!
            ): "Lock weight is not correct"
          }

          self.lockDuration = lockDuration

          let amount = vault.balance
          self.vault <-! vault

          let lockedUntil = FlowTokenTimeLockV6.getLockedUntil(lockDuration: lockDuration)
          self.lockedUntil = lockedUntil

          let ownerAddress = self.owner?.address!
          FlowTokenTimeLockV6.recordLock(address: ownerAddress, amount: amount, lockWeight: lockWeight)

          self.lockedAt = getCurrentBlock().timestamp
          self.lockAmount = amount

          emit TokensLocked(
            amount: amount,
            lockDuration: lockDuration,
            lockWeight: lockWeight,
            rewardFactor: FlowTokenTimeLockV6.lockDurationsRewardFactors[lockDuration]!,
            from: ownerAddress,
            lockedUntil: lockedUntil,
            resourceUuid: self.uuid
          )
        }

        pub fun getBalance(): UFix64? {
          return self.vault?.balance
        }

        pub fun unlock() {

          pre {
            self.vault != nil: "There are no locked tokens"
            self.lockedUntil! < getCurrentBlock().timestamp: "Tokens are locked"
          }

          let amount = self.vault?.balance!
          let tempVault <- self.vault <- nil

          let ownerAddress = self.owner?.address!
          let receiverRef = getAccount(ownerAddress)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()!

          receiverRef.deposit(from: <- tempVault!)

          self.unlockedAt = getCurrentBlock().timestamp
          emit TokensUnlocked(amount: amount, from: ownerAddress, resourceUuid: self.uuid)
        }

        destroy() {
          pre {
            self.vault == nil: "Tokens cannot be locked when destroying the manager"
          }
          destroy self.vault
        }
    }

    pub fun createFlowTokenTimeLockManager(): @TokenTimeLockManager {
      return <- create TokenTimeLockManager()
    }

    init() {
        self.totalLockedFlowAmount = 0.0
        self.totalLockedWeight = 0
        self.addressLockWeights = {}
        self.nanoflowFactor = 100000000
        self.minLockableFlowAmount = 0.1

        self.lockedTokenStoragePath = /storage/BrudStakedFlowV6
        self.lockedTokensPublicPath = /public/BrudStakedFlowV6

        self.lockDurationsRewardFactors = {
          259200: {
            "numerator": 1,
            "denominator": 1
          }, // 3 days
          604800: {
            "numerator": 11,
            "denominator": 10
          }, // 7 days
          1209600: {
            "numerator": 115,
            "denominator": 100
          }, // 14 days
          2592000: {
            "numerator": 13,
            "denominator": 10
          } // 30 days
        }
        self.lockPeriodStart = getCurrentBlock().timestamp + 3600000.0
    }
}
