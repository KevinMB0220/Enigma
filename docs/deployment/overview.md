# Deployment & DevOps

## Infrastructure

| Service | Purpose | Environment |
|---------|---------|-------------|
| **Vercel** | Frontend + API hosting | Production |
| **Supabase** | Database + Auth + Edge Functions | Production |
| **GitHub Actions** | CI/CD | Automation |
| **Sentry** | Error tracking | Monitoring |

## Environment Variables

### Frontend (Vercel)

```bash
# Public (accessible in browser)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abc123
NEXT_PUBLIC_CHAIN_ENV=mainnet

# Server-only
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...
SENTRY_DSN=https://...@sentry.io/...
```

### Supabase Edge Functions

```bash
# Set via Supabase CLI
supabase secrets set AVALANCHE_RPC_URL=https://...
supabase secrets set DATABASE_URL=postgresql://...
```

## Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "crons": []
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

### Deploy Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Database Migrations

```bash
# Development
npx prisma migrate dev --name add_feature

# Production (run in CI or manually)
npx prisma migrate deploy

# Generate client after schema changes
npx prisma generate
```

## Supabase Edge Functions Deployment

```bash
# Login to Supabase
supabase login

# Link project
supabase link --project-ref <project-id>

# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy indexer
supabase functions deploy centinela

# Set secrets
supabase secrets set KEY=value
```

## Monitoring & Alerts

### Sentry Setup

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Health Checks

- `/api/v1/health` - API health
- Vercel deployment status
- Supabase dashboard metrics
- Sentry error dashboard

## Rollback Procedure

1. **Vercel**: Go to Deployments → Select previous deployment → Promote to Production
2. **Database**: `npx prisma migrate resolve --rolled-back <migration-name>`
3. **Edge Functions**: Redeploy previous version from git

## Security Checklist

- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] No secrets in client-side code
- [ ] RLS policies enabled on Supabase tables
- [ ] API key rotation schedule
- [ ] Error messages don't leak sensitive info
