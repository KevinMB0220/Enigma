# AI Context Guide for Enigma

This document provides context for AI assistants working on the Enigma project. Read this first before implementing any features or fixing issues.

## Project Overview

**Enigma** is a Trust Score Platform for Autonomous Agents on Avalanche blockchain. It enables users to:
- Discover and browse autonomous agents
- View trust scores calculated from on-chain and off-chain data
- Rate and review agents
- Scan agent contracts for security patterns
- Track agents via watchlists

## Quick Navigation

| Need to understand... | Read this file |
|-----------------------|----------------|
| Project vision & goals | [context/overview.md](./context/overview.md) |
| Tech stack details | [architecture/tech-stack.md](./architecture/tech-stack.md) |
| Folder structure | [architecture/folder-structure.md](./architecture/folder-structure.md) |
| Database schema | [backend/database.md](./backend/database.md) |
| API endpoints | [api/endpoints.md](./api/endpoints.md) |
| Design system | [design/overview.md](./design/overview.md) |
| Component library | [design/components.md](./design/components.md) |
| Trust Score logic | [features/trust-score.md](./features/trust-score.md) |
| Scanner functionality | [features/scanner.md](./features/scanner.md) |
| Code style | [standards/code-style.md](./standards/code-style.md) |
| Issue tracker | [business/issues.md](./business/issues.md) |
| Full roadmap | [business/roadmap.md](./business/roadmap.md) |
| Glossary | [reference/glossary.md](./reference/glossary.md) |

## Tech Stack Summary

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **State**: TanStack Query (React Query), Wagmi 2.x
- **Database**: Supabase (PostgreSQL), Prisma ORM
- **Blockchain**: Viem 2.x, Avalanche C-Chain
- **Components**: shadcn/ui (Radix UI primitives)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Key Patterns

### 1. File Organization
```
src/
├── app/           # Next.js App Router pages
│   ├── (main)/    # Main app routes with layout
│   └── api/v1/    # API routes
├── components/    # React components
│   ├── ui/        # shadcn/ui base components
│   ├── layout/    # Header, Footer, Sidebar
│   └── shared/    # Reusable business components
├── lib/           # Utilities and configs
│   ├── blockchain/
│   └── supabase/
├── hooks/         # Custom React hooks
├── services/      # API/business logic services
└── types/         # TypeScript definitions
```

### 2. Component Pattern
```tsx
// Use "use client" only when needed (hooks, interactivity)
// Prefer Server Components by default

// components/agent/AgentCard.tsx
interface AgentCardProps {
  agent: Agent;
  showScore?: boolean;
}

export function AgentCard({ agent, showScore = true }: AgentCardProps) {
  // Implementation
}
```

### 3. Data Fetching
```tsx
// Use TanStack Query for client-side data
const { data, isLoading } = useQuery({
  queryKey: ['agents', filters],
  queryFn: () => agentService.getAgents(filters),
});

// Use Server Components for initial data when possible
```

### 4. API Routes
```tsx
// app/api/v1/agents/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Validate, query, return
  return NextResponse.json({ data: agents });
}
```

## Design System Quick Reference

### Colors
- Primary: `#3b82f6` (blue-500)
- Background: `#0a0b0f` (near black)
- Glass: `rgba(15, 17, 23, 0.6)` with backdrop blur

### Trust Score Badges
| Level | Score Range | Color |
|-------|-------------|-------|
| Excellent | ≥80% | Green (#10b981) |
| Good | 60-79% | Blue (#3b82f6) |
| Medium | 40-59% | Yellow (#f59e0b) |
| Low | <40% | Red (#ef4444) |

### Trust Score Formula
```
Overall = (Volume × 0.25) + (Proxy × 0.20) + (Uptime × 0.25) + (OZ Match × 0.15) + (Community × 0.15)
```

## Working on Issues

1. **Find the issue** in [business/issues.md](./business/issues.md)
2. **Read related docs** based on the feature area
3. **Check existing code** in `src/` for patterns
4. **Follow the standards** in [standards/code-style.md](./standards/code-style.md)

### Issue Format
```
### ENI-XXX: Issue Title
**Phase:** X | **Priority:** High/Medium/Low
**Estimated:** Xh | **Dependencies:** ENI-XXX

Description of the issue...

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
```

## Phase Overview

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Project Setup & Config | ✅ Complete |
| 1 | Core Components (Scanner, Cards) | 🔜 Next |
| 2 | Agent Directory & Listings | Pending |
| 3 | Trust Score Display | Pending |
| 4 | Ratings & Reviews | Pending |
| 5 | Wallet Integration | Pending |
| 6 | User Dashboard | Pending |
| 7 | Admin Panel | Pending |
| 8 | Analytics & Polish | Pending |
| 9 | Production & Launch | Pending |

## Common Tasks

### Adding a New Component
1. Create file in `src/components/{category}/ComponentName.tsx`
2. Use TypeScript interfaces for props
3. Follow existing component patterns
4. Export from category index if needed

### Adding a New API Endpoint
1. Create route in `src/app/api/v1/{resource}/route.ts`
2. Use Zod for request validation
3. Return standardized responses
4. Add to API docs if significant

### Adding a New Page
1. Create in `src/app/(main)/{route}/page.tsx`
2. Server Component by default
3. Add loading.tsx and error.tsx if needed
4. Update navigation if applicable

### Connecting to Blockchain
1. Use hooks from `wagmi` (useAccount, useReadContract, etc.)
2. Chain config is in `src/lib/blockchain/config.ts`
3. Contract ABIs go in `src/lib/blockchain/abis/`

## Important Notes

- **ERC-804**: This is the autonomous agent standard we follow
- **Avalanche Focus**: Primary chain is Avalanche C-Chain (chainId: 43114)
- **Dark Theme Only**: The design system is dark-first (glassmorphism)
- **Server Components**: Prefer RSC, add "use client" only when needed
- **No Test Files Yet**: Testing setup is Phase 0, tests come later

## Getting Help

If you need clarification:
1. Check the glossary: [reference/glossary.md](./reference/glossary.md)
2. Read the detailed spec in relevant docs folder
3. Look at existing code patterns in `src/`
4. Check inline code comments

## Environment Variables

Required in `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Prisma)
DATABASE_URL=
DIRECT_URL=

# Blockchain
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_CHAIN_ENV=testnet  # or mainnet

# Optional
NEXT_PUBLIC_SNOWTRACE_API_KEY=
```

---

*This document should be your starting point for any development work on Enigma. Keep it updated as the project evolves.*
