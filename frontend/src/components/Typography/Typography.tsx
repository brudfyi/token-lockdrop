import React from 'react'

import './Typography.css'

type TypographyVariant = 'title' | 'label' | 'body'

type TypographyProps = {
  variant?: TypographyVariant
  children?: React.ReactNode
}

const Typography = ({variant = 'body', children}: TypographyProps) => {
  return variant === 'title' ? (
    <div className="title">{children}</div>
  ) : variant === 'label' ? (
    <div className="label">{children}</div>
  ) : (
    <div className="body">{children}</div>
  )
}

export default Typography
