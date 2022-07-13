import BigNumber from 'bignumber.js'

export type User = {
  loggedIn: boolean
  addr: FlowAddress
}

export type NewType<name extends string, base = string> = base & {
  [_ in `__NewType_${name}`]: undefined
}

export type FlowNetwork = 'mainnet' | 'testnet'

export type FlowAddress = NewType<'FlowAddress'>

export type Nanoflow = NewType<'Nanoflow', BigNumber>
