# Flow Lock contract

This folder contains the Flow smart contract used to let the users lock their FLOW tokens in exchange for reward tokens (to be distributed off-chain after the lock drop ends)

## Prerequisites

1. [Install the Flow CLI](https://docs.onflow.org/docs/cli)

## Build & update transactions/scripts to be used in dApp code

Run `yarn workspace contract build` in order to update the `lib/CadenceToJson.json` file which is symlinked from the frontend repo's package.json (i.e. changes will automatically propagate to the frontend repo).

## Deploy to emulator

Run `yarn workspace contract emulator:deploy`

# Testing

## Unit tests

Run contract unit tests with `yarn test:unit`

## Basic check of the contract against the emulator

1. `yarn emulator:start` will run everything needed to try lock/unlock txs (run emulator, set contract, create/fund test account
2. `yarn emulator:tx:lock` locks 0.5 of flow
3. `yarn emulator:tx:unlock:` unlocks
4. `yarn emulator:script:get:account` for checking balance
5. `yarn emulator:script:get:locked` for getting the lock info

# Deploy to testnet

To deploy testnet contracts to accounts defined in the `flow.json`, run

`cd contract`
`TESTNET_TOKEN_TIME_LOCK_ADMIN=<private key> yarn testnet:contract:deploy`

This will deploy the current contract defined in the `FlowTokenTimeLock.cdc` file, note that if the contract under the the same name as is defined in the `FlowTokenTimeLock.cdc` already exists, the contract will be updated. If you wish to deploy a new contract with a separate state, you will have to rename the contract defined in that file (and update its references in scripts/transactions/etc).
