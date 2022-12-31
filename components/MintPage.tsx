import { LogoTitled } from 'assets/LogoTitled'
import { useProjectConfig } from 'providers/ProjectConfigProvider'

import { MintButton } from './MintButton'
import { MintInfo } from './MintInfo'
import { MintPhase } from './MintPhase'
import { MintPreview } from './MintPreview'
import { MintSupply } from './MintSupply'
import { TradeButtons } from './TradeButtons'

export const MintPage = () => {
  const { config } = useProjectConfig()
return (
    <div className="mx-auto mt-24 flex w-full max-w-[1300px] flex-wrap gap-10 px-10">
      <div className="flex w-full flex-wrap gap-10">
        <div className="flex flex-1 flex-col items-center gap-4">
          <MintInfo />
          {config.phases?.map((p, i) => <MintPhase key={i} phase={p} />) ?? (
            <MintPhase
              phase={{
                title: 'Phase I',
                subtitle: 'Mint a token for this collection',
                description: '',
              }}
            />
          )}
        </div>
        <div className="flex min-w-[300px] flex-1 flex-col items-center gap-4">
          <MintPreview />
          <MintSupply />
          <MintButton />
          <TradeButtons tradeButtons={config.tradeButtons} />
        </div>
      </div>
      {config.sponsors && (
        <div className="mt-8 flex w-full flex-wrap items-center justify-around gap-10 border-t border-border px-8 py-16">
          <LogoTitled className="h-8" />
          {config.sponsors.map((s, i) => (
            <img className="max-h-10" key={i} src={s} alt={s} />
          ))}
        </div>
      )}
    </div>
  )
}
