import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Centralized logger instance using Pino for structured logging
 *
 * Development: Simple console logging (avoids worker thread issues in Next.js)
 * Production: JSON format, info level
 */
export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  base: {
    service: 'flare',
    env: process.env.NODE_ENV || 'development',
  },
  // Avoid using pino-pretty transport in Next.js dev mode
  // as it uses worker threads that can crash
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});

/**
 * Create a child logger with additional context
 *
 * @example
 * const agentLogger = createLogger('agent-service');
 * agentLogger.info({ agentAddress: '0x123...' }, 'Agent registered');
 */
export const createLogger = (module: string) => {
  return logger.child({ module });
};

export default logger;
