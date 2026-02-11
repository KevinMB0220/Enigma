import { createPublicClient, http } from 'viem';
import { avalanche } from '@/lib/blockchain/config';
import { IDENTITY_REGISTRY_ABI } from '@/lib/blockchain/abis/identity-registry';
import { prisma } from '@/lib/database/prisma';

const REGISTRY_ADDRESS = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';

async function main() {
  console.log('🔍 Checking indexer status...\n');

  // Connect to blockchain
  const client = createPublicClient({
    chain: avalanche,
    transport: http('https://api.avax.network/ext/bc/C/rpc'),
  });

  // Get on-chain total supply
  const totalSupply = await client.readContract({
    address: REGISTRY_ADDRESS,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: 'totalSupply',
  }) as bigint;

  const onChainCount = Number(totalSupply);

  // Get database count
  const dbCount = await prisma.agent.count({
    where: {
      registry_address: REGISTRY_ADDRESS,
    },
  });

  // Get latest agent from DB
  const latestAgent = await prisma.agent.findFirst({
    where: {
      registry_address: REGISTRY_ADDRESS,
    },
    orderBy: { token_id: 'desc' },
    select: {
      name: true,
      token_id: true,
      created_at: true,
    },
  });

  console.log('📊 On-chain Registry:', REGISTRY_ADDRESS.slice(0, 10) + '...');
  console.log('');
  console.log(`🔗 Total NFTs on blockchain: ${onChainCount}`);
  console.log(`💾 Total agents in database: ${dbCount}`);
  console.log('');

  if (latestAgent) {
    console.log(`🆕 Latest indexed agent: ${latestAgent.name} (Token #${latestAgent.token_id})`);
    console.log(`   Indexed at: ${latestAgent.created_at.toISOString()}`);
    console.log('');
  }

  const missing = onChainCount - dbCount;

  if (missing > 0) {
    console.log(`⚠️  Missing ${missing} agents! Indexer needs to run.`);
    console.log(`   Run: curl -X POST http://localhost:3000/api/v1/indexer/refresh`);
  } else if (missing < 0) {
    console.log(`⚠️  Database has ${Math.abs(missing)} more agents than blockchain?!`);
    console.log('   This should not happen. Check for duplicates or wrong registry.');
  } else {
    console.log(`✅ All agents indexed! Database is in sync with blockchain.`);
  }

  console.log('');
}

main()
  .catch((error) => {
    console.error('❌ Error:', error.message);
  })
  .finally(() => prisma.$disconnect());
