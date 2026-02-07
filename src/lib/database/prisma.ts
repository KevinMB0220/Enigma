import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client instance for database operations
 * Uses lazy initialization via getter to avoid instantiation during
 * Vercel build step where DATABASE_URL is not available.
 * @see docs/backend/database.md
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return Reflect.get(getPrismaClient(), prop);
  },
});

export default prisma;
