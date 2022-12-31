import {
  decimalAmount,
  getExpirationString,
  tryPublicKey,
} from '@cardinal/common'
import { BN } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { Tooltip } from 'common/Tooltip'
import type { Phase } from 'config/config'
import { useCandyMachineData } from 'hooks/useCandyMachineData'
import { useCandyMachineId } from 'hooks/useCandyMachineId'
import {
  mintDecimals,
  mintSymbol,
  WRAPPED_SOL_MINT,
} from 'hooks/usePaymentMints'
import { ETH_NETWORKS } from 'providers/EnvironmentProvider'
import { useProjectConfig } from 'providers/ProjectConfigProvider'
import { useUTCNow } from 'providers/UTCNowProvider'
import { AiFillCrown } from 'react-icons/ai'

import { GatewayStatus } from './GatewayStatus'
import { WhitelistTokenStatus } from './WhitelistTokenStatus'

export const MintPhase = ({ phase }: { phase: Phase }) => {
  const { UTCNow } = useUTCNow()
  const { config } = useProjectConfig()
  const candyMachineId = useCandyMachineId()
  const candyMachineData = useCandyMachineData()

  const goLiveSeconds =
    phase.goLiveSeconds ??
    (candyMachineData.data?.data.goLiveDate
      ? parseInt(candyMachineData.data?.data.goLiveDate?.toString() || '')
      : undefined)

  const endSeconds =
    phase.endSeconds ??
    (candyMachineData.data?.data.endSettings
      ? parseInt(
          candyMachineData.data?.data.endSettings?.number?.toString() || ''
        )
      : undefined)

  const paymentAmount =
    phase.payment?.paymentAmount ??
    (candyMachineData.data?.data.price
      ? parseInt(candyMachineData.data.data.price.toString())
      : undefined)

  const paymentMint =
    tryPublicKey(phase.payment?.paymentMint) ?? candyMachineData.data?.tokenMint

  const live =
    (candyMachineId.data?.chain &&
      ETH_NETWORKS.includes(candyMachineId.data?.chain)) ||
    (UTCNow > (goLiveSeconds ?? 0) &&
      (endSeconds === 0 || UTCNow < (endSeconds ?? 0)) &&
      (!phase.payment?.paymentMint ||
        phase.payment?.paymentMint ===
          candyMachineData.data?.tokenMint?.toString()) &&
      (!phase.payment?.paymentAmount ||
        (phase.payment?.paymentAmount ?? 0) ===
          parseInt(candyMachineData.data?.data.price.toString() ?? '0')))

  return (
    <div
      className={`w-full cursor-pointer rounded-lg border-opacity-50 bg-light-4 bg-opacity-10 px-6 py-4 text-sm ${
        live ? 'border-2 border-primary' : 'border border-border opacity-50'
      }`}
    >
      <div className="mb-2 flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-base font-bold">{phase.title}</div>
          <div className="text-light-2">{phase.subtitle}</div>
        </div>
        {!(
          candyMachineId.data?.chain &&
          ETH_NETWORKS.includes(candyMachineId.data?.chain)
        ) && (
          <div className="flex flex-col items-end">
            <div className="text-base font-bold">
              {endSeconds && UTCNow > endSeconds ? (
                <div className="text-red-500">Ended</div>
              ) : goLiveSeconds && UTCNow > goLiveSeconds ? (
                <div className="flex items-center gap-2">
                  <div className="text-green-500">
                    {endSeconds ? (
                      <div>
                        {getExpirationString(endSeconds, UTCNow, {
                          showZeros: true,
                          capitalizeSuffix: false,
                        })}
                      </div>
                    ) : (
                      'LIVE'
                    )}
                  </div>
                </div>
              ) : goLiveSeconds ? (
                getExpirationString(goLiveSeconds, UTCNow, {
                  showZeros: true,
                  capitalizeSuffix: false,
                })
              ) : endSeconds === 0 ? (
                <div></div>
              ) : (
                <div className="h-[26px] w-16 animate-pulse rounded-lg bg-border" />
              )}
            </div>
            <div className="text-light-2">{phase.description}</div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {!config.hideElligibility && (
            <>
              <GatewayStatus phase={phase} />
              <WhitelistTokenStatus phase={phase} />
            </>
          )}
          <Tooltip
            tooltip="Royalties are enforced for these tokens. Click here to learn more"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1 rounded-lg border border-yellow-500 bg-yellow-500 bg-opacity-20 px-3 py-1 text-xs">
              <AiFillCrown /> Royalty Enabled
            </div>
          </Tooltip>
        </div>
        <div className="text-base font-bold">
          {decimalAmount(
            new BN(paymentAmount ?? 0),
            mintDecimals(paymentMint ?? new PublicKey(WRAPPED_SOL_MINT))
          ).toFixed(2)}{' '}
          {candyMachineId.data?.chain &&
          ETH_NETWORKS.includes(candyMachineId.data?.chain)
            ? 'ETH'
            : mintSymbol(paymentMint ?? new PublicKey(WRAPPED_SOL_MINT))}
        </div>
      </div>
    </div>
  )
}
