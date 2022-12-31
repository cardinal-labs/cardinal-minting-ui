import {
  CONFIG_ARRAY_START,
  CONFIG_LINE_SIZE,
} from '@cardinal/mpl-candy-machine-utils'
import * as beet from '@metaplex-foundation/beet'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import {
  ETH_NETWORKS,
  ethCandyMachine,
  useEnvironmentCtx,
} from 'providers/EnvironmentProvider'

import { CANDY_MACHINE_DATA_KEY } from './useCandyMachineData'
import { useCandyMachineId } from './useCandyMachineId'

export function chunkArray<T>(arr: T[], size: number): T[][] {
  return arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr]
}

export const configLineBeet = new beet.FixableBeetArgsStruct(
  [
    ['name', beet.utf8String],
    ['uri', beet.utf8String],
  ],
  'ConfigLine'
)

const SUPPLY = 2500

export const useConfigLines = () => {
  const { data: candyMachineId } = useCandyMachineId()
  const { connection, ethConnection } = useEnvironmentCtx()

  return useQuery(
    [CANDY_MACHINE_DATA_KEY, 'useConfigLines', candyMachineId?.toString()],
    async () => {
      if (!candyMachineId) return
      if (ETH_NETWORKS.includes(candyMachineId?.chain)) {
        const contract = ethCandyMachine(ethConnection, candyMachineId.address)
        const configLines = (await contract.methods
          .fetchConfigLines()
          .call()) as string[]
        return configLines.map((uri) => {
          return { name: '', uri: uri }
        })
      } else {
        if (!candyMachineId) return
        const accountInfo = await connection.getAccountInfo(
          new PublicKey(candyMachineId.address)
        )
        const configLineOffset = CONFIG_ARRAY_START + 4
        const configLinesBytes = accountInfo?.data.slice(
          configLineOffset,
          configLineOffset + CONFIG_LINE_SIZE * SUPPLY
        )
        const configLines: { name: string; uri: string }[] = []
        for (let i = 0; i < SUPPLY; i++) {
          try {
            const configLineBytes = configLinesBytes?.slice(
              i * CONFIG_LINE_SIZE,
              i * CONFIG_LINE_SIZE + CONFIG_LINE_SIZE
            )
            const configLine = configLineBeet.deserialize(
              configLineBytes ?? Buffer.from(''),
              0
            )[0]
            configLines.push(configLine)
          } catch (e) {}
        }
        return configLines
      }
    },
    {
      enabled: !!candyMachineId,
    }
  )
}
