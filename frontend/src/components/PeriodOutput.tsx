import React from 'react'
import { calculateCash } from '../lib/Utils'

const PeriodOutput = ({
  period = {
    unit: `kWh`,
    value: 0
  },
  price = 0
}) => {
  return (
    <>
      <p>{period.value}{period.unit}</p>
      <p>{calculateCash(price, period.value)}</p>
    </>
  )
}

export default PeriodOutput