import { NextRequest } from 'next/server';
import { successResponse, handleError } from '@/lib/utils/api-helpers';
import { createLogger } from '@/lib/utils/logger';
import { exec } from 'child_process';
import { promisify } from 'util';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

const logger = createLogger('api-indexer-refresh');
const execAsync = promisify(exec);

/**
 * POST /api/v1/indexer/refresh
 *
 * Triggers a manual refresh of the agent index
 * - Runs the indexer script to fetch new agents from registry
 * - Automatically calculates trust scores for new agents
 *
 * This can be called manually or scheduled via cron
 */
export async function POST(_request: NextRequest) {
  try {
    logger.info('Starting manual indexer refresh');

    // Run the indexer script
    const startTime = Date.now();

    try {
      const { stdout } = await execAsync(
        'npx tsx scripts/index-by-range.ts',
        {
          cwd: process.cwd(),
          timeout: 240000, // 4 minute timeout
        }
      );

      const duration = Date.now() - startTime;

      logger.info(
        { duration, stdout: stdout.slice(-500) },
        'Indexer refresh completed successfully'
      );

      // Parse the output to get stats
      const indexedMatch = stdout.match(/Indexed: (\d+)/);
      const skippedMatch = stdout.match(/Skipped: (\d+)/);
      const failedMatch = stdout.match(/Failed: (\d+)/);

      const stats = {
        indexed: indexedMatch ? parseInt(indexedMatch[1]) : 0,
        skipped: skippedMatch ? parseInt(skippedMatch[1]) : 0,
        failed: failedMatch ? parseInt(failedMatch[1]) : 0,
        duration: `${(duration / 1000).toFixed(2)}s`,
      };

      return successResponse(
        {
          message: 'Indexer refresh completed',
          ...stats,
        },
        200
      );

    } catch (scriptError: unknown) {
      const error = scriptError as { message: string; stdout?: string; stderr?: string };
      logger.error(
        { error, stdout: error.stdout, stderr: error.stderr },
        'Indexer script failed'
      );

      // Still return some info if script failed
      return successResponse(
        {
          message: 'Indexer refresh completed with errors',
          error: error.message,
          stdout: error.stdout?.slice(-500),
        },
        500
      );
    }

  } catch (error) {
    logger.error({ error }, 'Error during indexer refresh');
    return handleError(error);
  }
}
