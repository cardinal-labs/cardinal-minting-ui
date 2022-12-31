import { shortPubKey } from '@cardinal/common'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'

import { EthAccountPopover } from './EthAccountPopover'
import { Popover } from './Popover'

export const EthWalletConnect = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [browserWallet, setBrowserWallet] = useState<boolean>(true)
  const [account, setAccount] = useState<string>('')
  const [_status, setStatus] = useState<string>('')
  const { environment } = useEnvironmentCtx()

  const connectWallet = async () => {
    const windowTyped = window as any
    if (windowTyped.ethereum) {
      try {
        const addressArray = await windowTyped.ethereum.request({
          method: 'eth_requestAccounts',
        })
        const obj = {
          status: 'Connected wallet',
          address: addressArray[0],
        }
        return obj
      } catch (err: any) {
        return {
          address: '',
          status: 'No accounts found, you need to create a wallet',
        }
      }
    } else {
      return {
        address: '',
        status: 'No wallet extensions in browser',
      }
    }
  }

  const getCurrentWalletConnected = async () => {
    const windowTyped = window as any
    if (windowTyped) {
      const addressArray = await windowTyped.ethereum.request({
        method: 'eth_accounts',
      })
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: 'Found connected account',
        }
      } else {
        return {
          address: '',
          status: 'No accounts found',
        }
      }
    } else {
      return {
        address: '',
        status: 'No wallet extensions in browser',
      }
    }
  }

  function addWalletListener() {
    const windowTyped = window as any
    if (windowTyped) {
      windowTyped.ethereum.on('accountsChanged', (accounts: any) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setStatus('Connected changed account')
        } else {
          setAccount('')
          setStatus('No accounts found')
        }
      })
    } else {
      setStatus('No wallet extensions in browser')
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setAccount(walletResponse.address)
  }

  const disconnectWallet = () => {
    setStatus('Disconnected wallet')
    setAccount('')
  }

  useEffect(() => {
    const fetchData = async () => {
      if (window && !(window as any).ethereum) {
        setBrowserWallet(false)
      }
      const { address, status } = await getCurrentWalletConnected()
      setAccount(address)
      setStatus(status)

      addWalletListener()
    }

    fetchData().catch(console.error)
  }, [])

  return (
    <div className="border-1 flex cursor-pointer flex-row rounded-lg border border-gray-400 p-2">
      {!account ? (
        <div
          onClick={
            browserWallet
              ? connectWalletPressed
              : () => window.open('https://metamask.io/', '_blank')
          }
        >
          Connect Wallet
        </div>
      ) : (
        <Popover
          offset={[-300, 20]}
          placement="bottom-end"
          open={open}
          content={
            <EthAccountPopover
              address={account}
              handleDisconnect={disconnectWallet}
              dark={true}
              network={environment.label}
            />
          }
        >
          <div className="flex" onClick={() => setOpen(true)}>
            <img className="mr-3 w-6" src="metamask.png" alt="metamask" />
            <div>{shortPubKey(account, 5)}</div>
          </div>
        </Popover>
      )}
    </div>
  )
}
