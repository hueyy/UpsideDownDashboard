import React from 'react'
import useCurrentInverterData from '../../hooks/useCurrentInverterData'
import './Dashboard.scss'

const calculateCash = (price, value) => `$${
  (price * value).toFixed(2)
}`

const Dashboard = () => {
  const { status, data: inverterData, error } = useCurrentInverterData()
  return (
    <div className="dashboard-page container">
      {
        status === `loading` ? (
          `Loading...`
        ) : status === `error` ? (
          JSON.stringify(error)
        ) : (
          <>
            <div className="aggregate-data">
              <div className="current">
                <p className="label">CURRENT</p>
                <p>
                  {inverterData.summary.current.value}{inverterData.summary.current.unit}
                  &nbsp;| {calculateCash(inverterData.price, inverterData.summary.current.value)}/h
                  &nbsp;({(inverterData.summary.current.value / inverterData.summary.capacity * 100).toFixed(2)}%)
                </p>
              </div>
              <div className="historical-stats">
                <div>
                  <p className="label">DAY</p>
                  <p>
                    {inverterData.summary.day.value}{inverterData.summary.day.unit}
                    &nbsp;| {calculateCash(inverterData.price, inverterData.summary.day.value)}
                  </p>
                </div>
                <div>
                  <p className="label">YEAR</p>
                  <p>
                    {inverterData.summary.year.value}{inverterData.summary.year.unit}
                    &nbsp;| {calculateCash(inverterData.price, inverterData.summary.year.value)}
                  </p>
                </div>
                <div>
                  <p className="label">TOTAL</p>
                  <p>
                    {inverterData.summary.total.value}{inverterData.summary.total.unit}
                    &nbsp;| {calculateCash(inverterData.price, inverterData.summary.total.value)}
                  </p>
                </div>
              </div>
            </div>
            <div className="breakdown">
              {
                inverterData.breakdown.map((inverter, i) => (
                  <div className="inverter" key={`inverter-${i}`}>
                    <div className="header">
                      <h3>Inverter #{i+1}</h3>
                    </div>
                    <div className="data">
                      <div>
                        <p className="label">CURRENT</p>
                        <p>
                          {inverter.current.value}{inverter.current.unit}
                          &nbsp;({(inverter.current.value / inverter.capacity * 100).toFixed(2)}%)
                        </p>
                      </div>
                      <div>
                        <p className="label">DAY</p>
                        <p>{inverter.day.value}{inverter.day.unit}</p>
                      </div>
                      <div>
                        <p className="label">YEAR</p>
                        <p>{inverter.year.value}{inverter.year.unit}</p>
                      </div>
                      <div>
                        <p className="label">TOTAL</p>
                        <p>{inverter.total.value}{inverter.total.unit}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </>
        )
      }
    </div>
  )
}

export default Dashboard