import BigNumber from 'bignumber.js'

export type NewType<name extends string, base = string> = base & {
  [_ in `__NewType_${name}`]: undefined
}

export type Nanoflow = NewType<'Nanoflow', BigNumber>
