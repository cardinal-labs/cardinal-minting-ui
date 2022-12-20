import { FooterSlim } from 'common/FooterSlim'
import { MainHero } from 'components/home/MainHero'
import Head from 'next/head'

export function Placeholder() {
  return (
    <div className="h-[300px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
  )
}

function Home() {
  return (
    <div className="relative z-0 flex min-h-screen flex-col bg-dark-5">
      <Head>
        <title>Minting UI</title>
        <meta name="description" content="Cardinal NFT Minting UI" />
        <link rel="icon" href={'/favicon.ico'} />
        <script
          defer
          data-domain="stake.cardinal.so"
          src="https://plausible.io/js/plausible.js"
        />
        <meta name="og:title" content={`Cardinal NFT Minting UI`} />
        <meta name="og:description" content="Mint on Cardinal NFT Minting UI" />
        <meta property="og:url" content="https://rent.cardinal.so" />
        <meta
          name="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/preview`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cardinal_labs" />
        <script
          defer
          data-domain="mint.cardinal.so"
          src="https://plausible.io/js/script.js"
        ></script>
      </Head>
      <MainHero />
      <div className="z-10 mx-auto mt-48 flex grow flex-col gap-24 px-8 md:px-16">
        <div className="flex w-full flex-col text-center">
          <div className="mb-2 text-3xl text-light-0">Step 1</div>
          <div className="text-lg text-medium-3">Setup your mint</div>
          <div className="mb-4 text-base italic text-medium-3">
            {/* Coming soon... */}
          </div>
        </div>
        <div className="mx-auto h-48 w-[2px] bg-border"></div>
        <div className="flex w-full flex-col text-center">
          <div className="mb-2 text-3xl text-light-0">Step 2</div>
          <div className="text-lg text-medium-3">Configure your paramaters</div>
          <div className="mb-4 text-base italic text-medium-3">
            {/* Coming soon... */}
          </div>
        </div>
        <div className="mx-auto h-48 w-[2px] bg-border"></div>
        <div className="flex w-full flex-col text-center">
          <div className="mb-2 text-3xl text-light-0">Step 3</div>
          <div className="text-lg text-medium-3">Share your page</div>
          <div className="mb-4 text-base italic text-medium-3">
            {/* Coming soon... */}
          </div>
        </div>
        <div className="mx-auto h-48 w-[2px] bg-border"></div>
      </div>
      <FooterSlim />
    </div>
  )
}

export default Home
