import axios from 'axios'
import { EnvironmentVariables } from './Constants'

export interface EnergyData {
  unit: `Wh` | `W`
  value: number
}

export interface FroniusData {
  day: EnergyData
  current: EnergyData
  total: EnergyData
  year: EnergyData
  capacity: number
}

export interface SummarisedEnergyData {
  summary: FroniusData
  breakdown: FroniusData[]
  price?: number
}

class Api {
  static req = axios.create({
    baseURL: EnvironmentVariables.API_URL
  })

  static getInverterData = async (): Promise<SummarisedEnergyData> => {
    const { data } = await Api.req.get(`/data`)
    return data
  }
}

export default Api