import {FlowNetwork} from './types'

const config = {
  flowNetwork: process.env.REACT_APP_FLOW_NETWORK as FlowNetwork,
  contractId: process.env.REACT_APP_CONTRACT_ID as string,
  rewardTokenSupply: process.env.REACT_APP_REWARD_TOKEN_SUPPLY as string,
  rewardTokenName: process.env.REACT_APP_REWARD_TOKEN_NAME as string,
}

export default config
