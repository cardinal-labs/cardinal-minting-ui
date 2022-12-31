import { CandyMachine } from '@cardinal/mpl-candy-machine-utils'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { ETH_NETWORKS, useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { useCandyMachineId } from './useCandyMachineId'

export const CANDY_MACHINE_DATA_KEY = 'candy-machine'
export const useCandyMachineData = () => {
  const { data: candyMachineId } = useCandyMachineId()
  const { connection, environment } = useEnvironmentCtx()
  return useQuery(
    [CANDY_MACHINE_DATA_KEY, candyMachineId?.address?.toString()],
    async () => {
      if (!candyMachineId) return
      return CandyMachine.fromAccountAddress(
        connection,
        new PublicKey(candyMachineId.address)
      )
    },
    {
      enabled: !!candyMachineId && !ETH_NETWORKS.includes(environment.label),
      refetchInterval: 1000,
    }
  )
}
