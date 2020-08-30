import axios from 'axios'
import type {
  EnergyData,
  FroniusData,
  FroniusInverterInfo,
  RawEnergyData,
  RawFroniusData,
  SummarisedEnergyData
} from '../types/Fronius'
import { EnvironmentVariables } from './Constants'

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

class Fronius {
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
            ? ({[key]: (curAcc[key] + curInverter[key] / 1000)})
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
            ? ({[key]: inverter[key] / 1000})
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

  static getDataFromInverter = async (
    inverterIp: string,
  ): Promise<FroniusData> => {
    const { data } = await axios.get(
      // eslint-disable-next-line no-secrets/no-secrets
      `http://${inverterIp}/solar_api/v1/GetInverterRealtimeData.cgi?Scope=System`,
    )
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
    const { data } = await axios.get(
      // eslint-disable-next-line no-secrets/no-secrets
      `http://${inverterIp}/solar_api/v1/GetInverterInfo.cgi`,
    )
    return data
  }

  static getInverterCapacity = async (inverterIp: string): Promise<number> => {
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
  }

  static getAllInverterCapacity = async (): Promise<number[]> => {
    return await Promise.all(
      EnvironmentVariables.INVERTER_IPS
        .map(ip => Fronius.getInverterCapacity(ip)),
    )
  }
}

export default Fronius