import { NextRequest } from 'next/server';
import { successResponse, handleError } from '@/lib/utils/api-helpers';
import { createLogger } from '@/lib/utils/logger';
import { syncAgents } from '@/services/indexer-service';
import { recalculateAllScores } from '@/services/trust-score-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

const logger = createLogger('api-indexer-refresh');

/**
 * POST /api/v1/indexer/refresh
 *
 * Triggers a manual refresh of the agent index
 * - Syncs agents from both mainnet and testnet Identity Registries
 * - Automatically calculates trust scores for new agents
 *
 * This can be called manually or scheduled via cron
 */
export async function POST(_request: NextRequest) {
  try {
    logger.info('Starting manual indexer refresh');

    const startTime = Date.now();

    // Sync agents from both networks
    const { mainnet, testnet } = await syncAgents();

    // Recalculate trust scores for all agents
    const updatedScores = await recalculateAllScores();

    const duration = Date.now() - startTime;

    const stats = {
      mainnet: {
        indexed: mainnet.indexed,
        skipped: mainnet.skipped,
        failed: mainnet.failed,
        total: mainnet.total,
      },
      testnet: {
        indexed: testnet.indexed,
        skipped: testnet.skipped,
        failed: testnet.failed,
        total: testnet.total,
      },
      totalIndexed: mainnet.indexed + testnet.indexed,
      totalSkipped: mainnet.skipped + testnet.skipped,
      totalFailed: mainnet.failed + testnet.failed,
      trustScoresUpdated: updatedScores,
      duration: `${(duration / 1000).toFixed(2)}s`,
    };

    logger.info(stats, 'Indexer refresh completed successfully');

    return successResponse(
      {
        message: 'Indexer refresh completed',
        ...stats,
      },
      200
    );

  } catch (error) {
    logger.error({ error }, 'Error during indexer refresh');
    return handleError(error);
  }
}
