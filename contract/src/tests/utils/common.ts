// source: https://github.com/Next-Decentrum/flow.momentable.ai/blob/0c2c6d5dda2a8dbce0f51934398e551bcbc68d12/cadence/tests/src/common.js

import BigNumber from 'bignumber.js'
import {
  getAccountAddress,
  deployContract,
  executeScript,
  sendTransaction,
  builtInMethods,
} from 'flow-js-testing'

const UFIX64_PRECISION = 8

// UFix64 values shall be always passed as strings
export const toUFix64 = (value: string | number) =>
  new BigNumber(value).toFixed(UFIX64_PRECISION)

export const getLockedTokenAdminAddress = async () => {
  const x = await getAccountAddress('emulator-account')
  return x
}

export const sendTransactionWithErrorRaised = async (
  ...props: Parameters<typeof sendTransaction>
) => {
  const [resp, err] = await sendTransaction({
    // transformers needed to patch block timestamp/height with a function
    // that reacts to the block/time offset set in unit tests
    // see https://github.com/onflow/flow-js-testing/blob/master/docs/api.md#setblockoffsetoffset
    transformers: [builtInMethods],
    ...props[0],
  })
  if (err) {
    throw err
  }
  return resp
}

export const executeScriptWithErrorRaised = async (
  ...props: Parameters<typeof executeScript>
) => {
  const [resp, err] = await executeScript({
    // transformers needed to patch block timestamp/height with a function
    // that reacts to the block/time offset set in unit tests
    // see https://github.com/onflow/flow-js-testing/blob/master/docs/api.md#setblockoffsetoffset
    transformers: [builtInMethods],
    ...props[0],
  })
  if (err) {
    throw err
  }
  return resp
}

export const deployContractWithErrorRaised = async (
  ...props: Parameters<typeof deployContract>
) => {
  const [resp, err] = await deployContract({
    ...props[0],
    // builtInMethods (transformers) needed to patch block timestamp/height with a function
    // that reacts to the block/time offset set in unit tests
    // see https://github.com/onflow/flow-js-testing/blob/master/docs/api.md#setblockoffsetoffset
    ...{code: await builtInMethods(props[0].code)},
  })
  if (err) {
    throw err
  }
  return resp
}
