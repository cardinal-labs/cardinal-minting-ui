import { useQuery } from '@tanstack/react-query'

export const useEthWalletId = () => {
  return useQuery(['ETH_WALLET'], async () => {
    const windowTyped = window as any
    if (windowTyped) {
      const addressArray = await windowTyped.ethereum.request({
        method: 'eth_accounts',
      })
      if (addressArray.length > 0) {
        return addressArray[0]
      }
    }
    return undefined
  })
}
