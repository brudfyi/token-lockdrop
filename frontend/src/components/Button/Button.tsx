import React from 'react'

import './Button.css'
import Loading from '../Loading/Loading'

type ButtonProps = {
  onClick: (...args: any) => unknown
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  children?: React.ReactNode
}

const Button = ({
  onClick,
  loading,
  loadingText,
  disabled,
  children,
}: ButtonProps) => {
  return (
    <button className="button" disabled={disabled} onClick={onClick}>
      {loading ? (
        <>
          <div className="loading-text">{loadingText || null}</div>
          <Loading small />
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
