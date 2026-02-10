/**
 * Seed script: Index ALL agents from ERC-8004 Identity Registry into database.
 *
 * Reads Transfer (mint) events from mainnet + testnet, resolves tokenURIs,
 * and inserts agents into Supabase PostgreSQL via Prisma.
 *
 * Run: npx tsx scripts/seed-agents.ts
 */
import { PrismaClient } from '@prisma/client';
import {
  createPublicClient,
  http,
  keccak256,
  encodePacked,
  type Address,
  type PublicClient,
} from 'viem';

const prisma = new PrismaClient();

// ── Config ─────────────────────────────────────────────────────────

const NETWORKS = {
  mainnet: {
    registry: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as Address,
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 43114,
  },
  testnet: {
    registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e' as Address,
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: 43113,
  },
} as const;

const IDENTITY_REGISTRY_ABI = [
  {
    inputs: [{ type: 'uint256', name: 'tokenId' }],
    name: 'tokenURI',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ type: 'uint256', name: 'tokenId' }],
    name: 'ownerOf',
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

type NetworkName = keyof typeof NETWORKS;

interface MintEvent {
  tokenId: bigint;
  owner: Address;
  blockNumber: bigint;
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log('=== Agent Seeder: Indexing from ERC-8004 Identity Registry ===\n');

  for (const [name, config] of Object.entries(NETWORKS)) {
    const network = name as NetworkName;
    console.log(`\n━━━ ${network.toUpperCase()} ━━━`);
    console.log(`Registry: ${config.registry}`);

    const client = createPublicClient({
      transport: http(config.rpc, { retryCount: 3, retryDelay: 1000, timeout: 15_000 }),
    });

    try {
      await seedNetwork(client, network, config.registry);
    } catch (error) {
      console.error(`  ERROR on ${network}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log('\n=== Done! ===');
  await prisma.$disconnect();
}

async function seedNetwork(client: PublicClient, network: NetworkName, registry: Address) {
  // 1. Discover all mints
  console.log('  Scanning Transfer events...');
  const mints = await discoverMints(client, registry);
  console.log(`  Found ${mints.length} active agents`);

  if (mints.length === 0) return;

  // 2. Read tokenURIs in batches and insert
  let indexed = 0;
  let skipped = 0;
  let failed = 0;

  // Process in batches of 20 for DB inserts
  const BATCH_SIZE = 20;

  for (let i = 0; i < mints.length; i += BATCH_SIZE) {
    const batch = mints.slice(i, i + BATCH_SIZE);
    const agentsToInsert: {
      address: string;
      name: string;
      type: 'CUSTOM';
      description: string;
      owner_address: string;
      registry_address: string;
      token_id: number;
      token_uri: string;
      status: 'VERIFIED';
    }[] = [];

    for (const mint of batch) {
      const tokenId = Number(mint.tokenId);
      const agentAddress = deriveAgentAddress(registry, mint.tokenId);

      // Check if exists
      const exists = await prisma.agent.findUnique({
        where: { address: agentAddress },
        select: { address: true },
      });

      if (exists) {
        skipped++;
        continue;
      }

      // Read tokenURI
      let tokenURI = '';
      try {
        tokenURI = (await client.readContract({
          address: registry,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: 'tokenURI',
          args: [mint.tokenId],
        })) as string;
      } catch {
        // no tokenURI
      }

      // Resolve name
      const agentInfo = resolveAgentInfo(tokenURI, tokenId);

      agentsToInsert.push({
        address: agentAddress,
        name: agentInfo.name,
        type: 'CUSTOM',
        description: agentInfo.description,
        owner_address: mint.owner.toLowerCase(),
        registry_address: registry,
        token_id: Number(mint.tokenId),
        token_uri: tokenURI,
        status: 'VERIFIED',
      });
    }

    // Bulk insert
    if (agentsToInsert.length > 0) {
      try {
        const result = await prisma.agent.createMany({
          data: agentsToInsert,
          skipDuplicates: true,
        });
        indexed += result.count;
      } catch (error) {
        failed += agentsToInsert.length;
        console.error(`  Batch insert error:`, error instanceof Error ? error.message : error);
      }
    }

    const progress = Math.min(i + BATCH_SIZE, mints.length);
    process.stdout.write(`\r  Progress: ${progress}/${mints.length} (indexed: ${indexed}, skipped: ${skipped}, failed: ${failed})`);
  }

  console.log(`\n  ✓ ${network}: ${indexed} indexed, ${skipped} skipped, ${failed} failed`);
}

// ── Event scanning ─────────────────────────────────────────────────

async function discoverMints(client: PublicClient, registry: Address): Promise<MintEvent[]> {
  const currentBlock = await client.getBlockNumber();
  const CHUNK_SIZE = 2048n;
  // Scan last 90 days
  const BLOCKS_BACK = 3_888_000n;
  const startBlock = currentBlock > BLOCKS_BACK ? currentBlock - BLOCKS_BACK : 0n;

  const mints: MintEvent[] = [];
  const burnedIds = new Set<bigint>();
  let chunks = 0;
  const totalChunks = Number((currentBlock - startBlock) / CHUNK_SIZE) + 1;

  for (let fromBlock = startBlock; fromBlock <= currentBlock; fromBlock += CHUNK_SIZE) {
    const toBlock = fromBlock + CHUNK_SIZE - 1n > currentBlock ? currentBlock : fromBlock + CHUNK_SIZE - 1n;

    try {
      const logs = await client.getLogs({
        address: registry,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { indexed: true, type: 'address', name: 'from' },
            { indexed: true, type: 'address', name: 'to' },
            { indexed: true, type: 'uint256', name: 'tokenId' },
          ],
        },
        fromBlock,
        toBlock,
      });

      for (const log of logs) {
        if (log.args.from === '0x0000000000000000000000000000000000000000') {
          mints.push({ tokenId: log.args.tokenId!, owner: log.args.to!, blockNumber: log.blockNumber });
        }
        if (log.args.to === '0x0000000000000000000000000000000000000000') {
          burnedIds.add(log.args.tokenId!);
        }
      }
    } catch {
      // skip
    }

    chunks++;
    if (chunks % 100 === 0) {
      process.stdout.write(`\r  Scanning blocks: ${chunks}/${totalChunks} chunks (${mints.length} mints found)`);
    }
  }
  process.stdout.write('\n');

  return mints.filter((m) => !burnedIds.has(m.tokenId));
}

// ── Helpers ────────────────────────────────────────────────────────

function deriveAgentAddress(registry: Address, tokenId: bigint): string {
  const hash = keccak256(encodePacked(['address', 'uint256'], [registry, tokenId]));
  return hash.slice(0, 42); // 0x + 40 hex chars = 20 bytes
}

function resolveAgentInfo(tokenURI: string, tokenId: number): { name: string; description: string } {
  const defaultName = `Agent #${tokenId}`;
  const defaultDesc = `Autonomous agent registered in ERC-8004 Identity Registry (Token #${tokenId})`;

  if (!tokenURI) return { name: defaultName, description: defaultDesc };

  // Try to extract name from URL path
  // e.g. "https://agents.ultravioleta.xyz/faro/agent.json" -> "Faro"
  if (tokenURI.startsWith('http')) {
    try {
      const url = new URL(tokenURI);
      const parts = url.pathname.split('/').filter(Boolean);
      const pathName = parts.find((p) => p !== 'agent.json' && !p.endsWith('.json'));
      if (pathName) {
        const name = pathName
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return {
          name,
          description: `Autonomous agent "${name}" (Token #${tokenId})`,
        };
      }
    } catch {
      // not a valid URL
    }
  }

  // Try data URIs
  if (tokenURI.startsWith('data:application/json;base64,')) {
    try {
      const b64 = tokenURI.replace('data:application/json;base64,', '');
      const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
      return {
        name: json.name || defaultName,
        description: json.description || defaultDesc,
      };
    } catch {
      // invalid
    }
  }

  if (tokenURI.startsWith('data:application/json,')) {
    try {
      const raw = tokenURI.replace('data:application/json,', '');
      const json = JSON.parse(decodeURIComponent(raw));
      return {
        name: json.name || defaultName,
        description: json.description || defaultDesc,
      };
    } catch {
      // invalid
    }
  }

  return { name: defaultName, description: defaultDesc };
}

main().catch((error) => {
  console.error('Fatal error:', error);
  prisma.$disconnect();
  process.exit(1);
});
