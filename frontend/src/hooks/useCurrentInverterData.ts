import { QueryResult, useQuery } from 'react-query'
import Api, { TransformedFroniusData } from '../lib/Api'

const useCurrentInverterData = (): QueryResult<TransformedFroniusData, Error> => useQuery(
  `current-inverter`,
  Api.getInverterData,
  {
    refetchInterval: 1000
  }
)

export default useCurrentInverterData