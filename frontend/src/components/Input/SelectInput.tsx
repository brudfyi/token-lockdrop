import React, {ChangeEventHandler} from 'react'
import Loading from '../Loading/Loading'
import Typography from '../Typography/Typography'

type SelectInputProps = {
  value: string
  onChange: ChangeEventHandler<HTMLSelectElement>
  label: string
  options: {value: string; label: string}[]
  loading: boolean
}

const SelectInput = ({
  value,
  onChange,
  label,
  options,
  loading,
}: SelectInputProps) => {
  return (
    <div>
      <div className="label-container">
        <Typography variant="label">{label}</Typography>
      </div>
      {loading ? (
        <div className="input select-loading">
          <Loading small />
        </div>
      ) : (
        <div className="select-container">
          <select
            className="input pr-4 select"
            onChange={onChange}
            value={value}
          >
            {options.map(({value, label}) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default SelectInput
