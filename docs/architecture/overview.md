# System Architecture

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  Next.js 14 App Router + TypeScript + TailwindCSS           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │   Scanner    │  │Agent Profile │      │
│  │    Page      │  │  (Directory) │  │    Detail    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                  │              │
│           └────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│         Next.js API Routes (Backend for Frontend)            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  /agents   │  │ /register  │  │/trust-score│            │
│  │   (list)   │  │  (create)  │  │  (detail)  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (Supabase)                       │
│                      PostgreSQL                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   agents   │  │ heartbeats │  │   ratings  │            │
│  │   table    │  │    logs    │  │   table    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │
┌────────────────────────────┴────────────────────────────────┐
│                  BACKGROUND SERVICES                         │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │    Indexer Job      │  │   Centinela Engine  │          │
│  │  (every 15 min)     │  │   (verification)    │          │
│  │                     │  │                     │          │
│  │ • Scan blockchain   │  │ • Proxy detection   │          │
│  │ • Update tx volume  │  │ • Heartbeat checks  │          │
│  │ • New agents        │  │ • OZ comparison     │          │
│  └─────────────────────┘  └─────────────────────┘          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              AVALANCHE C-CHAIN (Blockchain)                  │
│                    ChainID: 43114                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Agent 1   │  │  Agent 2   │  │  Agent N   │            │
│  │ (ERC-804)  │  │ (ERC-804)  │  │ (ERC-804)  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                              │
│  [Read-only: bytecode, metadata, transaction history]       │
└─────────────────────────────────────────────────────────────┘
```

## System Components

### Frontend (Next.js App)

**Responsibilities**:
- Render UI (landing, scanner, agent profile)
- Connect wallet (wagmi + viem)
- Consume own REST API
- State management (TanStack Query)
- Client-side validation (Zod)

**Does NOT**:
- Direct blockchain queries (delegates to API)
- Direct Supabase queries (only via API)
- Business logic (trust score, proxy detection)

### Backend (Next.js API Routes)

**Responsibilities**:
- Expose REST endpoints
- Validate requests (Zod schemas)
- Authenticate wallets (verify signatures)
- Supabase queries
- Avalanche RPC queries (via viem)
- Rate limiting
- Logging (pino)

**Does NOT**:
- Render HTML (JSON API only)
- Background jobs (uses Supabase Edge Functions or external cron)

### Indexer (Background Job)

**Responsibilities**:
- Scan Avalanche C-Chain every 15 minutes
- Track transactions from agent billing addresses
- Calculate volume in AVAX and USD
- Detect new ERC-804 contracts (auto-discovery)
- Update transaction_volume table in Supabase

**Technology**: Supabase Edge Function + cron trigger

### Centinela (Verification Engine)

**Responsibilities**:
- Detect proxies (bytecode analysis)
- Heartbeat system (ping agents every hour)
- Compare bytecode with OpenZeppelin templates
- Calculate OZ match score
- Log results in heartbeat_logs and agents tables

**Technology**: Supabase Edge Function or separate Node.js script

### Database (Supabase)

**Responsibilities**:
- Persist agents, logs, ratings, reports
- Real-time subscriptions (for live updates)
- Auth (if using Supabase Auth for owners)
- Storage (if uploading images/docs in future)

**Does NOT**:
- Business logic (this goes in API)
- Complex queries (done from API with ORM)
