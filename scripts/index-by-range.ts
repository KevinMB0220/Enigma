/**
 * Index agents by iterating through tokenId range
 * Since Routescan API pagination is broken, we'll directly query the contract
 * Automatically calculates trust scores for newly indexed agents
 */
import { PrismaClient } from '@prisma/client';
import { createPublicClient, http, keccak256, encodePacked, type Address } from 'viem';
import { avalanche } from 'viem/chains';
import { updateAgentTrustScore } from '@/services/trust-score-service';

const prisma = new PrismaClient();
const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as Address;
const MAX_TOKEN_ID = 1622; // From Routescan API count

const client = createPublicClient({
  chain: avalanche,
  transport: http('https://api.avax.network/ext/bc/C/rpc', {
    retryCount: 3,
    timeout: 15_000,
  }),
});

const ABI = [
  {
    inputs: [{ type: 'uint256', name: 'tokenId' }],
    name: 'ownerOf',
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

function deriveAgentAddress(registry: Address, tokenId: bigint): string {
  const hash = keccak256(encodePacked(['address', 'uint256'], [registry, tokenId]));
  return hash.slice(0, 42);
}

async function main() {
  console.log('=== Indexing Agents by TokenID Range ===\n');
  console.log(`Registry: ${REGISTRY}`);
  console.log(`Token range: 1 to ${MAX_TOKEN_ID}\n`);

  let indexed = 0;
  let skipped = 0;
  let failed = 0;

  for (let tokenId = 1; tokenId <= MAX_TOKEN_ID; tokenId++) {
    try {
      const agentAddress = deriveAgentAddress(REGISTRY, BigInt(tokenId));

      // Check if exists
      const exists = await prisma.agent.findUnique({
        where: { address: agentAddress },
      });

      if (exists) {
        skipped++;
        if (skipped % 100 === 0) {
          console.log(`  Skipped ${skipped} existing agents...`);
        }
        continue;
      }

      // Get owner from contract
      let owner: string;
      try {
        owner = await client.readContract({
          address: REGISTRY,
          abi: ABI,
          functionName: 'ownerOf',
          args: [BigInt(tokenId)],
        }) as string;
      } catch {
        // Token doesn't exist or was burned
        failed++;
        continue;
      }

      // Insert agent
      await prisma.agent.create({
        data: {
          address: agentAddress,
          name: `Agent #${tokenId}`,
          type: 'CUSTOM',
          description: `Autonomous agent registered in ERC-8004 Identity Registry (Token #${tokenId})`,
          owner_address: owner.toLowerCase(),
          registry_address: REGISTRY,
          token_id: tokenId,
          token_uri: '',
          status: 'VERIFIED',
        },
      });

      // Calculate trust score for newly indexed agent
      try {
        await updateAgentTrustScore(agentAddress);
      } catch (trustError) {
        console.warn(`  ⚠ Failed to calculate trust score for Token #${tokenId}`);
      }

      indexed++;
      if (indexed % 10 === 0) {
        console.log(`  ✓ Indexed ${indexed} agents (current: Token #${tokenId})`);
      }

    } catch (error) {
      failed++;
      if (failed % 10 === 0) {
        console.error(`  ✗ Failed ${failed} tokens`);
      }
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Indexed: ${indexed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  prisma.$disconnect();
  process.exit(1);
});
