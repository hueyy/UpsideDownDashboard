import React from 'react'
import CurrentOutput from '../../components/CurrentOutput'
import PeriodOutput from '../../components/PeriodOutput'
import useCurrentInverterData from '../../hooks/useCurrentInverterData'
import './Dashboard.scss'

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
                <CurrentOutput
                  current={inverterData.summary.current}
                  capacity={inverterData.summary.capacity}
                  price={inverterData.price}
                />
              </div>
              <div className="historical-stats">
                <div>
                  <p className="label">DAY</p>
                  <PeriodOutput
                    period={inverterData.summary.day}
                    price={inverterData.price}
                  />
                </div>
                <div>
                  <p className="label">YEAR</p>
                  <PeriodOutput
                    period={inverterData.summary.year}
                    price={inverterData.price}
                  />
                </div>
                <div>
                  <p className="label">TOTAL</p>
                  <PeriodOutput
                    period={inverterData.summary.total}
                    price={inverterData.price}
                  />
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
                    {
                      inverter.capacity === 0 ? (
                        <div className="error">
                          ⚠ Cannot connect to inverter
                        </div>
                      ) : null
                    }
                    <div className="data">
                      <div>
                        <p className="label">CURRENT</p>
                        <CurrentOutput
                          current={inverter.current}
                          price={inverterData.price}
                          capacity={inverter.capacity}
                        />
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