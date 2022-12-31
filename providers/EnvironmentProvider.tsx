import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import type { Cluster } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import { useRouter } from 'next/router'
import React, { useContext, useMemo, useState } from 'react'
import type { AbiItem } from 'web3-utils'

import contractABI from '../assets/CandyMachine.json'

export const ETH_NETWORKS = ['eth-mainnet', 'eth-goerli']

export interface Environment {
  label: Cluster | 'eth-mainnet' | 'eth-goerli'
  primary: string
  primaryBeta?: string
  secondary?: string
  api?: string
  index?: string
}

export interface EnvironmentContextValues {
  environment: Environment
  setEnvironment: (newEnvironment: Environment) => void
  connection: Connection
  secondaryConnection: Connection
  ethConnection: string
}

const INDEX_ENABLED = true
const RPC_BETA_THRESHOLD = 0.25

export const ENVIRONMENTS: Environment[] = [
  {
    label: 'mainnet-beta',
    primary:
      process.env.MAINNET_PRIMARY || 'https://solana-api.projectserum.com',
    primaryBeta:
      process.env.MAINNET_PRIMARY_BETA || 'https://solana-api.projectserum.com',
    secondary:
      process.env.MAINNET_SECONDARY || 'https://solana-api.projectserum.com',
    index: INDEX_ENABLED
      ? 'https://prod-holaplex.hasura.app/v1/graphql'
      : undefined,
  },
  {
    label: 'testnet',
    primary: 'https://api.testnet.solana.com',
  },
  {
    label: 'devnet',
    primary: 'https://api.devnet.solana.com',
  },
  {
    label: 'eth-mainnet',
    primary: process.env.NEXT_PUBLIC_ETH_MAINNET || '',
  },
  {
    label: 'eth-goerli',
    primary: process.env.NEXT_PUBLIC_ETH_GOERLI || '',
  },
]

const EnvironmentContext: React.Context<null | EnvironmentContextValues> =
  React.createContext<null | EnvironmentContextValues>(null)

export function EnvironmentProvider({
  children,
  defaultCluster,
}: {
  children: React.ReactChild
  defaultCluster: string
}) {
  const { query } = useRouter()
  const cluster =
    query.project?.includes('dev') ||
    query.host?.includes('dev') ||
    (typeof window !== 'undefined' && window.location.href.includes('dev'))
      ? 'devnet'
      : query.host?.includes('test')
      ? 'testnet'
      : query.cluster || defaultCluster || process.env.BASE_CLUSTER
  const foundEnvironment = ENVIRONMENTS.find((e) => e.label === cluster)
  const [environment, setEnvironment] = useState<Environment>(
    foundEnvironment ?? ENVIRONMENTS[0]!
  )

  useMemo(() => {
    const foundEnvironment = ENVIRONMENTS.find((e) => e.label === cluster)
    setEnvironment(foundEnvironment ?? ENVIRONMENTS[0]!)
  }, [cluster])

  const connection = useMemo(() => {
    if (ETH_NETWORKS.includes(environment.label)) {
      return new Connection(ENVIRONMENTS[0]!.primary, { commitment: 'recent' })
    }
    setEnvironment((e) => ({
      ...e,
      primary:
        Math.random() < RPC_BETA_THRESHOLD
          ? environment.primaryBeta ?? environment.primary
          : environment.primary,
    }))
    return new Connection(
      Math.random() < RPC_BETA_THRESHOLD
        ? environment.primaryBeta ?? environment.primary
        : environment.primary,
      { commitment: 'recent' }
    )
  }, [environment.label])

  const secondaryConnection = useMemo(() => {
    if (ETH_NETWORKS.includes(environment.label)) {
      return new Connection(
        ENVIRONMENTS[0]!.secondary ?? ENVIRONMENTS[0]!.primary,
        { commitment: 'recent' }
      )
    }
    return new Connection(environment.secondary ?? environment.primary, {
      commitment: 'recent',
    })
  }, [environment.label])

  // tried using some ETH connection object from web3.js but couldn't
  // get around some issues with it. Rolling back to string and can examine more
  const ethConnection = ETH_NETWORKS.includes(environment.label)
    ? environment.primary
    : ENVIRONMENTS.find((env) => env.label === 'eth-mainnet')!.primary

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment,
        connection,
        secondaryConnection,
        ethConnection,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironmentCtx(): EnvironmentContextValues {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('Missing connection context')
  }
  return context
}

export const ethCandyMachine = (
  connection: string,
  contractAddress: string
) => {
  const web3 = createAlchemyWeb3(connection)
  const contract = new web3.eth.Contract(
    contractABI.abi as AbiItem[],
    contractAddress
  )
  return contract
}
