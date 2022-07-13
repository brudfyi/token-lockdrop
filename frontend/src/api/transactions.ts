// @ts-ignore
import * as fcl from '@onflow/fcl'

import contract from 'contract'
import type {LockParams} from './types'

export const lock = async ({amount, lockDuration, lockWeight}: LockParams) => {
  const transactionId = await fcl.mutate({
    cadence: contract.transactions.lock,
    args: (arg: any, t: any) => [
      arg(amount, t.UFix64),
      arg(lockDuration, t.Int),
      arg(lockWeight, t.Int),
    ],
    proposer: fcl.currentUser().authorization,
    payer: fcl.currentUser().authorization,
    authorizations: [fcl.currentUser().authorization],
    limit: 5000,
  })

  const transaction = await fcl.tx(transactionId).onceSealed()
  // eslint-disable-next-line no-console
  console.log(transaction)
}

export const unlock = async () => {
  const transactionId = await fcl.mutate({
    cadence: contract.transactions.unlock,
    proposer: fcl.currentUser().authorization,
    payer: fcl.currentUser().authorization,
    authorizations: [fcl.currentUser().authorization],
    limit: 5000,
  })

  const transaction = await fcl.tx(transactionId).onceSealed()
  // eslint-disable-next-line no-console
  console.log(transaction)
}
