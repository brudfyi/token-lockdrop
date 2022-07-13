export const FLOW_DECIMALS = 8
export const LOCK_DURATION_REWARD_FACTORS = {
  // 3 days
  '259200': {
    denominator: 1,
    numerator: 1,
  },
  // 7 days
  '604800': {
    denominator: 10,
    numerator: 11,
  },
  // 14 days
  '1209600': {
    denominator: 100,
    numerator: 115,
  },
  // 30 days
  '2592000': {
    denominator: 10,
    numerator: 13,
  },
}
