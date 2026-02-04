# Data Flows

## Flow 1: Agent Registration

```
User → Connects Wallet → Frontend captures address
      ↓
Frontend → sends agent_address → API /register
      ↓
API → verifies contract exists on Avalanche (via RPC)
      ↓
API → extracts ERC-804 metadata from contract
      ↓
API → inserts in Supabase (agents table, status: pending)
      ↓
API → triggers Centinela for initial verification
      ↓
Centinela → analyzes proxy, calculates initial trust score
      ↓
API → updates record (status: verified)
      ↓
Frontend ← returns agent_id and redirect to /agent/{address}
```

## Flow 2: Trust Score Update

```
Cron Job (every 1 hour) → triggers recalculation
      ↓
Backend → reads from Supabase:
          • Transaction volume (from Indexer)
          • Heartbeat logs
          • Proxy detection result
          • OZ match score
          • User ratings
      ↓
Backend → applies weighted formula:
          trust_score = (volume * 0.25) + (proxy_ok * 0.20) +
                        (uptime * 0.25) + (oz_score * 0.15) +
                        (ratings * 0.15)
      ↓
Backend → updates agents.trust_score in Supabase
      ↓
Frontend (real-time via Supabase Realtime) → reflects new score
```

## Flow 3: Agent Query (API)

```
External Agent → GET /api/v1/agents/{address}/trust-score
      ↓
API → checks rate limit (Redis or Supabase)
      ↓
API → queries Supabase agents table
      ↓
API ← returns JSON with trust_score + breakdown
      ↓
External Agent → makes decision based on score
```

## Trust Score Formula

```typescript
const WEIGHTS = {
  VOLUME: 0.25,    // 25% - Transaction volume activity
  PROXY: 0.20,    // 20% - No hidden proxy detected
  UPTIME: 0.25,    // 25% - Heartbeat response rate
  OZ_MATCH: 0.15,  // 15% - OpenZeppelin bytecode similarity
  RATINGS: 0.15    // 15% - Community ratings average
};

function calculateTrustScore(agent: Agent): number {
  return (
    agent.volumeScore * WEIGHTS.VOLUME +
    agent.proxyScore * WEIGHTS.PROXY +
    agent.uptimeScore * WEIGHTS.UPTIME +
    agent.ozMatchScore * WEIGHTS.OZ_MATCH +
    agent.ratingsScore * WEIGHTS.RATINGS
  );
}
```

## Trust Score Ranges

| Range | Label | Color | Description |
|-------|-------|-------|-------------|
| 90-100 | Excellent | Green | Highly trusted, all signals positive |
| 70-89 | Good | Blue | Generally trusted, minor concerns |
| 50-69 | Medium | Yellow | Use with caution, some flags |
| 0-49 | Low | Red | Not recommended, significant issues |
