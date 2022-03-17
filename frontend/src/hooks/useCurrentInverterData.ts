import { QueryResult, useQuery } from 'react-query'
import Api, { SummarisedEnergyData } from '../lib/Api'

const useCurrentInverterData = (): QueryResult<SummarisedEnergyData, Error> => useQuery(
  `current-inverter`,
  Api.getInverterData,
  {
    refetchInterval: 1000
  }
)

export default useCurrentInverterData