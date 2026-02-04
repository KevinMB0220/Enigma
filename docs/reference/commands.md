# Useful Commands

## Development

```bash
# Start development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# TypeScript type check
npm run type-check
```

## Prisma (Database)

```bash
# Generate Prisma Client
npx prisma generate

# Create migration in development
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Open database GUI
npx prisma studio

# Seed demo data
npx prisma db seed

# Reset database (development only)
npx prisma migrate reset
```

## Supabase

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Deploy edge functions
supabase functions deploy

# Deploy specific function
supabase functions deploy indexer

# Set secrets
supabase secrets set KEY=value

# View logs
supabase functions logs <function_name>
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/trust-score-calculation

# Commit with conventional commits
git commit -m "feat: implement trust score calculation"
git commit -m "fix: resolve wallet disconnection bug"
git commit -m "docs: add API documentation"
git commit -m "chore: update dependencies"

# Push branch
git push origin feature/trust-score-calculation

# Rebase with main
git fetch origin
git rebase origin/main
```

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Build & Deploy

```bash
# Analyze bundle size
npx @next/bundle-analyzer

# Check for type errors
npm run type-check

# Verify production build locally
npm run build && npm run start
```

---

# Reference Links

| Resource | URL |
|----------|-----|
| Next.js Docs | https://nextjs.org/docs |
| Supabase Docs | https://supabase.com/docs |
| Prisma Docs | https://www.prisma.io/docs |
| wagmi Docs | https://wagmi.sh |
| viem Docs | https://viem.sh |
| TailwindCSS | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com |
| Avalanche Docs | https://docs.avax.network |
| OpenZeppelin Contracts | https://docs.openzeppelin.com/contracts |
| TanStack Query | https://tanstack.com/query |
| Zod | https://zod.dev |
