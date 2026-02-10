/**
 * Index agents from ERC-8004 Identity Registry using Routescan API
 * More reliable than reading totalSupply() which reverts
 * 
 * Run: npx tsx scripts/index-from-routescan.ts
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

// Config
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
  txHash: string;
}

interface RoutescanResponse {
  items: Transfer[];
  count: number;
  link?: {
    next?: string;
    nextToken?: string;
  };
}

async function main() {
  console.log('=== Indexing Agents from Routescan API ===\n');
  console.log('Registry:', REGISTRY);

  let indexed = 0;
  let skipped = 0;
  let failed = 0;
  let offset = 0;
  let page = 1;
  const limit = 50;

  // Get total count
  const countRes = await fetch(`${ROUTESCAN_API}?tokenAddress=${REGISTRY}&limit=1&count=true`);
  const countData: RoutescanResponse = await countRes.json();
  const totalTransfers = countData.count || 0;

  console.log(`Total transfers in API: ${totalTransfers}\n`);

  // Fetch all transfers in batches using offset
  while (offset < totalTransfers) {
    const url = `${ROUTESCAN_API}?tokenAddress=${REGISTRY}&limit=${limit}&offset=${offset}`;

    console.log(`\n[Page ${page}] Fetching transfers (offset ${offset})...`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        break;
      }

      const data: RoutescanResponse = await response.json();
      console.log(`  Fetched ${data.items.length} transfers`);

      // Process mints (from = 0x0)
      const mints = data.items.filter(t => t.from === '0x0000000000000000000000000000000000000000');
      console.log(`  Found ${mints.length} mints`);

      // Get current owners for each tokenId
      const tokenOwners = new Map<string, string>();
      for (const mint of mints) {
        const tokenId = mint.tokenId;
        
        // Find the latest transfer for this token (current owner)
        const latestTransfer = data.items
          .filter(t => t.tokenId === tokenId)
          .sort((a, b) => parseInt(b.blockNumber) - parseInt(a.blockNumber))[0];
        
        if (latestTransfer && latestTransfer.to !== '0x0000000000000000000000000000000000000000') {
          tokenOwners.set(tokenId, latestTransfer.to);
        }
      }

      // Process each unique token
      for (const [tokenIdStr, owner] of tokenOwners) {
        const tokenId = BigInt(tokenIdStr);
        const agentAddress = deriveAgentAddress(REGISTRY, tokenId);

        // Check if exists
        const exists = await prisma.agent.findUnique({
          where: { address: agentAddress },
        });

        if (exists) {
          skipped++;
          if (skipped % 10 === 0) {
            console.log(`  Skipped ${skipped} existing agents so far...`);
          }
          continue;
        }

        // Skip tokenURI for faster indexing (can be fetched later if needed)
        let tokenURI = '';

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
              owner_address: owner.toLowerCase(),
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
          console.error(`  ✗ Failed Token #${tokenId}:`, error instanceof Error ? error.message : 'Unknown error');
        }
      }

      // Move to next page
      offset += limit;
      page++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Fetch error:', error instanceof Error ? error.message : error);
      break;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Indexed: ${indexed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);

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

  // Extract name from URL path
  if (tokenURI.startsWith('http')) {
    try {
      const url = new URL(tokenURI);
      const parts = url.pathname.split('/').filter(Boolean);
      const pathName = parts.find(p => p !== 'agent.json' && !p.endsWith('.json'));
      if (pathName) {
        const name = pathName
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
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

  // Data URIs
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
