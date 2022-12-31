import { useQuery } from '@tanstack/react-query'
import {
  ethCandyMachine,
  useEnvironmentCtx,
} from 'providers/EnvironmentProvider'

import { useCandyMachineId } from './useCandyMachineId'

export const ETH_CANDY_MACHINE_DATA_KEY = 'eth-candy-machine'
export const useEthCandyMachineData = () => {
  const { data: candyMachineId } = useCandyMachineId()
  const { ethConnection } = useEnvironmentCtx()

  return useQuery(
    [ETH_CANDY_MACHINE_DATA_KEY, candyMachineId?.address?.toString()],
    async () => {
      if (!candyMachineId) return
      const contract = ethCandyMachine(ethConnection, candyMachineId.address)
      const mintedTokensAmount = Number(
        await contract.methods.mintedTokensAmount().call()
      )
      const tokensRemainingAmount = Number(
        await contract.methods.tokensRemainingAmount().call()
      )
      return {
        minted: mintedTokensAmount,
        remaining: tokensRemainingAmount,
        supply: mintedTokensAmount + tokensRemainingAmount,
      }
    },
    {
      enabled: !!candyMachineId,
      refetchInterval: 1000,
    }
  )
}
