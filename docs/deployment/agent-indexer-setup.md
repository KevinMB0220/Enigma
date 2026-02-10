# Agent Indexer Automation Setup

This document describes the automated agent indexing system and how to configure it.

## Overview

The system automatically:
1. **Indexes new agents** from the ERC-8004 Identity Registry on Avalanche
2. **Calculates trust scores** for newly indexed agents
3. **Runs every hour** via Vercel Cron Jobs

## Components

### 1. Indexer Script
**Location**: `scripts/index-by-range.ts`

- Iterates through tokenIds (1 to MAX_TOKEN_ID)
- Queries the registry contract for each token's owner
- Creates agent records in the database
- Automatically calculates trust scores for new agents

### 2. Refresh Endpoint
**Endpoint**: `POST /api/v1/indexer/refresh`

- Executes the indexer script
- Returns statistics (indexed, skipped, failed)
- Can be called manually or by cron job
- Timeout: 5 minutes

### 3. Cron Job
**Endpoint**: `GET /api/cron/indexer`
**Schedule**: Every hour (`0 * * * *`)

- Protected by `CRON_SECRET` in production
- Calls the refresh endpoint internally
- Logs all operations

## Setup Instructions

### Environment Variables

Add to your `.env` file:

```bash
# Cron Job Secret (for production)
CRON_SECRET=your-random-secret-here

# App URL (for internal API calls)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Vercel Configuration

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/indexer",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Vercel Dashboard Setup

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `CRON_SECRET` with a secure random value
4. The cron job will be automatically deployed with your project

### Local Testing

Test the refresh endpoint locally:

```bash
# Run the indexer script directly
npx tsx scripts/index-by-range.ts

# Or call the API endpoint
curl -X POST http://localhost:3000/api/v1/indexer/refresh
```

## Manual Triggers

### Via UI
Click the **Sync** button in the Scanner page (`/scanner`)

### Via API
```bash
curl -X POST https://your-domain.com/api/v1/indexer/refresh
```

### Via Cron (with auth)
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/indexer
```

## Trust Score Calculation

Trust scores are automatically calculated when new agents are indexed. The score is based on:

- **Volume (25%)**: Transaction volume in last 24h
- **Proxy (20%)**: No hidden proxy detected
- **Uptime (25%)**: Heartbeat response rate
- **OZ Match (15%)**: OpenZeppelin bytecode similarity
- **Ratings (15%)**: Community ratings average

Default scores for new agents (no activity data):
- Volume: 20 (no transactions)
- Proxy: 100 (not detected)
- Uptime: 0 (no heartbeats)
- OZ Match: 20 (no scan data)
- Ratings: 50 (no ratings)

**Typical initial score**: 36-50

## Monitoring

### Logs
Check Vercel logs for:
- `cron-indexer`: Cron job execution
- `api-indexer-refresh`: Manual refresh calls
- `trust-score-service`: Trust score calculations

### Metrics
The refresh endpoint returns:
```json
{
  "data": {
    "message": "Indexer refresh completed",
    "indexed": 5,
    "skipped": 1616,
    "failed": 0,
    "duration": "45.32s"
  }
}
```

## Troubleshooting

### Cron job not running
1. Check `vercel.json` is committed and deployed
2. Verify `CRON_SECRET` is set in Vercel dashboard
3. Check deployment logs in Vercel

### Indexer timeout
- Default timeout: 5 minutes (300s)
- If needed, adjust `maxDuration` in route handlers
- Consider batching for large numbers of new agents

### Trust scores not calculating
- Check logs for `trust-score-service` errors
- Verify database connection
- Ensure Prisma client is generated

## Future Enhancements

- Add email/Slack notifications for indexing results
- Implement incremental indexing (track last indexed tokenId)
- Add retry logic for failed agents
- Dashboard for monitoring indexer health
