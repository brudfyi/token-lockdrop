import React from 'react'
// @ts-ignore
import * as fcl from '@onflow/fcl'

import './Header.css'

import {User} from '../../types'
import Button from '../Button/Button'

type HeaderProps = {
  user: User | null
}

const Header = ({user}: HeaderProps) => {
  return (
    <div className="header">
      {user?.loggedIn ? (
        <Button onClick={fcl.unauthenticate}>
          <span>{user?.addr ?? 'No address'}</span>
          <div className="v-separator" />
          <span>Log out</span>
        </Button>
      ) : (
        <Button onClick={fcl.authenticate}>Connect wallet</Button>
      )}
    </div>
  )
}

export default Header
