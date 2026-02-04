# Naming Conventions

## Variables and Functions

```typescript
// ✅ Correct: camelCase for variables and functions
const trustScore = 85;
const agentAddress = '0x123...';

function calculateTrustScore(agent: Agent): number {
  return agent.volume * 0.25 + agent.uptime * 0.25;
}

// ✅ Correct: Prefixes for booleans
const isVerified = true;
const hasProxy = false;
const canRegister = checkPermissions();

// ✅ Correct: `handle` prefix for event handlers
const handleSubmit = () => {};
const handleChange = (e: ChangeEvent) => {};

// ❌ Avoid: snake_case or PascalCase for variables
const trust_score = 85;
const TrustScore = 85;
```

## Constants

```typescript
// ✅ Correct: UPPER_SNAKE_CASE for global constants
export const MAX_AGENTS_PER_PAGE = 20;
export const API_BASE_URL = 'https://api.enigma.io';
export const AVALANCHE_CHAIN_ID = 43114;

// ✅ Correct: Constant objects
export const TRUST_SCORE_WEIGHTS = {
  VOLUME: 0.25,
  PROXY: 0.20,
  UPTIME: 0.25,
  OZ_MATCH: 0.15,
  RATINGS: 0.15
} as const;
```

## Types and Interfaces

```typescript
// ✅ Correct: PascalCase, no I prefix
interface Agent {
  address: string;
  name: string;
}

type AgentStatus = 'pending' | 'verified' | 'flagged';

// ❌ Avoid: I prefix (C#/Java style)
interface IAgent {
  address: string;
}
```

## React Components

```typescript
// ✅ Correct: PascalCase for components
export function AgentCard() {}
export const TrustScoreBadge = () => {};

// ✅ Correct: Descriptive suffixes
export function AgentCardSkeleton() {} // Loading state
export function AgentCardError() {}    // Error state
```

## Files

```typescript
// ✅ Correct: kebab-case for files
agent-card.tsx
trust-score-service.ts
use-agents.ts

// ❌ Avoid: PascalCase or camelCase
AgentCard.tsx
trustScoreService.ts
```

## API Routes

```
// ✅ Correct: kebab-case, plural for collections
GET  /api/v1/agents
POST /api/v1/agents/register
GET  /api/v1/agents/:address
GET  /api/v1/agents/:address/trust-score
GET  /api/v1/agents/:address/heartbeats

// ❌ Avoid: camelCase or inconsistent singular
GET /api/v1/getAgents
GET /api/v1/agent/:address
```

## Environment Variables

```bash
# ✅ Correct: UPPER_SNAKE_CASE with prefixes
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc

# Server-only (without NEXT_PUBLIC)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...

# ❌ Avoid: camelCase or lowercase
supabaseUrl=https://...
next_public_api_key=abc123
```

## Database (Supabase/Prisma)

```prisma
// ✅ Correct: snake_case for tables and columns
model agent {
  address           String   @id
  name              String
  trust_score       Int      @default(0)
  created_at        DateTime @default(now())

  @@map("agents") // Plural in DB
}
```

```typescript
// ✅ Correct in TypeScript (camelCase)
const agent = await prisma.agent.findUnique({
  where: { address: '0x123...' }
});

console.log(agent.trustScore); // Prisma maps snake_case → camelCase
```

## Git Branches

```bash
# ✅ Correct: type/short-description
feature/trust-score-calculation
fix/wallet-connection-bug
chore/update-dependencies
docs/api-documentation

# ❌ Avoid: vague names or camelCase
feature/newFeature
myBranch
update
```

## Commits (Conventional Commits)

```bash
# ✅ Correct
feat: add trust score breakdown component
fix: resolve wallet disconnection on page reload
chore: update next.js to 14.2.1
docs: add API endpoint documentation
style: format code with prettier
refactor: simplify agent service logic
test: add unit tests for trust score calculation

# ❌ Avoid
Added new feature
Fixed bug
Update
WIP
```
