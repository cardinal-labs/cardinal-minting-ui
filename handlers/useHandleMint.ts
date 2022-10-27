import { findAta } from '@cardinal/common'
import {
  CandyMachine,
  createMintNftInstruction,
  findLockupSettingsId,
  PROGRAM_ID,
  remainingAccountsForLockup,
} from '@cardinal/mpl-candy-machine-utils'
import {
  Edition,
  Metadata,
  MetadataProgram,
} from '@metaplex-foundation/mpl-token-metadata'
import { useWallet } from '@solana/wallet-adapter-react'
import type { AccountMeta } from '@solana/web3.js'
import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  sendAndConfirmRawTransaction,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notify } from 'common/Notification'
import { asWallet } from 'common/wallets'
import { CANDY_MACHINE_DATA_KEY } from 'hooks/useCandyMachineData'
import { useCandyMachineId } from 'hooks/useCandyMachineId'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const useHandleMint = () => {
  const { connection, environment } = useEnvironmentCtx()
  const wallet = asWallet(useWallet())
  const queryClient = useQueryClient()
  const candyMachineId = useCandyMachineId()
  return useMutation(
    ['useHandleMint'],
    async (): Promise<string> => {
      if (!candyMachineId) throw 'No candy machine id found'
      const nftToMintKeypair = Keypair.generate()
      const payerId = wallet.publicKey
      const tokenAccountToReceive = await findAta(
        nftToMintKeypair.publicKey,
        wallet.publicKey,
        false
      )

      const metadataId = await Metadata.getPDA(nftToMintKeypair.publicKey)
      const masterEditionId = await Edition.getPDA(nftToMintKeypair.publicKey)
      const [candyMachineCreatorId, candyMachineCreatorIdBump] =
        await PublicKey.findProgramAddress(
          [Buffer.from('candy_machine'), candyMachineId.toBuffer()],
          PROGRAM_ID
        )

      const candyMachine = await CandyMachine.fromAccountAddress(
        connection,
        candyMachineId
      )
      console.log(`> Creating mint instruction`)
      const mintIx = createMintNftInstruction(
        {
          candyMachine: candyMachineId,
          candyMachineCreator: candyMachineCreatorId,
          payer: payerId,
          wallet: candyMachine.wallet,
          metadata: metadataId,
          mint: nftToMintKeypair.publicKey,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
          masterEdition: masterEditionId,
          tokenMetadataProgram: MetadataProgram.PUBKEY,
          clock: SYSVAR_CLOCK_PUBKEY,
          recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
          instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        },
        {
          creatorBump: candyMachineCreatorIdBump,
        }
      )
      const remainingAccounts: AccountMeta[] = []

      // Payment
      if (candyMachine.tokenMint) {
        console.log(`> Add payment accounts`)
        const payerTokenAccount = await findAta(
          candyMachine.tokenMint,
          payerId,
          true
        )
        remainingAccounts.push(
          {
            pubkey: payerTokenAccount,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: payerId,
            isWritable: true,
            isSigner: false,
          }
        )
      }

      // Inline minting
      console.log(`> Adding mint accounts`)
      remainingAccounts.push({
        pubkey: tokenAccountToReceive,
        isSigner: false,
        isWritable: true,
      })

      // Lockup settings
      const [lockupSettingsId] = await findLockupSettingsId(candyMachineId)
      const lockupSettings = await connection.getAccountInfo(lockupSettingsId)
      if (lockupSettings) {
        console.log(`> Adding lockup settings accounts`)
        remainingAccounts.push(
          ...(await remainingAccountsForLockup(
            candyMachineId,
            nftToMintKeypair.publicKey,
            tokenAccountToReceive
          ))
        )
      }

      const instructions = [
        ComputeBudgetProgram.requestUnits({
          units: 400000,
          additionalFee: 0,
        }),
        {
          ...mintIx,
          keys: [
            ...mintIx.keys.map((k) =>
              k.pubkey.equals(nftToMintKeypair.publicKey)
                ? { ...k, isSigner: true }
                : k
            ),
            // remaining accounts for locking
            ...remainingAccounts,
          ],
        },
      ]
      const tx = new Transaction()
      tx.instructions = instructions
      tx.feePayer = payerId
      tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
      await wallet.signTransaction(tx)
      await tx.partialSign(nftToMintKeypair)
      const txid = await sendAndConfirmRawTransaction(
        connection,
        tx.serialize()
      )
      console.log(
        `mint [${nftToMintKeypair.publicKey.toString()}] candy machine [${candyMachineId.toString()}] https://explorer.solana.com/tx/${txid}?cluster=${
          environment.label
        }`
      )
      return txid
    },
    {
      onError: (e) => {
        notify({
          message: `Something went wrong with buying the token: ${e}`,
          type: 'error',
        })
      },
      onSuccess: (txid) => {
        notify({
          message: `Succesfully minted 1 token`,
          txid,
          type: 'error',
        })
        queryClient.resetQueries([CANDY_MACHINE_DATA_KEY])
      },
    }
  )
}