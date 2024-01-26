import axios from 'axios'
import moize, { Options } from 'moize'
import type {
  EnergyData,
  FroniusData,
  FroniusInverterInfo,
  RawEnergyData,
  RawFroniusData,
  SummarisedEnergyData,
} from '../types/Fronius'
import { EnvironmentVariables } from './Constants'
import Error from './Error'

const initialFroniusData: FroniusData = {
  day: {
    unit: `kWh`,
    value: 0,
  },
  current: {
    unit: `kW`,
    value: 0,
  },
  total: {
    unit: `kWh`,
    value: 0,
  },
  year: {
    unit: `kWh`,
    value: 0,
  },
  capacity: 0,
}

const memoOptions: Options = {
  maxAge: 300 // 5 minutes
}

class Fronius {
  static defaultInverterInfo: FroniusInverterInfo = {
    Body: {
      Data: {
        1: {
          CustomName: ``,
          DT: 0,
          ErrorCode: 0,
          PVPower: 0,
          Show: 0,
          StatusCode: 0,
          UniqueID: ``,
        },
      },
    },
  }

  static defaultRawFroniusData: RawFroniusData = {
    Body: {
      Data: {
        DAY_ENERGY: {
          Unit: `Wh`,
          Values: {
            1: 0,
          },
        },
        PAC: {
          Unit: `Wh`,
          Values: {
            1: 0,
          },
        },
        TOTAL_ENERGY: {
          Unit: `Wh`,
          Values: {
            1: 0,
          },
        },
        YEAR_ENERGY: {
          Unit: `Wh`,
          Values: {
            1: 0,
          },
        },
      },
    },
  }

  static cleanEnergyData = (rawData: RawEnergyData): EnergyData => {
    const { Unit, Values } = rawData
    return {
      unit: Unit,
      value: Object.values(Values)[0],
    }
  }

  static cleanRealtimeData = (rawData: RawFroniusData): FroniusData => {
    const {
      Body: {
        Data: {
          DAY_ENERGY,
          PAC,
          TOTAL_ENERGY,
          YEAR_ENERGY,
        },
      },
    } = rawData
    return {
      day: Fronius.cleanEnergyData(DAY_ENERGY),
      current: Fronius.cleanEnergyData(PAC),
      total: Fronius.cleanEnergyData(TOTAL_ENERGY),
      year: Fronius.cleanEnergyData(YEAR_ENERGY),
      capacity: 0,
    }
  }

  static summariseRealtimeData = (input: FroniusData[]): SummarisedEnergyData => ({
    summary: input.reduce((acc, curInverter) => Object.keys(curInverter)
      .reduce((curAcc, key) => ({
        ...curAcc,
        ...(
          key === `capacity`
            ? ({ [key]: (curAcc[key] + curInverter[key] / 1000) })
            : {
              [key]: {
                unit: (curInverter[key].unit === `W` ? `kW` : `kWh`),
                value: Number.parseFloat(
                  ((curAcc[key].value + curInverter[key].value / 1000)).toFixed(2),
                ),
              },
            }
        ),
      }), acc),
      initialFroniusData),
    breakdown: input.map(inverter => Object.keys(inverter)
      .reduce((acc, key) => ({
        ...acc,
        ...(
          key === `capacity`
            ? ({ [key]: inverter[key] / 1000 })
            : {
              [key]: {
                unit: (inverter[key].unit === `W` ? `kW` : `kWh`),
                value: Number.parseFloat(
                  ((inverter[key].value) / 1000).toFixed(2),
                ),
              },
            }
        ),
      }),
        initialFroniusData),
    ),
  })

  static getRealtimeDataFromInverter = moize(async (
    inverterIp: string,
  ): Promise<RawFroniusData> => {
    try {
      const { data } = await axios.get(
        // eslint-disable-next-line no-secrets/no-secrets
        `http://${inverterIp}/solar_api/v1/GetInverterRealtimeData.cgi?Scope=System`,
      )
      return data
    } catch (error) {
      Error.captureError(error)
      return Fronius.defaultRawFroniusData
    }
  }, memoOptions)


  static getDataFromInverter = async (
    inverterIp: string,
  ): Promise<FroniusData> => {
    const data = await Fronius.getRealtimeDataFromInverter(inverterIp)
    const capacity = await Fronius.getInverterCapacity(inverterIp)
    return {
      ...Fronius.cleanRealtimeData(data),
      capacity,
    }
  }

  static getDataFromInverters = async (): Promise<SummarisedEnergyData> => {
    const data = await Promise.all(
      EnvironmentVariables.INVERTER_IPS
        .map(ip => Fronius.getDataFromInverter(ip)),
    )
    return {
      price: EnvironmentVariables.GRID_PRICE,
      ...Fronius.summariseRealtimeData(data),
    }
  }

  static getInverterInfo = async (inverterIp: string): Promise<FroniusInverterInfo> => {
    try {
      const { data } = await axios.get(
        // eslint-disable-next-line no-secrets/no-secrets
        `http://${inverterIp}/solar_api/v1/GetInverterInfo.cgi`,
      )
      return data
    } catch (error) {
      Error.captureError(error)
      return Fronius.defaultInverterInfo
    }
  }

  static getInverterCapacity = moize(async (inverterIp: string): Promise<number> => {
    const {
      Body: {
        Data: {
          1: {
            PVPower,
          },
        },
      },
    } = await Fronius.getInverterInfo(inverterIp)
    return PVPower
  }, memoOptions)

  static getAllInverterCapacity = async (): Promise<number[]> => {
    return await Promise.all(
      EnvironmentVariables.INVERTER_IPS
        .map(ip => Fronius.getInverterCapacity(ip)),
    )
  }
}

export default Fronius