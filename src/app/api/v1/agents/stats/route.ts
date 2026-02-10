import { NextRequest } from 'next/server';
import { successResponse, handleError } from '@/lib/utils/api-helpers';
import { createLogger } from '@/lib/utils/logger';
import { prisma } from '@/lib/database/prisma';

export const dynamic = 'force-dynamic';

const logger = createLogger('api-agents-stats');

/**
 * GET /api/v1/agents/stats
 *
 * Get aggregate statistics about agents
 *
 * Returns:
 * - total: Total number of agents
 * - verified: Number of verified agents
 * - active24h: Number of agents updated in last 24h
 * - byStatus: Breakdown by status
 * - byType: Breakdown by type
 */
export async function GET(_request: NextRequest) {
  try {
    logger.debug('Fetching agent statistics');

    // Calculate 24h ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Run all queries in parallel
    const [total, verified, active24h, byStatus, byType] = await Promise.all([
      // Total agents
      prisma.agent.count(),

      // Verified agents
      prisma.agent.count({
        where: { status: 'VERIFIED' },
      }),

      // Active in last 24h (updated_at)
      prisma.agent.count({
        where: {
          updated_at: {
            gte: twentyFourHoursAgo,
          },
        },
      }),

      // Breakdown by status
      prisma.agent.groupBy({
        by: ['status'],
        _count: true,
      }),

      // Breakdown by type
      prisma.agent.groupBy({
        by: ['type'],
        _count: true,
      }),
    ]);

    // Format breakdowns
    const statusBreakdown = byStatus.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    const typeBreakdown = byType.reduce((acc, item) => {
      acc[item.type] = item._count;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      total,
      verified,
      active24h,
      byStatus: statusBreakdown,
      byType: typeBreakdown,
    };

    logger.info({ stats }, 'Agent statistics fetched successfully');

    return successResponse(stats, 200);
  } catch (error) {
    logger.error({ error }, 'Error fetching agent statistics');
    return handleError(error);
  }
}
