/**
 * ERC-804 Standard ABI for Autonomous Agents on Avalanche
 * @see docs/backend/erc804.md
 * @see docs/blockchain/overview.md
 */

export const ERC804_ABI = [
  {
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'agentType',
    outputs: [{ type: 'string', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'billingAddress',
    outputs: [{ type: 'address', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ type: 'address', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Type-safe contract read functions for ERC-804
 */
export type ERC804Contract = {
  name: () => Promise<string>;
  agentType: () => Promise<string>;
  billingAddress: () => Promise<`0x${string}`>;
  owner: () => Promise<`0x${string}`>;
};
