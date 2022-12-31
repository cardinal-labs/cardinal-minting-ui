import React from 'react'
import { FaPowerOff } from 'react-icons/fa'
import { MdAccountBox } from 'react-icons/md'

export const EthAccountPopover = ({
  address,
  handleDisconnect,
  dark,
  style,
  network = 'eth-mainnet',
}: {
  address: string
  handleDisconnect: () => void
  dark?: boolean
  style?: React.CSSProperties
  network?: string
}) => {
  return (
    <div className="w-screen max-w-[250px] ">
      <div
        className="w-full rounded-lg shadow-2xl"
        style={{
          ...style,
          backgroundColor: dark
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgb(255, 255, 255)',
          color: dark ? '#fff' : '#333',
        }}
      >
        <div className="flex flex-col gap-1 p-5">
          <MenuItem
            onClick={() =>
              window.open(
                `https://${
                  network === 'eth-goerli' ? 'goerli.' : ''
                }etherscan.io/address/${address}`,
                '_blank'
              )
            }
            dark={dark}
          >
            <MdAccountBox size={20} />
            <span>View Address</span>
          </MenuItem>
          <MenuItem onClick={handleDisconnect} dark={dark}>
            <FaPowerOff />
            <span>Disconnect</span>
          </MenuItem>
        </div>
      </div>
    </div>
  )
}

const MenuItem = ({
  children,
  onClick,
  dark,
}: {
  children: React.ReactNode
  onClick: () => void
  dark?: boolean
}) => (
  <div
    onClick={onClick}
    className={`flex h-10 w-full cursor-pointer appearance-none items-center gap-3 rounded border-none bg-none p-3 text-base leading-4 outline-none ${
      dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
    }`}
  >
    {children}
  </div>
)
