import { createPublicClient, http, keccak256, encodePacked, type Address, type PublicClient } from 'viem';
import { createLogger } from '@/lib/utils/logger';
import { avalanche, avalancheFuji } from '@/lib/blockchain/config';
import { IDENTITY_REGISTRY_ABI } from '@/lib/blockchain/abis/identity-registry';
import { createAgent, agentExists } from './agent-service';
import type { CreateAgentInput } from './agent-service';
import { prisma } from '@/lib/database/prisma';

const logger = createLogger('indexer-service');

// ── Registry addresses per network ─────────────────────────────────
const REGISTRY_ADDRESSES = {
  mainnet: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as Address,
  testnet: '0x8004A818BFB912233c491871b3d84c89A494BD9e' as Address,
};

// ── Dedicated RPC clients (independent of app's CHAIN_ENV) ─────────
const mainnetClient = createPublicClient({
  chain: avalanche,
  transport: http('https://api.avax.network/ext/bc/C/rpc', {
    retryCount: 3,
    retryDelay: 1000,
    timeout: 15_000,
  }),
});

const testnetClient = createPublicClient({
  chain: avalancheFuji,
  transport: http('https://api.avax-test.network/ext/bc/C/rpc', {
    retryCount: 3,
    retryDelay: 1000,
    timeout: 15_000,
  }),
});

export type Network = 'mainnet' | 'testnet';

function getClient(network: Network): PublicClient {
  return network === 'mainnet' ? mainnetClient : testnetClient;
}

// ── Types ──────────────────────────────────────────────────────────

export interface IndexerResult {
  network: Network;
  indexed: number;
  skipped: number;
  failed: number;
  total: number;
  details: {
    tokenId: number;
    owner: Address;
    name: string;
    status: 'indexed' | 'skipped' | 'failed';
    reason?: string;
  }[];
}

interface AgentInfo {
  tokenId: bigint;
  owner: Address;
  name: string;
  description: string;
  tokenURI: string;
}

// ── Main sync function ─────────────────────────────────────────────

/**
 * Sync agents from both mainnet and testnet Identity Registries.
 * Scans Transfer events to discover all minted agent NFTs.
 *
 * @param limit - Max number of agents to index per network (0 = all)
 */
export async function syncAgents(limit = 0): Promise<{
  mainnet: IndexerResult;
  testnet: IndexerResult;
}> {
  const [mainnetResult, testnetResult] = await Promise.all([
    syncNetwork('mainnet', limit),
    syncNetwork('testnet', limit),
  ]);

  return { mainnet: mainnetResult, testnet: testnetResult };
}

/**
 * Sync agents from a specific network using Transfer events.
 * Scans for all Transfer events from the registry contract to discover agents.
 *
 * @param network - 'mainnet' or 'testnet'
 * @param limit - Max number of agents to index (0 = all)
 */
export async function syncNetwork(network: Network, limit = 0): Promise<IndexerResult> {
  const client = getClient(network);
  const registry = REGISTRY_ADDRESSES[network];

  const result: IndexerResult = {
    network,
    indexed: 0,
    skipped: 0,
    failed: 0,
    total: 0,
    details: [],
  };

  logger.info({ network, registry, limit }, 'Starting agent sync via Transfer events');

  // Get the current block number
  const currentBlock = await client.getBlockNumber();

  // Scan Transfer events from deployment block to current
  // For mainnet, start from a recent block to avoid scanning millions of blocks
  const fromBlock = network === 'mainnet' ? currentBlock - 100000n : 0n;

  logger.info({ network, fromBlock, currentBlock }, 'Fetching Transfer events');

  // Get the latest agent from DB to know where to start
  const latestAgent = await prisma.agent.findFirst({
    where: { registry_address: registry },
    orderBy: { token_id: 'desc' },
    select: { token_id: true },
  });

  const startTokenId = latestAgent?.token_id ? latestAgent.token_id + 1 : 0;

  logger.info({ network, startTokenId }, 'Starting from token ID');

  // Since we don't have a reliable way to enumerate, we'll try sequential token IDs
  // Start from the last known token and try the next 100 tokens
  const maxTokensToTry = limit > 0 ? limit : 100;
  const tokenIdsToTry: bigint[] = [];

  for (let i = startTokenId; i < startTokenId + maxTokensToTry; i++) {
    tokenIdsToTry.push(BigInt(i));
  }

  result.total = tokenIdsToTry.length;

  logger.info({ network, tokensToTry: tokenIdsToTry.length }, 'Trying sequential token IDs');

  // Process each potential token ID
  for (const tokenId of tokenIdsToTry) {
    let owner: Address;
    let tokenURI: string;

    try {
      // Try to get tokenURI - if it exists, the token is valid
      tokenURI = await client.readContract({
        address: registry,
        abi: IDENTITY_REGISTRY_ABI,
        functionName: 'tokenURI',
        args: [tokenId],
      }) as string;

      // Fetch Transfer events for this specific token to get the owner
      const transferLogs = await client.getLogs({
        address: registry,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { type: 'address', indexed: true, name: 'from' },
            { type: 'address', indexed: true, name: 'to' },
            { type: 'uint256', indexed: true, name: 'tokenId' },
          ],
        },
        args: {
          tokenId: tokenId,
        },
        fromBlock: fromBlock,
        toBlock: currentBlock,
      });

      // Find the mint event (from = 0x0) to get the original owner
      const mintEvent = transferLogs.find((log) => log.args.from === '0x0000000000000000000000000000000000000000');
      owner = mintEvent?.args.to as Address || '0x0000000000000000000000000000000000000000' as Address;
    } catch (error) {
      // Token doesn't exist or was burned, skip it
      result.skipped++;
      continue;
    }
    const agentAddress = deriveAgentAddress(registry, tokenId);

    try {
      // Check if already in DB
      const exists = await agentExists(agentAddress);
      if (exists) {
        result.skipped++;
        result.details.push({
          tokenId: Number(tokenId),
          owner,
          name: '',
          status: 'skipped',
          reason: 'Already exists',
        });
        continue;
      }

      // Read tokenURI
      let tokenURI = '';
      try {
        tokenURI = await client.readContract({
          address: registry,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'tokenURI',
          args: [tokenId],
        }) as string;
      } catch {
        // tokenURI may not exist for some tokens
      }

      // Resolve agent info from URI
      const agentInfo = await resolveAgentInfo(tokenId, owner, tokenURI);

      // Save to database
      const agentData: CreateAgentInput = {
        address: agentAddress,
        name: agentInfo.name,
        type: 'CUSTOM',
        description: agentInfo.description,
        owner_address: owner,
        registry_address: registry,
        token_id: Number(tokenId),
        token_uri: tokenURI,
        status: 'VERIFIED',
      };

      await createAgent(agentData);

      result.indexed++;
      result.details.push({
        tokenId: Number(tokenId),
        owner,
        name: agentInfo.name,
        status: 'indexed',
      });

      logger.info({ tokenId: Number(tokenId), agentAddress, name: agentInfo.name }, 'Agent indexed');
    } catch (error) {
      result.failed++;
      result.details.push({
        tokenId: Number(tokenId),
        owner,
        name: '',
        status: 'failed',
        reason: error instanceof Error ? error.message : 'Unknown error',
      });
      logger.warn({ tokenId: Number(tokenId), error }, 'Failed to index agent');
    }
  }

  logger.info(
    { network, indexed: result.indexed, skipped: result.skipped, failed: result.failed },
    'Agent sync completed'
  );

  return result;
}

// ── Agent info resolution ──────────────────────────────────────────

/**
 * Resolve agent info from tokenURI.
 * Tries to fetch JSON from URI; falls back to extracting name from URL path.
 */
async function resolveAgentInfo(
  tokenId: bigint,
  owner: Address,
  tokenURI: string
): Promise<AgentInfo> {
  const id = Number(tokenId);
  const defaultInfo: AgentInfo = {
    tokenId,
    owner,
    name: `Agent #${id}`,
    description: `Autonomous agent registered in Identity Registry (Token #${id})`,
    tokenURI,
  };

  if (!tokenURI) return defaultInfo;

  // Data URIs (base64)
  if (tokenURI.startsWith('data:application/json;base64,')) {
    try {
      const b64 = tokenURI.replace('data:application/json;base64,', '');
      const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
      return parseAgentJson(json, tokenId, owner, tokenURI);
    } catch {
      return defaultInfo;
    }
  }

  // Data URIs (plain)
  if (tokenURI.startsWith('data:application/json,')) {
    try {
      const raw = tokenURI.replace('data:application/json,', '');
      const json = JSON.parse(decodeURIComponent(raw));
      return parseAgentJson(json, tokenId, owner, tokenURI);
    } catch {
      return defaultInfo;
    }
  }

  // HTTP URIs - try fetch
  if (tokenURI.startsWith('http')) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(tokenURI, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const json = await response.json();
        return parseAgentJson(json, tokenId, owner, tokenURI);
      }
    } catch {
      // URI not accessible, extract name from URL path
    }

    const pathName = extractNameFromURI(tokenURI);
    if (pathName) {
      return {
        ...defaultInfo,
        name: pathName,
        description: `Autonomous agent "${pathName}" (Token #${id})`,
      };
    }
  }

  return defaultInfo;
}

/**
 * Parse agent JSON metadata (follows NFT metadata standard)
 */
function parseAgentJson(
  json: Record<string, unknown>,
  tokenId: bigint,
  owner: Address,
  tokenURI: string
): AgentInfo {
  const id = Number(tokenId);
  return {
    tokenId,
    owner,
    name: (json.name as string) || `Agent #${id}`,
    description:
      (json.description as string) ||
      `Autonomous agent registered in Identity Registry (Token #${id})`,
    tokenURI,
  };
}

/**
 * Extract a human-readable name from a tokenURI path.
 * e.g. "https://agents.ultravioleta.xyz/faro/agent.json" -> "Faro"
 */
function extractNameFromURI(uri: string): string | null {
  try {
    const url = new URL(uri);
    const parts = url.pathname.split('/').filter(Boolean);
    const name = parts.find((p) => p !== 'agent.json' && !p.endsWith('.json'));
    if (name) {
      return name
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  } catch {
    // Not a valid URL
  }
  return null;
}

/**
 * Derive a deterministic address for an agent from its registry + tokenId.
 * Since multiple NFTs can belong to the same owner, we need a unique address
 * per token. This creates a pseudo-address from keccak256(registry, tokenId),
 * taking the first 20 bytes.
 */
function deriveAgentAddress(registry: Address, tokenId: bigint): string {
  const hash = keccak256(
    encodePacked(['address', 'uint256'], [registry, tokenId])
  );
  return hash.slice(0, 42);
}
