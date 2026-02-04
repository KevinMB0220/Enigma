# Project Structure

## Directory Layout

```
enigma/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI/CD pipeline
│       └── deploy.yml             # Deploy to Vercel
├── prisma/
│   ├── schema.prisma              # Prisma schema (Supabase DB)
│   └── migrations/                # DB migrations
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/                       # Next.js 14 App Router
│   │   ├── (auth)/               # Auth route group
│   │   │   └── login/
│   │   ├── (main)/               # Main app route group
│   │   │   ├── page.tsx          # Landing page (/)
│   │   │   ├── scanner/
│   │   │   │   └── page.tsx      # Scanner page (/scanner)
│   │   │   └── agent/
│   │   │       └── [address]/
│   │   │           └── page.tsx  # Agent profile (/agent/0x123...)
│   │   ├── api/                  # API Routes
│   │   │   └── v1/
│   │   │       ├── agents/
│   │   │       │   ├── route.ts          # GET /api/v1/agents (list)
│   │   │       │   ├── register/
│   │   │       │   │   └── route.ts      # POST /api/v1/agents/register
│   │   │       │   └── [address]/
│   │   │       │       ├── route.ts      # GET /api/v1/agents/:address
│   │   │       │       └── trust-score/
│   │   │       │           └── route.ts  # GET /api/v1/agents/:address/trust-score
│   │   │       └── health/
│   │   │           └── route.ts          # GET /api/v1/health
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── providers.tsx         # React providers wrapper
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── scanner/
│   │   │   ├── agent-table.tsx
│   │   │   ├── filters.tsx
│   │   │   └── search-bar.tsx
│   │   ├── agent/
│   │   │   ├── trust-score-breakdown.tsx
│   │   │   ├── heartbeat-chart.tsx
│   │   │   ├── proxy-analysis.tsx
│   │   │   └── user-ratings.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── sidebar.tsx
│   │   └── shared/
│   │       ├── wallet-connect-button.tsx
│   │       ├── loading-spinner.tsx
│   │       └── error-boundary.tsx
│   ├── lib/                      # Utilities & configs
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase client (browser)
│   │   │   └── server.ts         # Supabase client (server)
│   │   ├── blockchain/
│   │   │   ├── config.ts         # Chain configs (Avalanche mainnet/testnet)
│   │   │   ├── client.ts         # Viem public client
│   │   │   └── contracts.ts      # Contract ABIs & addresses
│   │   ├── utils/
│   │   │   ├── format.ts         # Format addresses, numbers, dates
│   │   │   ├── validation.ts     # Zod schemas
│   │   │   └── logger.ts         # Pino logger config
│   │   └── constants.ts          # App-wide constants
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-agents.ts         # TanStack Query hooks for agents
│   │   ├── use-wallet.ts         # Wallet connection hooks (wagmi)
│   │   └── use-debounce.ts
│   ├── services/                 # Business logic services
│   │   ├── agent-service.ts      # Agent CRUD operations
│   │   ├── trust-score-service.ts # Trust score calculation
│   │   ├── indexer-service.ts    # Blockchain indexer logic
│   │   └── centinela-service.ts  # Verification engine logic
│   ├── types/                    # TypeScript types
│   │   ├── agent.ts
│   │   ├── trust-score.ts
│   │   └── api.ts
│   └── middleware.ts             # Next.js middleware (rate limiting, auth)
├── supabase/                     # Supabase Edge Functions
│   └── functions/
│       ├── indexer/
│       │   └── index.ts          # Indexer cron job
│       └── centinela/
│           └── index.ts          # Centinela verification job
├── scripts/                      # Utility scripts
│   ├── seed-db.ts                # Seed database with demo agents
│   └── generate-types.ts         # Generate Prisma types
├── .env.example
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **React Components** | PascalCase export, kebab-case file | `agent-profile.tsx` exports `AgentProfile` |
| **Pages (App Router)** | kebab-case | `scanner/page.tsx` |
| **API Routes** | kebab-case | `agents/[address]/route.ts` |
| **Services** | kebab-case, `-service` suffix | `trust-score-service.ts` |
| **Hooks** | kebab-case, `use-` prefix | `use-agents.ts` |
| **Utils** | kebab-case | `format.ts`, `validation.ts` |
| **Types** | kebab-case | `agent.ts`, `trust-score.ts` |
| **Constants** | kebab-case | `constants.ts`, `config.ts` |
