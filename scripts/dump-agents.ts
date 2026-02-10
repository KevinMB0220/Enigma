/**
 * Step 1: Dump all agent data from mainnet Identity Registry to a JSON file.
 * This reads blockchain ONCE and saves everything locally.
 *
 * Run: npx tsx scripts/dump-agents.ts
 * Output: scripts/agents-dump.json
 */
import { createPublicClient, http, type Address } from 'viem';
import { avalanche } from 'viem/chains';
import { writeFileSync } from 'fs';
import { join } from 'path';

const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as Address;

const ABI = [
  {
    inputs: [{ type: 'uint256', name: 'tokenId' }],
    name: 'tokenURI',
    outputs: [{ type: 'string' }],
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

interface Mint {
  tokenId: number;
  owner: string;
  block: string;
}

interface AgentDump {
  address: string;       // owner wallet (PK for DB, real address for Snowtrace)
  name: string;
  type: string;
  description: string;
  owner_address: string;
  tokenId: number;
  tokenURI: string;
  network: string;
}

async function main() {
  console.log('=== Step 1: Dump agents from mainnet Identity Registry ===\n');
  console.log('Registry:', REGISTRY);

  // 1. Scan Transfer events to find all mints
  console.log('\n[1/3] Scanning Transfer events...');
  const mints = await scanMints();
  console.log(`Found ${mints.length} minted tokens\n`);

  // 2. Read tokenURIs in parallel batches
  console.log('[2/3] Reading tokenURIs...');
  const BATCH = 10;
  const tokenURIs: Map<number, string> = new Map();

  for (let i = 0; i < mints.length; i += BATCH) {
    const batch = mints.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map((m) =>
        client.readContract({
          address: REGISTRY,
          abi: ABI,
          functionName: 'tokenURI',
          args: [BigInt(m.tokenId)],
        })
      )
    );

    results.forEach((r, idx) => {
      const tid = batch[idx].tokenId;
      tokenURIs.set(tid, r.status === 'fulfilled' ? (r.value as string) : '');
    });

    if ((i / BATCH) % 20 === 0) {
      process.stdout.write(`\r  ${Math.min(i + BATCH, mints.length)}/${mints.length} tokens read`);
    }
  }
  console.log(`\n  Done: ${tokenURIs.size} URIs read\n`);

  // 3. Group by owner (1 agent per wallet, use first token's data)
  console.log('[3/3] Grouping by owner and resolving names...');
  const ownerMap = new Map<string, AgentDump>();

  for (const mint of mints) {
    const ownerLower = mint.owner.toLowerCase();
    if (ownerMap.has(ownerLower)) continue; // already have this owner

    const uri = tokenURIs.get(mint.tokenId) || '';
    const info = resolveName(uri, mint.tokenId);

    ownerMap.set(ownerLower, {
      address: ownerLower,
      name: info.name,
      type: 'CUSTOM',
      description: info.description,
      owner_address: ownerLower,
      tokenId: mint.tokenId,
      tokenURI: uri,
      network: 'mainnet',
    });
  }

  const agents = Array.from(ownerMap.values());
  console.log(`  Unique owners (agents): ${agents.length}`);

  // 4. Save to JSON
  const outPath = join(__dirname, 'agents-dump.json');
  writeFileSync(outPath, JSON.stringify(agents, null, 2));
  console.log(`\nSaved to: ${outPath}`);
  console.log(`Total agents: ${agents.length}`);

  // Print first 5 as sample
  console.log('\n=== Sample (first 5) ===');
  for (const a of agents.slice(0, 5)) {
    console.log(`  ${a.address.slice(0, 10)}... | ${a.name} | Token #${a.tokenId}`);
  }
}

// ── Scan Transfer events ───────────────────────────────────────────

async function scanMints(): Promise<Mint[]> {
  const currentBlock = await client.getBlockNumber();
  const CHUNK = 2048n;
  const BACK = 3_888_000n; // ~90 days
  const start = currentBlock > BACK ? currentBlock - BACK : 0n;

  const mints: Mint[] = [];
  const burned = new Set<number>();
  let chunks = 0;

  for (let from = start; from <= currentBlock; from += CHUNK) {
    const to = from + CHUNK - 1n > currentBlock ? currentBlock : from + CHUNK - 1n;

    try {
      const logs = await client.getLogs({
        address: REGISTRY,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { indexed: true, type: 'address', name: 'from' },
            { indexed: true, type: 'address', name: 'to' },
            { indexed: true, type: 'uint256', name: 'tokenId' },
          ],
        },
        fromBlock: from,
        toBlock: to,
      });

      for (const log of logs) {
        const tid = Number(log.args.tokenId!);
        if (log.args.from === '0x0000000000000000000000000000000000000000') {
          mints.push({ tokenId: tid, owner: log.args.to!, block: log.blockNumber.toString() });
        }
        if (log.args.to === '0x0000000000000000000000000000000000000000') {
          burned.add(tid);
        }
      }
    } catch {
      // skip
    }

    chunks++;
    if (chunks % 100 === 0) {
      process.stdout.write(`\r  ${chunks} chunks scanned (${mints.length} mints)`);
    }
  }
  process.stdout.write('\n');

  return mints.filter((m) => !burned.has(m.tokenId));
}

// ── Name resolution ────────────────────────────────────────────────

function resolveName(uri: string, tokenId: number): { name: string; description: string } {
  const fallback = {
    name: `Agent #${tokenId}`,
    description: `Autonomous agent registered in ERC-8004 Identity Registry (Token #${tokenId})`,
  };

  if (!uri) return fallback;

  // Extract name from URL path: https://agents.ultravioleta.xyz/faro/agent.json -> "Faro"
  if (uri.startsWith('http')) {
    try {
      const parts = new URL(uri).pathname.split('/').filter(Boolean);
      const seg = parts.find((p) => !p.endsWith('.json'));
      if (seg) {
        const name = seg.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return { name, description: `Autonomous agent "${name}" - ERC-8004 Token #${tokenId}` };
      }
    } catch { /* */ }
  }

  // data URI
  try {
    let json: Record<string, string> | undefined;
    if (uri.startsWith('data:application/json;base64,')) {
      json = JSON.parse(Buffer.from(uri.slice(29), 'base64').toString());
    } else if (uri.startsWith('data:application/json,')) {
      json = JSON.parse(decodeURIComponent(uri.slice(22)));
    }
    if (json?.name) {
      return { name: json.name, description: json.description || fallback.description };
    }
  } catch { /* */ }

  return fallback;
}

main().catch(console.error);
