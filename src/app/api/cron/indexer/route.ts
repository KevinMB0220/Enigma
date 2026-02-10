import { NextRequest } from 'next/server';
import { successResponse, handleError } from '@/lib/utils/api-helpers';
import { createLogger } from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

const logger = createLogger('cron-indexer');

/**
 * GET /api/cron/indexer
 *
 * Scheduled job that runs every hour to:
 * 1. Index new agents from the ERC-8004 registry
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

    logger.info('Starting scheduled indexer job');

    // Call the refresh endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/indexer/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Indexer refresh failed: ${JSON.stringify(result)}`);
    }

    logger.info(
      { result },
      'Scheduled indexer job completed successfully'
    );

    return successResponse(
      {
        message: 'Cron job completed',
        result,
      },
      200
    );

  } catch (error) {
    logger.error({ error }, 'Error during scheduled indexer job');
    return handleError(error);
  }
}
