import { prisma } from '@/lib/database/prisma';

async function main() {
  console.log('🗑️  Deleting agents without registry info...\n');

  // Show what will be deleted
  const badAgents = await prisma.agent.findMany({
    where: {
      registry_address: null,
    },
    select: {
      address: true,
      name: true,
      created_at: true,
    },
  });

  console.log(`Found ${badAgents.length} agents without registry info:\n`);
  badAgents.forEach((agent, i) => {
    console.log(`${i + 1}. ${agent.name} (${agent.address.slice(0, 10)}...)`);
  });

  console.log('\n');

  // Delete them
  const deleted = await prisma.agent.deleteMany({
    where: {
      registry_address: null,
    },
  });

  console.log(`✅ Deleted ${deleted.count} agents\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
