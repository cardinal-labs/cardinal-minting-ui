import { tryPublicKey } from '@cardinal/namespaces-components'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useProjectConfig } from 'providers/ProjectConfigProvider'

import { CANDY_MACHINE_DATA_KEY } from './useCandyMachineData'

export const useCandyMachineId = () => {
  const { query } = useRouter()
  const { config } = useProjectConfig()
  const { environment } = useEnvironmentCtx()

  return useQuery(
    [
      CANDY_MACHINE_DATA_KEY,
      'useCandyMachineId',
      query.candyMachineId?.toString() ?? config.eth?.contractAddress,
    ],
    async () => {
      const tryCandyMachineId =
        tryPublicKey(query.config) ??
        tryPublicKey(config.candyMachineId) ??
        undefined
      if (tryCandyMachineId) {
        return {
          chain: 'sol',
          address: tryCandyMachineId.toString(),
        }
      }

      const address =
        query.candyMachineId?.toString() ?? config.eth?.contractAddress ?? ''
      return {
        chain: environment.label,
        address: address,
      }
    }
  )
}
