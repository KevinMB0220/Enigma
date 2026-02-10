/**
 * Test reading AgentRegistered events
 */
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';

const REGISTRY_ADDRESS = '0x8004A818BFB912233c491871b3d84c89A494BD9e';

const client = createPublicClient({
  chain: avalancheFuji,
  transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
});

async function main() {
  console.log('Reading AgentRegistered events...');
  console.log('Registry:', REGISTRY_ADDRESS);
  console.log();

  try {
    const logs = await client.getLogs({
      address: REGISTRY_ADDRESS,
      event: {
        type: 'event',
        name: 'AgentRegistered',
        inputs: [
          { indexed: true, type: 'uint256', name: 'agentId' },
          { indexed: true, type: 'address', name: 'owner' },
          { indexed: false, type: 'string', name: 'agentURI' },
        ],
      },
      fromBlock: 0n,
      toBlock: 'latest',
    });

    console.log('✅ Found', logs.length, 'events\n');

    logs.forEach((log, i) => {
      console.log(`Event #${i}:`);
      console.log('  Agent ID:', log.args.agentId?.toString());
      console.log('  Owner:', log.args.owner);
      console.log('  URI:', log.args.agentURI);
      console.log('  Block:', log.blockNumber);
      console.log();
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main().catch(console.error);
