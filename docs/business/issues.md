# Issues Definition by Phase

## Phase 0: Setup & Infrastructure

**Objective**: Create project base with all necessary tools and configurations.

### Issue 0.1: Initialize Next.js Project
- Create Next.js 14 project with TypeScript
- Configure App Router
- Install base dependencies (React, Next, TS)
- Configure strict `tsconfig.json`
- Create initial folder structure (`src/app`, `src/components`, etc.)

### Issue 0.2: Configure TailwindCSS and shadcn/ui
- Install and configure TailwindCSS
- Configure `tailwind.config.ts` with custom theme
- Add CSS variables for theming (light/dark)
- Install shadcn/ui CLI
- Add base components: Button, Card, Badge, Table

### Issue 0.3: Configure Supabase
- Create project in Supabase Cloud
- Install `@supabase/supabase-js`
- Create Supabase clients (browser and server)
- Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.)
- Create `.env.example` file

### Issue 0.4: Configure Prisma
- Install Prisma and Prisma Client
- Create initial `prisma/schema.prisma`
- Connect Prisma to Supabase PostgreSQL
- Generate Prisma Client
- Create seed script for demo data

### Issue 0.5: Configure ESLint, Prettier and Husky
- Install ESLint with Next.js config
- Configure Prettier with project rules
- Install Husky for git hooks
- Configure lint-staged
- Add pre-commit hook (lint + format)

### Issue 0.6: Configure CI/CD (GitHub Actions)
- Create workflow `.github/workflows/ci.yml`
- Jobs: lint, type-check, build
- Trigger on push to `main` and PRs
- Create Vercel deploy workflow

### Issue 0.7: Configure Logging (Pino)
- Install Pino
- Create logger utility in `lib/utils/logger.ts`
- Configure JSON format for production
- Configure pretty format for development

---

## Phase 1: Authentication & Backend Core

**Objective**: Implement wallet connection and basic REST API.

### Issue 1.1: Configure Wagmi and Viem
- Install `wagmi` and `viem`
- Create `lib/blockchain/config.ts` with Avalanche mainnet/testnet
- Create `wagmi-config.ts` with chains and connectors
- Create provider wrapper in `app/providers.tsx`

### Issue 1.2: Wallet Connection Component
- Create `WalletConnectButton` component
- Implement connect/disconnect logic
- Show truncated address when connected
- Add support for MetaMask and WalletConnect
- Styles with shadcn/ui Button

### Issue 1.3: Header with Wallet Connection
- Create `Header` component in `components/layout/header.tsx`
- Enigma logo (placeholder)
- Navigation bar (Home, Scanner)
- `WalletConnectButton` on the right
- Responsive (hamburger menu on mobile)

### Issue 1.4: API Route Health Check
- Create `app/api/v1/health/route.ts`
- Response with status 200 and timestamp
- Include version and environment info

### Issue 1.5: API Utilities (Helpers)
- Create `lib/api-helpers.ts`
- Functions: `successResponse()`, `errorResponse()`
- Type-safe responses with `ApiResponse<T>` interface
- Export helpers

### Issue 1.6: Custom Error Classes
- Create `lib/errors.ts`
- Classes: `AppError`, `ValidationError`, `NotFoundError`, `BlockchainError`
- Method `.toJSON()` for serialization
- Document usage in API routes

### Issue 1.7: Rate Limiting Middleware
- Install `rate-limiter-flexible`
- Create `middleware.ts` with rate limiter
- Configure limits: 100 req/min (general), 5 req/hour (register)
- Response 429 with `Retry-After` header

---

## Phase 2: Agent Registration

**Objective**: Allow users to register agents by connecting wallet.

### Issue 2.1: Prisma Schema - Agent Model
- Define `Agent` model in `prisma/schema.prisma`
- Fields: address (PK), name, type, status, trust_score, etc.
- Enums: `AgentType`, `AgentStatus`, `ProxyType`
- Create migration: `npx prisma migrate dev --name create_agents`

### Issue 2.2: Zod Validation for Registration
- Create `lib/utils/validation.ts`
- Schema `registerAgentSchema`: address, name, type, description
- Validate Ethereum address format (`0x[a-fA-F0-9]{40}`)
- Export type `RegisterAgentInput`

### Issue 2.3: Viem Client and ERC-804 ABI
- Create `lib/blockchain/client.ts` with `createPublicClient`
- Create `lib/blockchain/abis/erc804.ts` with basic ABI (name, agentType, billingAddress)
- Configure RPC with retry and batch

### Issue 2.4: Blockchain Service
- Create `services/blockchain-service.ts`
- Function `readAgentMetadata(address)`: reads name, type, billing from contract
- Function `getContractCode(address)`: gets bytecode
- Error handling (contract not found, RPC error)

### Issue 2.5: Agent Service (CRUD)
- Create `services/agent-service.ts`
- Function `createAgent(data)`: inserts in DB via Prisma
- Function `getAgent(address)`: fetch by address with relations
- Function `getAgents(filters)`: list with pagination

### Issue 2.6: API POST /agents/register
- Create `app/api/v1/agents/register/route.ts`
- Validate body with Zod
- Verify contract exists on blockchain
- Extract ERC-804 metadata
- Insert agent in DB with status PENDING
- Return created agent

### Issue 2.7: Registration Page (Frontend)
- Create `app/register/page.tsx`
- Form with `react-hook-form`
- Fields: address (input), name, type (select), description (textarea)
- Client-side validation with Zod
- Submit → POST /api/v1/agents/register
- Success/error feedback with toast

### Issue 2.8: Hook `useRegisterAgent`
- Create `hooks/use-register-agent.ts`
- Use TanStack Query mutation
- Function `registerAgent(data)`
- Invalidate agent queries on success

---

## Phase 3: Scanner/Directory

**Objective**: Create main page with listing, filters, and agent search.

### Issue 3.1: API GET /agents (List)
- Create `app/api/v1/agents/route.ts`
- Query params: type, status, minTrustScore, page, limit
- Validate params with Zod
- Call `getAgents()` service
- Return array + pagination metadata

### Issue 3.2: Hook `useAgents`
- Create `hooks/use-agents.ts`
- TanStack Query hook with filters
- Dynamic query key based on filters
- Refetch interval 60s
- StaleTime 5min

### Issue 3.3: AgentTable Component
- Create `components/scanner/agent-table.tsx`
- Use TanStack Table headless
- Columns: Rank, Name, Type, Trust Score, Volume 24h, Status, Heartbeat
- Sorting on trust_score and volume
- Responsive (horizontal scroll on mobile)

### Issue 3.4: Filters Component
- Create `components/scanner/filters.tsx`
- Filters: Type (select), Status (select), Min Trust Score (slider)
- Local state with useState
- Callback `onFilterChange` to update parent

### Issue 3.5: SearchBar Component
- Create `components/scanner/search-bar.tsx`
- Input with debounce (500ms)
- Search by name or address
- Autocomplete dropdown with results
- Navigate to profile on select

### Issue 3.6: Scanner Page
- Create `app/scanner/page.tsx`
- Layout: Header stats (Total agents, Verified, Vol 24h)
- Filters in sidebar (desktop) or collapsible (mobile)
- SearchBar above table
- AgentTable with data from `useAgents`
- Pagination in footer

### Issue 3.7: AgentCard Component (Row)
- Create `components/scanner/agent-card.tsx`
- Design for each table row
- Status badge with color
- Trust score with emoji by range
- Link to agent profile
- Hover effect

### Issue 3.8: Empty State and Loading
- Create `AgentTableSkeleton` with skeleton rows
- Empty state when no agents (illustration + CTA)
- Error state with retry button

---

## Phase 4: Centinela (Verification)

**Objective**: Implement automatic agent verification engine.

### Issue 4.1: Proxy Detection Service
- Create `services/centinela/proxy-detector.ts`
- Function `detectProxy(address)`
- Read EIP-1967 storage slots (implementation, beacon)
- Pattern matching in bytecode (delegatecall)
- Return: isProxy, proxyType, implementationAddress

### Issue 4.2: Prisma Schema - HeartbeatLog Model
- Add `HeartbeatLog` model to schema
- Fields: agent_address (FK), timestamp, challenge_type, response_time_ms, result
- Enums: `ChallengeType`, `HeartbeatResult`
- Migration

### Issue 4.3: Heartbeat Service
- Create `services/centinela/heartbeat-service.ts`
- Function `sendHeartbeat(agentAddress)`: ping agent endpoint
- Timeout 5 seconds
- Log result in `heartbeat_logs` table
- Calculate uptime % (last 24h)

### Issue 4.4: OpenZeppelin Comparison
- Create `services/centinela/oz-matcher.ts`
- Database of OZ bytecode templates (Ownable, AccessControl, etc.)
- Function `matchOZBytecode(agentCode)`: compare chunks
- Return OZ score (0-100) and detected components

### Issue 4.5: Supabase Edge Function - Indexer
- Create `supabase/functions/indexer/index.ts`
- Deno function that runs every 15 min (cron)
- Scan blockchain for new ERC-804 contracts
- Update transaction volumes from billing addresses
- Insert/update in `transaction_volumes` table

### Issue 4.6: Supabase Edge Function - Centinela
- Create `supabase/functions/centinela/index.ts`
- Cron every hour
- For each VERIFIED agent:
  - Execute proxy detection
  - Send heartbeat
  - Update flags in DB

### Issue 4.7: API GET /agents/:address/heartbeats
- Create endpoint for heartbeat history
- Query params: period (24h, 7d, 30d)
- Return array of logs with timestamps
- Include uptime %

### Issue 4.8: Configure Cron Triggers in Supabase
- Configure trigger for indexer (every 15 min)
- Configure trigger for centinela (every hour)
- Manual test of functions
- Execution logging

---

## Phase 5: Trust Score

**Objective**: Calculate and update composite trust score for each agent.

### Issue 5.1: Prisma Schema - TransactionVolume Model
- Add `TransactionVolume` model
- Fields: agent_address (FK), period (enum), tx_count, volume_avax, volume_usd
- Unique constraint on (agent_address, period)
- Migration

### Issue 5.2: Trust Score Service
- Create `services/trust-score-service.ts`
- Function `calculateTrustScore(agent)`:
  - Volume score (25%): based on volume ranking
  - Proxy score (20%): 100 if no proxy, 0 if undeclared proxy
  - Uptime score (25%): % of successful heartbeats
  - OZ score (15%): % match with OZ
  - Rating score (15%): avg of user ratings (1-5) * 20
- Return total score (0-100)

### Issue 5.3: Periodic Recalculation Function
- Create `services/trust-score-service.ts::recalculateAllScores()`
- Iterate over all agents with status VERIFIED
- Calculate new trust_score
- Update in DB
- Log significant changes (delta > 10)

### Issue 5.4: Supabase Edge Function - Trust Score Updater
- Create `supabase/functions/trust-score-updater/index.ts`
- Cron every hour
- Call `recalculateAllScores()`
- Log number of agents updated

### Issue 5.5: API GET /agents/:address/trust-score
- Create trust score detail endpoint
- Return current score + breakdown of each component
- Include last calculation timestamp

### Issue 5.6: TrustScoreBadge Component
- Create `components/shared/trust-score-badge.tsx`
- Circular badge with number
- Color by range (green 80+, blue 60-79, yellow 40-59, orange 20-39, red <20)
- Emoji by range
- Tooltip with "Last updated"

### Issue 5.7: TrustScoreBreakdown Component
- Create `components/agent/trust-score-breakdown.tsx`
- Card with progress bar for each component
- Format: "Volume: ████████░░ 80/100 (25%)"
- Consistent colors
- Explanation of each metric

---

## Phase 6: Agent Profile

**Objective**: Detail page for each agent with all its metrics.

### Issue 6.1: API GET /agents/:address (Detail)
- Create `app/api/v1/agents/[address]/route.ts`
- Include relations: volumes, heartbeats (last 7d), ratings
- Return 404 if not exists
- Include complete metadata

### Issue 6.2: Hook `useAgent`
- Create `hooks/use-agent.ts`
- TanStack Query hook for fetch single agent
- Refetch on mount
- StaleTime 2min

### Issue 6.3: Profile Layout
- Create `app/agent/[address]/page.tsx`
- Layout: Header with name, address, trust score badge
- Tabs: Overview, Verification, Heartbeat, Ratings
- "Back to Scanner" button

### Issue 6.4: Tab Overview
- Basic info: Type, Owner, Billing address, Registered date
- Trust Score Breakdown card
- Volume metrics (24h, 7d, 30d) with charts
- Link to Snowtrace (block explorer)

### Issue 6.5: Tab Verification
- `ProxyAnalysis` component
- Shows: isProxy, proxyType, implementationAddress
- Badge: "No Proxy Detected" (green) or "Proxy Detected: EIP-1967" (yellow)
- OZ Match Score with detected components
- Warning if undeclared proxy

### Issue 6.6: Tab Heartbeat
- `HeartbeatChart` component
- Use Recharts LineChart
- Data: last 7 days, one point per hour
- Y axis: response time (ms)
- Green if PASS, red if FAIL/TIMEOUT
- Card with stats: Uptime %, Avg response time

### Issue 6.7: Tab Ratings
- `UserRatings` component
- Star average (★★★★☆ 4.2/5)
- List of last 5 comments
- "Leave Rating" button (only if wallet connected)

### Issue 6.8: SEO and Metadata
- Implement `generateMetadata()` in page
- Title: "{Agent Name} - Enigma"
- Description: include trust score and category
- OpenGraph image (generic or dynamically generated)

---

## Phase 7: Feedback System

**Objective**: Allow users to leave ratings and report agents.

### Issue 7.1: Prisma Schema - UserRating Model
- Add `UserRating` model
- Fields: agent_address (FK), user_address, score (1-5), comment (max 280 chars)
- Unique constraint on (agent_address, user_address)
- Migration

### Issue 7.2: API POST /agents/:address/ratings
- Create endpoint to create/update rating
- Validate wallet signature (rating owner)
- Validate score (1-5) and comment length
- Upsert rating (insert or update if exists)
- Invalidate agent trust score cache

### Issue 7.3: RatingForm Component
- Create `components/agent/rating-form.tsx`
- Star input (1-5) with hover effect
- Textarea for comment (max 280 chars, counter)
- Submit button (requires connected wallet)
- Success/error toast

### Issue 7.4: Prisma Schema - Report Model
- Add `Report` model
- Fields: agent_address (FK), reporter_address, reason (enum), description, status
- Enum `ReportReason`: PROXY_HIDDEN, INCONSISTENT_BEHAVIOR, SCAM, OTHER
- Enum `ReportStatus`: OPEN, REVIEWING, RESOLVED, DISMISSED
- Migration

### Issue 7.5: API POST /agents/:address/reports
- Create endpoint to create report
- Validate wallet signature
- Insert report with status OPEN
- If agent has ≥3 OPEN reports, change status to FLAGGED
- Notification (log or email) for team

### Issue 7.6: ReportModal Component
- Create `components/agent/report-modal.tsx`
- Modal (shadcn/ui Dialog)
- Reason select
- Description textarea
- Submit button (requires wallet)
- Warning: "False reports may result in penalties"

### Issue 7.7: "Report Agent" Button
- Add button in agent profile (footer or sidebar)
- Opens `ReportModal` on click
- Only visible if wallet connected

### Issue 7.8: "Under Review" Badge
- Show yellow badge on agent if status = FLAGGED
- Tooltip: "This agent has multiple reports and is under review"
- Warning on profile with details

---

## Phase 8: Polish & Testing

**Objective**: Visual refinement, optimizations, and complete testing.

### Issue 8.1: Landing Page (Home)
- Create `app/page.tsx` (landing page)
- Hero section: tagline, CTA "Explore Agents"
- Global stats: Total agents, Verified, Volume 24h (fetch from API)
- Features section: Trust Score, Centinela, API
- CTA to Scanner

### Issue 8.2: Footer
- Create `components/layout/footer.tsx`
- Links: Docs, API, GitHub, Twitter
- Copyright "© 2026 Enigma"
- Badge "Built for Avalanche"

### Issue 8.3: Dark Mode by Default
- Ensure dark mode is default
- Verify contrast in all components
- Optional: Toggle light/dark (P2)

### Issue 8.4: Loading Animations
- Add skeletons on all pages
- Loading spinner on buttons during submit
- Transition effects on hover (buttons, cards)
- Smooth page transitions

### Issue 8.5: Error Boundaries
- Implement error boundary in root layout
- Custom error pages: 404, 500
- Error logging to Sentry (optional)

### Issue 8.6: Image Optimization
- Use Next.js `<Image>` component
- Logos and assets in WebP format
- Lazy loading of non-critical images

### Issue 8.7: SEO and Performance
- Generated sitemap.xml
- robots.txt
- Lighthouse audit (target: 90+ on all metrics)
- Font preloading
- Optimize bundle size (analyze with `@next/bundle-analyzer`)

### Issue 8.8: Manual Testing (QA)
- Test all main flows
- Test on mobile (iOS Safari, Chrome Android)
- Test on different browsers (Chrome, Firefox, Safari)
- Test edge cases (agent without heartbeats, without ratings, etc.)
- List of bugs found → Separate issues

---

## Phase 9: Deploy & Launch

**Objective**: Deploy to production and go-live.

### Issue 9.1: Configure Vercel
- Connect GitHub repo to Vercel
- Configure environment variables
- Configure custom domain (if applicable)
- Preview deployments on PRs

### Issue 9.2: Configure Supabase Production
- Create production project in Supabase
- Migrate schema with Prisma
- Configure environment variables in Vercel
- Automatic backups configured

### Issue 9.3: Demo Data Seed
- Create 10-15 demo agents on mainnet/testnet
- Generate historical heartbeat logs
- Add example ratings
- Verify calculated trust scores

### Issue 9.4: Configure DNS
- Point domain to Vercel
- Configure SSL (automatic on Vercel)
- Verify HTTPS working

### Issue 9.5: API Documentation
- Create `/docs` page with Swagger/OpenAPI
- Document all endpoints
- Request/response examples
- Rate limits and authentication

### Issue 9.6: README and GitHub Docs
- Complete README with:
  - Logo and description
  - Main features
  - Tech stack
  - Local setup
  - Environment variables
  - Contributing guidelines
- Link to API docs

### Issue 9.7: Monitoring and Alerts
- Configure Sentry for error tracking
- Configure Vercel Analytics
- Key metrics dashboards
- Uptime alerts (UptimeRobot or similar)

### Issue 9.8: Launch
- Announcement on Avalanche Twitter/Discord
- Post on Medium/Dev.to explaining the project
- Submission to Avalanche hackathon
- Collect initial feedback
