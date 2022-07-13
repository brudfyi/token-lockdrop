import React from 'react'

import './Content.css'
import {Header} from '../../../components'
import {User} from '../../../types'
import ConnectedContent from '../ConnectedContent/ConnectedContent'
import DisconnectedContent from '../DisconnectedContent'

type ContentProps = {
  user: User | null
}

const Content = ({user}: ContentProps) => {
  return (
    <div className="layout">
      <Header user={user} />
      <main className="content">
        {user?.loggedIn ? (
          <ConnectedContent address={user.addr} />
        ) : (
          <DisconnectedContent />
        )}
      </main>
    </div>
  )
}

export default Content
