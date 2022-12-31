import type { IconKey } from 'common/Socials'
import type { TradeButtonOptions } from 'components/TradeButtons'
import type React from 'react'

export type Colors = {
  accent: string
  glow: string
}

export type Badge = {
  badgeType: 'recent' | 'trending' | 'expiration' | 'wrapped' | 'unwrapped'
  position?: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'
  content?: JSX.Element | string
}

export type Phase = {
  tooltip?: React.ReactNode
  title: React.ReactNode
  subtitle: React.ReactNode
  description: React.ReactNode
  allowlist?: {
    gatekeeperNetwork?: string
    expireOnUse?: boolean
  }
  whitelistMintSettings?: {
    mint?: string
  }
  payment?: {
    paymentMint?: string
    paymentAmount: number
  }
  goLiveSeconds?: number
  endSeconds?: number
}

export type ProjectConfig = {
  eth?: {
    contractAddress: string
    goerli: boolean
  }
  hidden?: boolean
  indexMetadataDisabled?: boolean
  name: string
  displayName: string
  websiteUrl: string
  hero?: string
  description?: string
  hostname?: string
  twitterHandle?: string
  socialLinks?: {
    icon: IconKey
    link: string
  }[]
  hideElligibility?: boolean
  goLiveSeconds?: number
  tradeButtons?: TradeButtonOptions[]
  logoImage?: string
  logoPadding?: boolean
  colors: Colors
  sponsors?: string[]
  badges?: Badge[]
  mintImages?: string[]
  phases?: Phase[]
  candyMachineId?: string
}

export const LISTING_AUTHORITY_NAME = 'global'

export const projectConfigs: { [key: string]: ProjectConfig } = {
  'bat-premint': {
    name: 'bat-premint',
    displayName: 'BAT x Adam Ape for Brave',
    description: `Basic Attention Token (BAT) has joined forces with Adam Ape, a renowned multidisciplinary artist in Web3 and the traditional graphic design and digital animation space, on its 2500-piece genesis Solana NFT collection: BAT x Adam Ape for Brave.\n\nTogether, they created four PFP-style NFTs modeled after Brave’s logo. Each of the four NFTs—The Curious, The Dabbler, The Degen, and The Sage—is dynamically animated with facial expressions and sound effects and represents one of four stages of immersion in Web3.`,
    // logoImage: 'brave/brave-logo.png',
    websiteUrl: 'https://cardinal.so',
    socialLinks: [
      {
        icon: 'web',
        link: 'https://basicattentiontoken.org/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/AttentionToken',
      },
    ],
    colors: {
      accent: '#e74a27',
      glow: '#e74a27',
    },
    sponsors: ['/logos/bat.png', '/logos/brave.png', '/logos/magic-eden.png'],
    tradeButtons: ['coralcube'],
    mintImages: ['brave/brave-0.png', 'brave/brave-1.png', 'brave/brave-2.png'],
    candyMachineId: 'B9MLpsMTTVpZBpWSFnbYrW9CV2oPsWq9kp8xjXtZXUQt',
    goLiveSeconds: 1668094200,
    phases: [
      {
        tooltip: 'Free Premint',
        title: 'Phase 0',
        subtitle: 'Premint',
        description: '',
        allowlist: {
          gatekeeperNetwork: '5yLQFwUm1NStXzhveYX3KNw2sJr5BAdQmrg1UbbB1nmi',
          expireOnUse: true,
        },
      },
      {
        tooltip: 'Must hold an Adam Ape NFT',
        title: 'Phase I',
        subtitle: 'Adam Ape NFT holders',
        description: '',
        allowlist: {
          gatekeeperNetwork: 'GnBuHefsQasF2spzZNkqQGN6AstFo9VEtrmmVPsbN6d3',
          expireOnUse: true,
        },
        payment: {
          paymentAmount: 3000000000,
        },
        goLiveSeconds: 1668099600,
        endSeconds: 1668099600 + 60 * 30,
      },
      {
        tooltip: 'Mint using BAT token',
        title: 'Phase II',
        subtitle: 'Whitelist BAT Mint',
        description: '',
        allowlist: {
          gatekeeperNetwork: 'B21AQApRrSw9RrYLDdBC7RighbGY1CAsm2pRxczBPcNu',
          expireOnUse: true,
        },
        payment: {
          paymentMint: 'EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz',
          paymentAmount: 20000000000,
        },
        goLiveSeconds: 1668099600 + 60 * 30,
        endSeconds: 1668099600 + 60 * 60,
      },
      {
        title: 'Phase III',
        subtitle: 'Whitelist SOL Mint',
        description: '',
        allowlist: {
          gatekeeperNetwork: 'B21AQApRrSw9RrYLDdBC7RighbGY1CAsm2pRxczBPcNu',
          expireOnUse: true,
        },
        payment: {
          paymentAmount: 3000000000,
        },
        goLiveSeconds: 1668099600 + 60 * 60,
        endSeconds: 1668099600 + 60 * 120,
      },
      {
        title: 'Phase IV',
        subtitle: 'Public SOL Mint',
        description: '',
        payment: {
          paymentAmount: 3000000000,
        },
        goLiveSeconds: 1668099600 + 60 * 120,
        endSeconds: 0,
      },
    ],
  },
  bat: {
    name: 'bat',
    displayName: 'BAT x Adam Ape for Brave',
    description: `Basic Attention Token (BAT) has joined forces with Adam Ape, a renowned multidisciplinary artist in Web3 and the traditional graphic design and digital animation space, on its 2500-piece genesis Solana NFT collection: BAT x Adam Ape for Brave.\n\nTogether, they created four PFP-style NFTs modeled after Brave’s logo. Each of the four NFTs—The Curious, The Dabbler, The Degen, and The Sage—is dynamically animated with facial expressions and sound effects and represents one of four stages of immersion in Web3.`,
    // logoImage: 'brave/brave-logo.png',
    websiteUrl: 'https://cardinal.so',
    socialLinks: [
      {
        icon: 'web',
        link: 'https://basicattentiontoken.org/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/AttentionToken',
      },
    ],
    colors: {
      accent: '#e74a27',
      glow: '#e74a27',
    },
    sponsors: ['/logos/bat.png', '/logos/brave.png', '/logos/magic-eden.png'],
    tradeButtons: ['coralcube'],
    mintImages: ['brave/brave-0.png', 'brave/brave-1.png', 'brave/brave-2.png'],
    candyMachineId: 'B9MLpsMTTVpZBpWSFnbYrW9CV2oPsWq9kp8xjXtZXUQt',
    goLiveSeconds: 1668099600,
    phases: [
      {
        tooltip: 'Must hold an Adam Ape NFT',
        title: 'Phase I',
        subtitle: 'Adam Ape NFT holders',
        description: '',
        allowlist: {
          gatekeeperNetwork: 'GnBuHefsQasF2spzZNkqQGN6AstFo9VEtrmmVPsbN6d3',
          expireOnUse: true,
        },
        whitelistMintSettings: {
          mint: '7fpz2iSx5PaLkppg4pQwp3C6XfpmaeYpFcoXnuoEZQ7H',
        },
        payment: {
          paymentMint: 'So11111111111111111111111111111111111111112',
          paymentAmount: 3000000000,
        },
        goLiveSeconds: 1668099600,
        endSeconds: 1668099600 + 60 * 30,
      },
      {
        tooltip: 'Mint using BAT token',
        title: 'Phase II',
        subtitle: 'Whitelist BAT Mint',
        description: '',
        allowlist: {
          gatekeeperNetwork: 'B21AQApRrSw9RrYLDdBC7RighbGY1CAsm2pRxczBPcNu',
          expireOnUse: true,
        },
        whitelistMintSettings: {
          mint: '7fpz2iSx5PaLkppg4pQwp3C6XfpmaeYpFcoXnuoEZQ7H',
        },
        payment: {
          paymentMint: 'EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz',
          paymentAmount: 20000000000,
        },
        goLiveSeconds: 1668099600 + 60 * 30,
        endSeconds: 1668099600 + 60 * 60,
      },
      {
        title: 'Phase III',
        subtitle: 'Whitelist SOL Mint',
        description: '',
        allowlist: {
          gatekeeperNetwork: 'B21AQApRrSw9RrYLDdBC7RighbGY1CAsm2pRxczBPcNu',
          expireOnUse: true,
        },
        whitelistMintSettings: {
          mint: '7fpz2iSx5PaLkppg4pQwp3C6XfpmaeYpFcoXnuoEZQ7H',
        },
        payment: {
          paymentAmount: 3000000000,
        },
        goLiveSeconds: 1668099600 + 60 * 60,
        endSeconds: 1668099600 + 60 * 120,
      },
      {
        title: 'Phase IV',
        subtitle: 'Public SOL Mint',
        description: '',
        allowlist: {},
        whitelistMintSettings: {},
        payment: {
          paymentAmount: 3000000000,
        },
        goLiveSeconds: 1668099600 + 60 * 120,
        endSeconds: 0,
      },
    ],
  },
  'test-0': {
    name: 'test-0',
    displayName: 'Test 0',
    description:
      'Basic Attention Token (BAT) has joined forces with Adam Ape, a renowned multidisciplinary artist in Web3 and the traditional graphic design and digital animation space, on its 2500-piece genesis Solana NFT collection: BAT x Adam Ape for Brave.',
    websiteUrl: 'https://cardinal.so',
    socialLinks: [
      {
        icon: 'web',
        link: 'https://google.com/',
      },
      {
        icon: 'twitter',
        link: 'https://google.com',
      },
      {
        icon: 'discord',
        link: 'https://google.com',
      },
    ],
    colors: {
      accent: '#278ace',
      glow: '#278ace',
    },
    candyMachineId: '7oUA5rq31mm2tC5sJMLY3CLSMunVokqmePPj9VBJR5HM',
  },
  unverified: {
    name: 'unverified',
    displayName: 'Beta Testing',
    description:
      'Basic Attention Token (BAT) has joined forces with Adam Ape, a renowned multidisciplinary artist in Web3 and the traditional graphic design and digital animation space, on its 2500-piece genesis Solana NFT collection: BAT x Adam Ape for Brave.',
    websiteUrl: 'https://cardinal.so',
    socialLinks: [
      {
        icon: 'web',
        link: 'https://cardinal.so/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/cardinal_labs',
      },
    ],
    colors: {
      accent: '#278ace',
      glow: '#278ace',
    },
    candyMachineId: '',
  },
  ['degods']: {
    name: 'ETH Degods',
    eth: {
      contractAddress: '0x10cc2d9840005AD44F3Cf96B33154FbFeF51b980',
      goerli: true,
    },
    displayName: 'ETH Degods brought to you by Giannis',
    description: 'beep boop boopity boop',
    websiteUrl: 'https://cardinal.so',
    socialLinks: [
      {
        icon: 'web',
        link: 'https://cardinal.so/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/cardinal_labs',
      },
    ],
    colors: {
      accent: '#000',
      glow: '#000',
    },
  },
}
