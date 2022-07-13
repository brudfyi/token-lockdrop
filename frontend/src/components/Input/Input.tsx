import React, {ChangeEventHandler} from 'react'
import Typography from '../Typography/Typography'

import './Input.css'

type InputProps = {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement> | (() => void)
  label: string
  placeholder?: string
  disabled?: boolean
}

const Input = ({value, onChange, label, placeholder, disabled}: InputProps) => {
  return (
    <div>
      <div className="label-container">
        <Typography variant="label">{label}</Typography>
      </div>
      <input
        className={`input ${disabled ? 'disabled-input' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export default Input
