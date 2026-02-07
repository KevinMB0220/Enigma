import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, handleError } from '@/lib/utils/api-helpers';
import { ValidationError, NotFoundError } from '@/lib/utils/errors';
import { createLogger } from '@/lib/utils/logger';
import { getAgent } from '@/services/agent-service';
import {
  calculateUptime,
  getHeartbeatLogs,
  type UptimePeriod,
} from '@/services/centinela/heartbeat-service';

const logger = createLogger('api-agents-heartbeats');

/**
 * Valid period values for heartbeat queries
 */
const VALID_PERIODS = ['24h', '7d', '30d'] as const;

/**
 * Query parameters schema
 */
const querySchema = z.object({
  period: z.enum(VALID_PERIODS).optional().default('24h'),
  limit: z.coerce.number().int().positive().max(500).optional().default(100),
});

/**
 * GET /api/v1/agents/:address/heartbeats
 *
 * Retrieve heartbeat history for a specific agent
 *
 * Query Parameters:
 * - period: Time range (24h, 7d, 30d) - default 24h
 * - limit: Max results - default 100, max 500
 *
 * @see docs/api/endpoints.md
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const normalizedAddress = address.toLowerCase();

    logger.info({ address: normalizedAddress }, 'Fetching heartbeat history');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      period: searchParams.get('period') || '24h',
      limit: searchParams.get('limit') || '100',
    };

    // Validate query parameters
    const validationResult = querySchema.safeParse(queryParams);
    if (!validationResult.success) {
      const fields: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path.join('.');
        fields[field] = err.message;
      });

      throw new ValidationError('Invalid query parameters', fields);
    }

    const { period, limit } = validationResult.data;

    // Check if agent exists
    const agent = await getAgent(normalizedAddress);
    if (!agent) {
      throw new NotFoundError(`Agent not found: ${address}`);
    }

    // Get heartbeat logs and calculate uptime in parallel
    const [logs, uptimeData] = await Promise.all([
      getHeartbeatLogs(normalizedAddress, limit, period as UptimePeriod),
      calculateUptime(normalizedAddress, period as UptimePeriod),
    ]);

    // Format logs for response
    const formattedLogs = logs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      challengeType: log.challengeType,
      result: log.result,
      responseTimeMs: log.responseTimeMs,
      errorMessage: log.errorMessage,
    }));

    logger.info({
      address: normalizedAddress,
      period,
      logsCount: formattedLogs.length,
      uptime: uptimeData.uptimePercentage,
    }, 'Heartbeat history fetched successfully');

    return successResponse({
      address: normalizedAddress,
      period,
      uptime: uptimeData.uptimePercentage,
      totalPings: uptimeData.totalPings,
      successfulPings: uptimeData.successfulPings,
      failedPings: uptimeData.failedPings,
      timeoutPings: uptimeData.timeoutPings,
      averageResponseTimeMs: uptimeData.averageResponseTimeMs,
      logs: formattedLogs,
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fields: Record<string, string> = {};
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        fields[field] = err.message;
      });

      logger.warn({ fields }, 'Validation error in heartbeats request');
      return handleError(new ValidationError('Invalid query parameters', fields));
    }

    logger.error({ error }, 'Error fetching heartbeat history');
    return handleError(error);
  }
}
