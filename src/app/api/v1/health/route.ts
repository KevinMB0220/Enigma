import { successResponse } from '@/lib/utils/api-helpers';
import { prisma } from '@/lib/database/prisma';
import { publicClient } from '@/lib/blockchain/client';
import { createLogger } from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('api-health');

interface ComponentCheck {
  status: 'up' | 'down';
  latency_ms: number;
  details?: string;
}

async function checkDatabase(): Promise<ComponentCheck> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'up', latency_ms: Date.now() - start };
  } catch (error) {
    logger.error({ error }, 'Database health check failed');
    return {
      status: 'down',
      latency_ms: Date.now() - start,
      details: 'Database connection failed',
    };
  }
}

async function checkBlockchain(): Promise<ComponentCheck> {
  const start = Date.now();
  try {
    await publicClient.getBlockNumber();
    return { status: 'up', latency_ms: Date.now() - start };
  } catch (error) {
    logger.error({ error }, 'Blockchain RPC health check failed');
    return {
      status: 'down',
      latency_ms: Date.now() - start,
      details: 'Blockchain RPC unreachable',
    };
  }
}

export async function GET() {
  const [database, blockchain] = await Promise.all([
    checkDatabase(),
    checkBlockchain(),
  ]);

  const allUp = database.status === 'up' && blockchain.status === 'up';
  const allDown = database.status === 'down' && blockchain.status === 'down';

  const status = allDown ? 'unhealthy' : allUp ? 'healthy' : 'degraded';

  const health = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    checks: { database, blockchain },
  };

  return successResponse(health, status === 'unhealthy' ? 503 : 200);
}
