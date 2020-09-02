import React from 'react'
import { calculateCash } from '../lib/Utils'

const CurrentOutput = ({
  price = 0,
  current = { value: 0, unit: `kW`},
  capacity = 0
}) => {
  return (
    <>
      <p>
        {current.value}{current.unit}
      </p>
      <p>
        {calculateCash(price, current.value)}/h
      </p>
      <p>
        {capacity === 0 ? 0 : (current.value / capacity * 100).toFixed(2)}%
      </p>
    </>
  )
}

export default CurrentOutput