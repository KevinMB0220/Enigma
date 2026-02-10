/**
 * ERC-8004 Identity Registry ABI
 * Contract for registering and discovering autonomous agents
 * @see https://eips.ethereum.org/EIPS/eip-8004
 * @see https://github.com/erc-8004/erc-8004-contracts
 */

export const IDENTITY_REGISTRY_ABI = [
  // Registration functions
  {
    inputs: [{ internalType: 'string', name: 'agentURI', type: 'string' }],
    name: 'register',
    outputs: [{ internalType: 'uint256', name: 'agentId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'agentURI', type: 'string' },
      { internalType: 'string[]', name: 'metadataKeys', type: 'string[]' },
      { internalType: 'bytes[]', name: 'metadataValues', type: 'bytes[]' },
    ],
    name: 'register',
    outputs: [{ internalType: 'uint256', name: 'agentId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Agent lookup functions
  {
    inputs: [{ internalType: 'address', name: 'wallet', type: 'address' }],
    name: 'getAgentWallet',
    outputs: [{ internalType: 'uint256', name: 'agentId', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Metadata functions
  {
    inputs: [
      { internalType: 'uint256', name: 'agentId', type: 'uint256' },
      { internalType: 'string', name: 'metadataKey', type: 'string' },
    ],
    name: 'getMetadata',
    outputs: [{ internalType: 'bytes', name: 'metadataValue', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
  // ERC721 standard functions for enumeration
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'agentId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'string', name: 'agentURI', type: 'string' },
    ],
    name: 'AgentRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'agentId', type: 'uint256' },
      { indexed: true, internalType: 'string', name: 'indexedMetadataKey', type: 'string' },
      { indexed: false, internalType: 'string', name: 'metadataKey', type: 'string' },
      { indexed: false, internalType: 'bytes', name: 'metadataValue', type: 'bytes' },
    ],
    name: 'MetadataSet',
    type: 'event',
  },
] as const;
