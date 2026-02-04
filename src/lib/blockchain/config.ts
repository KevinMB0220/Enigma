import { defineChain } from 'viem';

/**
 * Avalanche C-Chain Configuration
 */
export const avalanche = defineChain({
  id: 43114,
  name: 'Avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.avax.network/ext/bc/C/rpc'],
      webSocket: ['wss://api.avax.network/ext/bc/C/ws'],
    },
    public: {
      http: ['https://api.avax.network/ext/bc/C/rpc'],
      webSocket: ['wss://api.avax.network/ext/bc/C/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace',
      url: 'https://snowtrace.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11907934,
    },
  },
});

/**
 * Avalanche Fuji Testnet Configuration
 */
export const avalancheFuji = defineChain({
  id: 43113,
  name: 'Avalanche Fuji',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
      webSocket: ['wss://api.avax-test.network/ext/bc/C/ws'],
    },
    public: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
      webSocket: ['wss://api.avax-test.network/ext/bc/C/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace Testnet',
      url: 'https://testnet.snowtrace.io',
    },
  },
  testnet: true,
});

/**
 * Enigma Contract Addresses
 * These will be populated after deployment
 */
export const ENIGMA_CONTRACTS = {
  mainnet: {
    agentRegistry: '' as `0x${string}`,
    trustScoreOracle: '' as `0x${string}`,
    ratingSystem: '' as `0x${string}`,
  },
  testnet: {
    agentRegistry: '' as `0x${string}`,
    trustScoreOracle: '' as `0x${string}`,
    ratingSystem: '' as `0x${string}`,
  },
} as const;

/**
 * Get contract address based on chain
 */
export function getContractAddress(
  contract: keyof typeof ENIGMA_CONTRACTS.mainnet,
  chainId: number
): `0x${string}` {
  const network = chainId === 43114 ? 'mainnet' : 'testnet';
  return ENIGMA_CONTRACTS[network][contract];
}

/**
 * Supported chain IDs
 */
export const SUPPORTED_CHAIN_IDS = [43114, 43113] as const;
export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number];

/**
 * Check if chain is supported
 */
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId);
}
