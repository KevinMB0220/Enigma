# Tech Stack

## Frontend

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Next.js** | 14.2+ | React framework with SSR/SSG | Better SEO, built-in routing, API routes for BFF |
| **TypeScript** | 5.3+ | Type safety | Critical in Web3 to avoid address/ABI errors |
| **React** | 18.3+ | UI Library | Industry standard, robust ecosystem |
| **TailwindCSS** | 3.4+ | Utility-first CSS | Fast development, consistency, customizable |
| **shadcn/ui** | latest | Component library | Professional, accessible, customizable components |
| **wagmi** | 2.x | React hooks for Ethereum | Best DX for wallet connection, chain handling |
| **viem** | 2.x | Low-level Ethereum library | More modern and faster than ethers.js, native TypeScript |
| **TanStack Query** | 5.x | Server state management | Smart cache, automatic revalidation |
| **TanStack Table** | 8.x | Headless table library | For Scanner table with filters/sort/pagination |
| **Recharts** | 2.x | Charting library | Uptime graphs, volume, trust score breakdown |
| **Zod** | 3.x | Schema validation | Type-safe validation on client and server |
| **react-hook-form** | 7.x | Form management | Efficient form handling (agent registration) |
| **date-fns** | 3.x | Date utilities | Timestamp handling, date formatting |
| **lucide-react** | latest | Icon library | Modern icons, tree-shakeable |

## Backend

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Next.js API Routes** | 14.2+ | REST API | BFF pattern, same codebase as frontend |
| **TypeScript** | 5.3+ | Type safety | Consistency with frontend |
| **Supabase** | latest | BaaS (Database + Auth + Storage) | Managed PostgreSQL, real-time, built-in auth |
| **Prisma** | 5.x | ORM | Type-safe queries, migrations, introspection |
| **Zod** | 3.x | Schema validation | API request validation |
| **pino** | 8.x | Logging | Structured JSON logging, high-performance |
| **rate-limiter-flexible** | 3.x | Rate limiting | API abuse protection |

## Blockchain

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **viem** | 2.x | Blockchain interactions | More modern and faster than ethers.js |
| **Avalanche RPC** | - | Avalanche C-Chain node | Quicknode or public RPC with fallback |
| **@wagmi/core** | 2.x | Headless wallet connection | For use in backend/scripts without React |

## Background Jobs

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Supabase Edge Functions** | latest | Serverless functions | Cron jobs, webhooks, isolated logic |
| **Deno** | - | Runtime for Edge Functions | Required by Supabase Edge Functions |

## DevOps & Tooling

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Vercel** | - | Frontend + API hosting | Native Next.js, global CDN, zero-config |
| **Supabase Cloud** | - | DB + Auth + Functions hosting | Managed, scalable, generous free tier |
| **GitHub Actions** | - | CI/CD | Native GitHub integration, free for public repos |
| **ESLint** | 8.x | Linting | Standard for TS/React |
| **Prettier** | 3.x | Code formatting | Style consistency |
| **Husky** | 9.x | Git hooks | Pre-commit hooks (lint, format) |
| **lint-staged** | 15.x | Run linters on staged files | Pre-commit optimization |
| **Sentry** | latest | Error tracking | Production error monitoring |

## Testing (Post-MVP)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vitest** | latest | Unit tests | Faster than Jest, Vite compatible |
| **Playwright** | latest | E2E tests | Full flow testing |
| **React Testing Library** | 14.x | Component tests | React testing best practices |

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.3.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-table": "^8.0.0",
    "wagmi": "^2.0.0",
    "viem": "^2.0.0",
    "@supabase/supabase-js": "^2.40.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.50.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "lucide-react": "latest",
    "tailwindcss": "^3.4.0",
    "pino": "^8.17.0",
    "rate-limiter-flexible": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```
