import { NextRequest } from 'next/server';
import { successResponse, handleError } from '@/lib/utils/api-helpers';
import { createLogger } from '@/lib/utils/logger';
import { syncAgentsFromRoutescan } from '@/services/routescan-indexer-service';
import { recalculateAllScores } from '@/services/trust-score-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max
export const runtime = 'nodejs'; // Ensure Node.js runtime for viem compatibility

const logger = createLogger('cron-indexer');

/**
 * GET /api/cron/indexer
 *
 * Scheduled job that runs every hour to:
 * 1. Index new agents from the ERC-8004 registry via Routescan API
 * 2. Calculate trust scores for new agents
 *
 * Protected by Vercel Cron Secret in production
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret in production
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (process.env.NODE_ENV === 'production' && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        logger.warn('Unauthorized cron job access attempt');
        return new Response('Unauthorized', { status: 401 });
      }
    }

    logger.info('Starting scheduled indexer job via Routescan');

    const startTime = Date.now();

    // Sync agents from Routescan API (max 10 pages for hourly cron)
    const result = await syncAgentsFromRoutescan(10);

    // Recalculate trust scores if new agents were indexed
    let updatedScores = 0;
    if (result.indexed > 0) {
      updatedScores = await recalculateAllScores();
    }

    const duration = Date.now() - startTime;

    const stats = {
      indexed: result.indexed,
      skipped: result.skipped,
      failed: result.failed,
      total: result.total,
      trustScoresUpdated: updatedScores,
      duration: `${(duration / 1000).toFixed(2)}s`,
    };

    logger.info(stats, 'Scheduled indexer job completed successfully');

    return successResponse(
      {
        message: 'Cron job completed',
        ...stats,
      },
      200
    );

  } catch (error) {
    logger.error({ error }, 'Error during scheduled indexer job');
    return handleError(error);
  }
}
