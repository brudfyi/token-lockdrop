import React from 'react'

import './ConnectedContent.css'
import {FlowAddress} from '../../../types'
import {Toast} from '../../../components'
import Lock from './Lock'
import Unlock from './Unlock'

type ConnectedContentProps = {
  address: FlowAddress
}

const ConnectedContent = ({address}: ConnectedContentProps) => {
  return (
    <>
      <div className="content-row">
        <Lock address={address} />
        <div className="mr-3" />
        <Unlock address={address} />
      </div>
      <Toast />
    </>
  )
}

export default ConnectedContent
