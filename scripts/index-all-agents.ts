/**
 * Index ALL agents from Routescan API
 * Fetches all transfers, identifies unique tokens, reads current owners from blockchain
 */
import { PrismaClient } from '@prisma/client';
import {
  createPublicClient,
  http,
  keccak256,
  encodePacked,
  type Address,
} from 'viem';
import { avalanche } from 'viem/chains';

const prisma = new PrismaClient();
const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as Address;
const ROUTESCAN_API = 'https://api.routescan.io/v2/network/mainnet/evm/43114/erc721-transfers';

const ABI = [
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

const client = createPublicClient({
  chain: avalanche,
  transport: http('https://api.avax.network/ext/bc/C/rpc', {
    retryCount: 3,
    timeout: 15_000,
  }),
});

interface Transfer {
  tokenId: string;
  from: string;
  to: string;
  blockNumber: string;
}

async function main() {
  console.log('=== Indexing ALL Agents from Routescan API ===\n');

  let indexed = 0;
  let skipped = 0;
  let failed = 0;
  let nextToken: string | undefined;
  let page = 1;

  // Track which tokens we've seen to avoid duplicates across pages
  const processedTokens = new Set<string>();

  do {
    const url = nextToken
      ? `${ROUTESCAN_API}?tokenAddress=${REGISTRY}&limit=50&nextToken=${nextToken}`
      : `${ROUTESCAN_API}?tokenAddress=${REGISTRY}&limit=50&count=true`;

    console.log(`\n[Page ${page}] Fetching transfers...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error('  API error:', response.status);
      break;
    }

    const data = await response.json();
    console.log(`  Fetched ${data.items.length} transfers`);

    // Find minted tokens in this page (from = 0x0)
    const mints = data.items.filter((t: Transfer) =>
      t.from === '0x0000000000000000000000000000000000000000'
    );
    console.log(`  Found ${mints.length} mints in this page`);

    // Process each minted token
    for (const mint of mints) {
      const tokenIdStr = mint.tokenId;

      // Skip if already processed
      if (processedTokens.has(tokenIdStr)) {
        continue;
      }
      processedTokens.add(tokenIdStr);

      const tokenId = BigInt(tokenIdStr);
      const agentAddress = deriveAgentAddress(REGISTRY, tokenId);

      // Check if exists in DB
      const exists = await prisma.agent.findUnique({
        where: { address: agentAddress },
      });

      if (exists) {
        skipped++;
        continue;
      }

      // Read current owner from blockchain
      let owner: string;
      try {
        owner = await client.readContract({
          address: REGISTRY,
          abi: ABI,
          functionName: 'ownerOf',
          args: [tokenId],
        }) as Address;
        owner = owner.toLowerCase();
      } catch (error) {
        console.error(`  ✗ Token #${tokenId}: No current owner (burned?)`);
        failed++;
        continue;
      }

      // Read tokenURI
      let tokenURI = '';
      try {
        tokenURI = await client.readContract({
          address: REGISTRY,
          abi: ABI,
          functionName: 'tokenURI',
          args: [tokenId],
        }) as string;
      } catch {
        // tokenURI may not exist
      }

      // Resolve agent info
      const agentInfo = resolveAgentInfo(tokenURI, Number(tokenId));

      // Insert to database
      try {
        await prisma.agent.create({
          data: {
            address: agentAddress,
            name: agentInfo.name,
            type: 'CUSTOM',
            description: agentInfo.description,
            owner_address: owner,
            registry_address: REGISTRY,
            token_id: Number(tokenId),
            token_uri: tokenURI,
            status: 'VERIFIED',
          },
        });
        indexed++;
        console.log(`  ✓ Indexed: ${agentInfo.name} (Token #${tokenId})`);
      } catch (error) {
        failed++;
        console.error(`  ✗ Failed Token #${tokenId}:`, error instanceof Error ? error.message : 'Unknown');
      }
    }

    console.log(`  Page summary: ${indexed} indexed, ${skipped} skipped, ${failed} failed`);

    // Pagination
    nextToken = data.link?.nextToken;
    page++;

    // Rate limiting
    if (nextToken) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

  } while (nextToken);

  console.log('\n=== Final Summary ===');
  console.log(`Total indexed: ${indexed}`);
  console.log(`Total skipped: ${skipped}`);
  console.log(`Total failed: ${failed}`);
  console.log(`Unique tokens processed: ${processedTokens.size}`);

  await prisma.$disconnect();
}

function deriveAgentAddress(registry: Address, tokenId: bigint): string {
  const hash = keccak256(encodePacked(['address', 'uint256'], [registry, tokenId]));
  return hash.slice(0, 42);
}

function resolveAgentInfo(tokenURI: string, tokenId: number): { name: string; description: string } {
  const defaultName = `Agent #${tokenId}`;
  const defaultDesc = `Autonomous agent registered in ERC-8004 Identity Registry (Token #${tokenId})`;

  if (!tokenURI) return { name: defaultName, description: defaultDesc };

  if (tokenURI.startsWith('http')) {
    try {
      const url = new URL(tokenURI);
      const parts = url.pathname.split('/').filter(Boolean);
      const pathName = parts.find(p => p !== 'agent.json' && !p.endsWith('.json'));
      if (pathName) {
        const name = pathName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return { name, description: `Autonomous agent "${name}" (Token #${tokenId})` };
      }
    } catch {}
  }

  if (tokenURI.startsWith('data:application/json;base64,')) {
    try {
      const b64 = tokenURI.replace('data:application/json;base64,', '');
      const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
      return {
        name: json.name || defaultName,
        description: json.description || defaultDesc,
      };
    } catch {}
  }

  if (tokenURI.startsWith('data:application/json,')) {
    try {
      const raw = tokenURI.replace('data:application/json,', '');
      const json = JSON.parse(decodeURIComponent(raw));
      return {
        name: json.name || defaultName,
        description: json.description || defaultDesc,
      };
    } catch {}
  }

  return { name: defaultName, description: defaultDesc };
}

main().catch((error) => {
  console.error('Fatal error:', error);
  prisma.$disconnect();
  process.exit(1);
});
