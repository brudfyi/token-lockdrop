import React from 'react'

import './Loading.css'

type LoadingProps = {
  small?: boolean
}

const Loading = ({small}: LoadingProps) => {
  return <div className={`loading ${small ? 'loading-small' : ''}`}></div>
}

export default Loading
