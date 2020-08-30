export interface RawEnergyData {
  Unit: `Wh` | `W`
  Values: {
    1: number
  }
}

export interface RawFroniusData {
  Body: {
    Data: {
      DAY_ENERGY: RawEnergyData,
      PAC: RawEnergyData,
      TOTAL_ENERGY: RawEnergyData,
      YEAR_ENERGY: RawEnergyData
    }
  },
}

export interface EnergyData {
  unit: `kWh` | `kW` | `Wh` | `W`
  value: number
}

export interface FroniusData {
  day: EnergyData
  current: EnergyData
  total: EnergyData
  year: EnergyData
  capacity: number
}

export interface FroniusInverterInfo {
  Body: {
    Data: {
      1: {
        CustomName: string
        DT: number // device type
        ErrorCode: number
        PVPower: number // in Watts
        Show: number
        StatusCode: number
        UniqueID: string
      }
    }
  }
}

export interface SummarisedEnergyData {
  summary: FroniusData
  breakdown: FroniusData[],
  price?: number,
}