import React from 'react'
import {QueryClientProvider} from 'react-query'

import './App.css'
import {useConfig, useCurrentUser} from './hooks'
import {queryClient} from './api'
import Content from './pages/main/Content/Content'

const App = () => {
  useConfig()
  const user = useCurrentUser()

  return (
    <QueryClientProvider client={queryClient}>
      <Content user={user} />
    </QueryClientProvider>
  )
}

export default App
