import { prisma } from '@/lib/database/prisma';

async function main() {
  // Get total count
  const total = await prisma.agent.count();
  console.log(`\n📊 Total agents in DB: ${total}\n`);

  // Get recent agents (last 10)
  const recentAgents = await prisma.agent.findMany({
    orderBy: { created_at: 'desc' },
    take: 10,
    select: {
      address: true,
      name: true,
      token_id: true,
      registry_address: true,
      owner_address: true,
      status: true,
      created_at: true,
    },
  });

  console.log('🆕 Most recent agents:\n');
  recentAgents.forEach((agent, i) => {
    console.log(`${i + 1}. ${agent.name}`);
    console.log(`   Address: ${agent.address}`);
    console.log(`   Token ID: ${agent.token_id || 'N/A'}`);
    console.log(`   Registry: ${agent.registry_address ? `${agent.registry_address.slice(0, 10)}...` : 'N/A'}`);
    console.log(`   Owner: ${agent.owner_address.slice(0, 10)}...${agent.owner_address.slice(-8)}`);
    console.log(`   Status: ${agent.status}`);
    console.log(`   Created: ${agent.created_at.toISOString()}`);
    console.log('');
  });

  // Get agents with registry info (ERC-8004)
  const erc8004Agents = await prisma.agent.count({
    where: {
      NOT: {
        registry_address: null,
      },
    },
  });

  console.log(`\n🔗 Agents with ERC-8004 registry: ${erc8004Agents}/${total}\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
