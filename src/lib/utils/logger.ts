import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Centralized logger instance using Pino for structured logging
 *
 * Development: Pretty print with colors, debug level
 * Production: JSON format, info level
 */
export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  base: {
    service: 'enigma',
    env: process.env.NODE_ENV || 'development',
  },
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
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
