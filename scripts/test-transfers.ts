/**
 * Test reading ERC-721 Transfer events (mints from 0x0)
 */
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';

const REGISTRY_ADDRESS = '0x8004A818BFB912233c491871b3d84c89A494BD9e';

const client = createPublicClient({
  chain: avalancheFuji,
  transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
});

async function main() {
  console.log('Reading Transfer events (mints from 0x0)...');
  console.log('Registry:', REGISTRY_ADDRESS);
  console.log();

  const currentBlock = await client.getBlockNumber();
  const BLOCKS_TO_READ = 302_400n; // Last 7 days
  const startBlock = currentBlock > BLOCKS_TO_READ ? currentBlock - BLOCKS_TO_READ : 0n;

  console.log('Current block:', currentBlock);
  console.log('Start block:', startBlock);
  console.log('Blocks to scan:', currentBlock - startBlock, '\n');

  try {
    // ERC-721 Transfer event: Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
    const logs = await client.getLogs({
      address: REGISTRY_ADDRESS,
      event: {
        type: 'event',
        name: 'Transfer',
        inputs: [
          { indexed: true, type: 'address', name: 'from' },
          { indexed: true, type: 'address', name: 'to' },
          { indexed: true, type: 'uint256', name: 'tokenId' },
        ],
      },
      fromBlock: startBlock,
      toBlock: currentBlock,
    });

    console.log('✅ Found', logs.length, 'Transfer events\n');

    // Filter only mints (from 0x0)
    const mints = logs.filter(
      (log) => log.args.from === '0x0000000000000000000000000000000000000000'
    );

    console.log('🎯 Found', mints.length, 'mints (registrations)\n');

    mints.forEach((log, i) => {
      console.log(`Mint #${i}:`);
      console.log('  Token ID:', log.args.tokenId?.toString());
      console.log('  Owner:', log.args.to);
      console.log('  Block:', log.blockNumber);
      console.log();
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main().catch(console.error);
