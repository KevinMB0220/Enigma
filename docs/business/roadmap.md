# Development Roadmap

## Phase Overview

| Phase | Name | Duration | Objective | Status |
|-------|------|----------|-----------|--------|
| **Phase 0** | Setup & Infrastructure | 2-3 days | Project base, tooling, CI/CD | 🔜 |
| **Phase 1** | Auth & Backend Core | 3-4 days | Supabase, API base, wallet auth | 🔜 |
| **Phase 2** | Agent Registration | 4-5 days | Agent CRUD, blockchain integration | 🔜 |
| **Phase 3** | Scanner/Directory | 5-6 days | Table, filters, search, ranking | 🔜 |
| **Phase 4** | Centinela (Verification) | 5-7 days | Proxy detection, heartbeat, OZ match | 🔜 |
| **Phase 5** | Trust Score | 3-4 days | Formula, calculation, periodic update | 🔜 |
| **Phase 6** | Agent Profile | 4-5 days | Detail page, charts, ratings | 🔜 |
| **Phase 7** | Feedback System | 3-4 days | Ratings, comments, reports | 🔜 |
| **Phase 8** | Polish & Testing | 3-4 days | QA, bugfixes, optimizations | 🔜 |
| **Phase 9** | Deploy & Launch | 2-3 days | Production, DNS, monitoring | 🔜 |

**Total MVP**: ~35-45 days (~7-9 weeks)

---

## Phase 0: Setup & Infrastructure

**Objective**: Create project base with all necessary tools and configurations.

- Initialize Next.js 14 project with TypeScript
- Configure TailwindCSS and shadcn/ui
- Setup Supabase project
- Configure Prisma ORM
- Setup ESLint, Prettier, Husky
- Configure GitHub Actions CI/CD
- Setup Pino logging

---

## Phase 1: Auth & Backend Core

**Objective**: Implement wallet connection and basic REST API.

- Configure wagmi and viem
- Create WalletConnectButton component
- Build Header with wallet connection
- Create health check API route
- Build API helper utilities
- Implement custom error classes
- Setup rate limiting middleware

---

## Phase 2: Agent Registration

**Objective**: Allow users to register agents by connecting wallet.

- Define Prisma Agent model
- Create Zod validation schemas
- Setup viem client and ERC-804 ABI
- Build blockchain service
- Create agent service (CRUD)
- Implement POST /agents/register API
- Build registration page frontend
- Create useRegisterAgent hook

---

## Phase 3: Scanner/Directory

**Objective**: Create main page with listing, filters, and agent search.

- Implement GET /agents API
- Create useAgents hook
- Build AgentTable component (TanStack Table)
- Create Filters component
- Build SearchBar with autocomplete
- Create Scanner page layout
- Build AgentCard row component
- Add empty state and loading skeletons

---

## Phase 4: Centinela (Verification)

**Objective**: Implement automatic agent verification engine.

- Build proxy detection service
- Define HeartbeatLog Prisma model
- Create heartbeat service
- Build OpenZeppelin bytecode matcher
- Create Indexer Edge Function
- Create Centinela Edge Function
- Implement heartbeats API endpoint
- Configure cron triggers

---

## Phase 5: Trust Score

**Objective**: Calculate and update composite trust score for each agent.

- Define TransactionVolume model
- Build trust score service with formula
- Create trust score update job
- Implement trust-score API endpoint
- Add TrustScoreBreakdown component
- Create TrustScoreBadge component
- Build trust score chart

---

## Phase 6: Agent Profile

**Objective**: Create detailed agent profile page.

- Build agent detail page
- Create ProxyAnalysis component
- Build HeartbeatChart component
- Add transaction volume display
- Create ratings display section
- Implement share functionality
- Add SEO metadata

---

## Phase 7: Feedback System

**Objective**: Allow users to rate and report agents.

- Define UserRating model
- Define Report model
- Implement ratings API
- Implement reports API
- Build RatingForm component
- Create ReportModal component
- Add rating display with stars
- Build moderation dashboard (admin)

---

## Phase 8: Polish & Testing

**Objective**: QA, bug fixes, and performance optimizations.

- Full QA testing
- Fix critical bugs
- Optimize database queries
- Add error boundary coverage
- Performance testing
- Accessibility review
- Mobile responsiveness QA
- Security review

---

## Phase 9: Deploy & Launch

**Objective**: Production deployment and monitoring setup.

- Configure Vercel production
- Setup custom domain
- Configure Supabase production
- Setup Sentry error tracking
- Configure monitoring alerts
- Create backup procedures
- Write deployment documentation
- Launch! 🚀
