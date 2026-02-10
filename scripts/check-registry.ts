/**
 * Inspect Identity Registry: show unique owners and sample tokenURIs
 * Run: npx tsx scripts/check-registry.ts
 */
import { createPublicClient, http, type Address } from 'viem';
import { avalanche } from 'viem/chains';

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
  transport: http('https://api.avax.network/ext/bc/C/rpc', { retryCount: 3, timeout: 15_000 }),
});

async function main() {
  console.log('=== Registry: unique owners + sample URIs ===\n');

  // 1. Scan mints
  const currentBlock = await client.getBlockNumber();
  const CHUNK = 2048n;
  const BACK = 3_888_000n;
  const start = currentBlock > BACK ? currentBlock - BACK : 0n;

  const mints: { tokenId: number; owner: string }[] = [];
  const burned = new Set<number>();

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
          mints.push({ tokenId: tid, owner: log.args.to! });
        }
        if (log.args.to === '0x0000000000000000000000000000000000000000') {
          burned.add(tid);
        }
      }
    } catch { /* skip */ }
  }

  const active = mints.filter((m) => !burned.has(m.tokenId));
  console.log(`Total mints: ${mints.length}, Burned: ${burned.size}, Active: ${active.length}\n`);

  // 2. Count unique owners
  const ownerTokens = new Map<string, number[]>();
  for (const m of active) {
    const o = m.owner.toLowerCase();
    if (!ownerTokens.has(o)) ownerTokens.set(o, []);
    ownerTokens.get(o)!.push(m.tokenId);
  }

  console.log(`Unique owners: ${ownerTokens.size}\n`);

  // 3. Show top 15 owners by token count
  const sorted = [...ownerTokens.entries()].sort((a, b) => b[1].length - a[1].length);
  console.log('=== Top 15 owners ===');
  for (const [owner, tokens] of sorted.slice(0, 15)) {
    console.log(`  ${owner} -> ${tokens.length} tokens (first: #${tokens[0]})`);
  }

  // 4. Read tokenURIs from different owners (sample 20 diverse tokens)
  console.log('\n=== Sample tokenURIs from different owners ===');
  const sampled = new Set<string>();
  const samples: { tokenId: number; owner: string }[] = [];

  for (const [owner, tokens] of sorted) {
    if (sampled.has(owner)) continue;
    sampled.add(owner);
    samples.push({ tokenId: tokens[0], owner });
    if (samples.length >= 20) break;
  }

  for (const s of samples) {
    let uri = '';
    try {
      uri = await client.readContract({
        address: REGISTRY,
        abi: ABI,
        functionName: 'tokenURI',
        args: [BigInt(s.tokenId)],
      }) as string;
    } catch { /* */ }

    const short = uri ? uri.slice(0, 120) : '(empty)';
    console.log(`  #${s.tokenId} | ${s.owner.slice(0, 12)}... | ${short}`);
  }

  // 5. Count how many have non-empty URIs (sample first 100)
  console.log('\n=== URI stats (first 200 tokens) ===');
  let withUri = 0;
  let emptyUri = 0;
  const uriDomains = new Map<string, number>();

  for (const m of active.slice(0, 200)) {
    let uri = '';
    try {
      uri = await client.readContract({
        address: REGISTRY,
        abi: ABI,
        functionName: 'tokenURI',
        args: [BigInt(m.tokenId)],
      }) as string;
    } catch { /* */ }

    if (uri) {
      withUri++;
      try {
        const domain = new URL(uri).hostname;
        uriDomains.set(domain, (uriDomains.get(domain) || 0) + 1);
      } catch { /* */ }
    } else {
      emptyUri++;
    }
  }

  console.log(`  With URI: ${withUri}, Empty: ${emptyUri}`);
  console.log('  Domains:');
  for (const [domain, count] of [...uriDomains.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${domain}: ${count}`);
  }
}

main().catch(console.error);
