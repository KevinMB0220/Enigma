# Blockchain Integration

## Avalanche Configuration

```typescript
// lib/blockchain/config.ts
import { avalanche, avalancheFuji } from 'viem/chains';

export const CHAINS = {
  mainnet: avalanche,
  testnet: avalancheFuji
} as const;

export const AVALANCHE_CONFIG = {
  mainnet: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    rpcUrl: process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io'
  },
  testnet: {
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://testnet.snowtrace.io'
  }
} as const;

export const ACTIVE_CHAIN = process.env.NEXT_PUBLIC_CHAIN_ENV === 'mainnet'
  ? CHAINS.mainnet
  : CHAINS.testnet;
```

## Viem Client

```typescript
// lib/blockchain/client.ts
import { createPublicClient, http } from 'viem';
import { ACTIVE_CHAIN, AVALANCHE_CONFIG } from './config';

export const publicClient = createPublicClient({
  chain: ACTIVE_CHAIN,
  transport: http(
    AVALANCHE_CONFIG[process.env.NEXT_PUBLIC_CHAIN_ENV === 'mainnet' ? 'mainnet' : 'testnet'].rpcUrl,
    {
      batch: true,
      retryCount: 3,
      retryDelay: 1000
    }
  )
});
```

## ERC-804 ABI

```typescript
// lib/blockchain/abis/erc804.ts
export const ERC804_ABI = [
  {
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'agentType',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'billingAddress',
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
```

## Reading Agent Metadata

```typescript
// services/blockchain-service.ts
import { publicClient } from '@/lib/blockchain/client';
import { ERC804_ABI } from '@/lib/blockchain/abis/erc804';
import type { Address } from 'viem';

export async function readAgentMetadata(address: Address) {
  try {
    const [name, agentType, billingAddress] = await Promise.all([
      publicClient.readContract({
        address,
        abi: ERC804_ABI,
        functionName: 'name'
      }),
      publicClient.readContract({
        address,
        abi: ERC804_ABI,
        functionName: 'agentType'
      }),
      publicClient.readContract({
        address,
        abi: ERC804_ABI,
        functionName: 'billingAddress'
      })
    ]);

    return { name, agentType, billingAddress };
  } catch (error) {
    throw new BlockchainError('Failed to read agent metadata', error);
  }
}
```

## Proxy Detection

```typescript
// services/centinela-service.ts
import { publicClient } from '@/lib/blockchain/client';
import type { Address } from 'viem';

// EIP-1967 storage slots
const EIP1967_SLOTS = {
  IMPLEMENTATION: '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
  BEACON: '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50'
} as const;

export async function detectProxy(address: Address) {
  try {
    // Read bytecode
    const code = await publicClient.getBytecode({ address });

    if (!code || code === '0x') {
      return { isProxy: false };
    }

    // Check EIP-1967 slots
    const implementationSlot = await publicClient.getStorageAt({
      address,
      slot: EIP1967_SLOTS.IMPLEMENTATION
    });

    if (implementationSlot && implementationSlot !== '0x' + '0'.repeat(64)) {
      const implementationAddress = `0x${implementationSlot.slice(-40)}` as Address;

      return {
        isProxy: true,
        proxyType: 'EIP_1967',
        implementationAddress
      };
    }

    // Check Beacon Proxy
    const beaconSlot = await publicClient.getStorageAt({
      address,
      slot: EIP1967_SLOTS.BEACON
    });

    if (beaconSlot && beaconSlot !== '0x' + '0'.repeat(64)) {
      return {
        isProxy: true,
        proxyType: 'BEACON'
      };
    }

    // Pattern matching in bytecode (Transparent Proxy, UUPS)
    const hasProxyPattern = code.includes('delegatecall');

    return {
      isProxy: hasProxyPattern,
      proxyType: hasProxyPattern ? 'TRANSPARENT' : null
    };

  } catch (error) {
    throw new BlockchainError('Failed to detect proxy', error);
  }
}
```

## Proxy Types

| Type | Description | Detection Method |
|------|-------------|------------------|
| **EIP-1967** | Standard proxy with storage slot | Check implementation slot |
| **Transparent** | OpenZeppelin transparent proxy | Bytecode pattern + admin slot |
| **UUPS** | Universal upgradeable proxy | Check implementation slot |
| **Beacon** | Multiple proxies sharing implementation | Check beacon slot |
| **Diamond** | Multi-facet proxy (EIP-2535) | Check facets storage |
