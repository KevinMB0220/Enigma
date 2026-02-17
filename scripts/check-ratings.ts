import { PrismaClient } from '@prisma/client';
import { updateAgentTrustScore } from '../src/services/trust-score-service';
import { syncAgentsFromRoutescan } from '../src/services/routescan-indexer-service';

const prisma = new PrismaClient();

const AGENT_ADDRESS = '0x9b59db8e7534924e34baa67a86454125cb02206d';

async function main() {
  // Run indexer to refresh metadata from blockchain
  console.log('=== Running Indexer ===');
  const indexResult = await syncAgentsFromRoutescan();
  console.log(`Indexed: ${indexResult.indexed} | Skipped: ${indexResult.skipped} | Failed: ${indexResult.failed}`);

  // Check ratings
  const count = await prisma.rating.count();
  console.log(`\n=== Ratings (${count} total) ===`);

  if (count > 0) {
    const recent = await prisma.rating.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        agentId: true,
        userAddress: true,
        rating: true,
        review: true,
        createdAt: true,
      }
    });
    console.log(JSON.stringify(recent, null, 2));
  }

  // Get agent with full info
  const agent = await prisma.agent.findUnique({
    where: { address: AGENT_ADDRESS },
    select: {
      address: true,
      name: true,
      description: true,
      token_id: true,
      token_uri: true,
      registry_address: true,
      metadata: true,
      trust_score: true,
    }
  });

  if (agent) {
    console.log('\n=== Agent Info ===');
    console.log(`Address:  ${agent.address}`);
    console.log(`Name:     ${agent.name}`);
    console.log(`Desc:     ${agent.description || 'N/A'}`);
    console.log(`Token ID: ${agent.token_id ?? 'N/A'}`);
    console.log(`Registry: ${agent.registry_address || 'N/A'}`);
    console.log(`URI:      ${agent.token_uri || 'N/A'}`);
    console.log(`Score:    ${agent.trust_score}`);

    if (agent.metadata) {
      console.log('\n=== Metadata ===');
      console.log(JSON.stringify(agent.metadata, null, 2));
    } else {
      console.log('\n⚠ No metadata stored');
    }

    // Update trust score
    console.log('\n=== Updating Trust Score ===');
    const result = await updateAgentTrustScore(agent.address);
    console.log(`New Score: ${result.score} (was ${agent.trust_score})`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  prisma.$disconnect();
  process.exit(1);
});
