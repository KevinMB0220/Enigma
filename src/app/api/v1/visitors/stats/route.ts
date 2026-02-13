import { NextRequest } from 'next/server';
import { successResponse, handleError } from '@/lib/utils/api-helpers';
import { createLogger } from '@/lib/utils/logger';
import { prisma } from '@/lib/database/prisma';

export const dynamic = 'force-dynamic';

const logger = createLogger('api-visitor-stats');

/**
 * GET /api/v1/visitors/stats
 *
 * Get visitor statistics including:
 * - Total unique visitors (count of distinct IPs)
 * - Total visits (sum of all visit counts)
 */
export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching visitor statistics');

    // Get count of unique visitors and sum of all visits
    const [uniqueVisitors, totalVisitsAggregate] = await Promise.all([
      prisma.visitor.count(),
      prisma.visitor.aggregate({
        _sum: {
          visitCount: true,
        },
      }),
    ]);

    const totalVisits = totalVisitsAggregate._sum.visitCount || 0;

    const stats = {
      uniqueVisitors,
      totalVisits,
    };

    logger.info(stats, 'Visitor statistics fetched successfully');

    return successResponse(stats);
  } catch (error) {
    logger.error({ error }, 'Error fetching visitor statistics');
    return handleError(error);
  }
}
