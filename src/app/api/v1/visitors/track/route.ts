import { NextRequest } from 'next/server';
import { successResponse, handleError } from '@/lib/utils/api-helpers';
import { createLogger } from '@/lib/utils/logger';
import { prisma } from '@/lib/database/prisma';

export const dynamic = 'force-dynamic';

const logger = createLogger('api-visitor-track');

/**
 * Get client IP from request headers
 */
function getClientIP(request: NextRequest): string {
  // Try different headers that might contain the client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback to unknown if we can't determine IP
  return 'unknown';
}

/**
 * POST /api/v1/visitors/track
 *
 * Track a visitor by IP address. Creates a new visitor record if it's their first visit,
 * or increments the visit count if they've visited before.
 */
export async function POST(request: NextRequest) {
  try {
    const ipAddress = getClientIP(request);

    logger.info({ ipAddress }, 'Tracking visitor');

    // Upsert visitor record
    const visitor = await prisma.visitor.upsert({
      where: { ipAddress },
      update: {
        visitCount: { increment: 1 },
      },
      create: {
        ipAddress,
        visitCount: 1,
      },
    });

    logger.info({
      ipAddress,
      visitCount: visitor.visitCount,
      isNewVisitor: visitor.visitCount === 1,
    }, 'Visitor tracked successfully');

    return successResponse({
      tracked: true,
      visitCount: visitor.visitCount,
      isNewVisitor: visitor.visitCount === 1,
    });
  } catch (error) {
    logger.error({ error }, 'Error tracking visitor');
    return handleError(error);
  }
}
