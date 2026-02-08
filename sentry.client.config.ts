import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: process.env.NODE_ENV === 'production',

  tracesSampleRate: 0.1,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [Sentry.replayIntegration()],

  beforeSend(event) {
    // Skip 4xx client errors (validation, not-found, etc.)
    const statusCode = event.extra?.statusCode;
    if (typeof statusCode === 'number' && statusCode < 500) {
      return null;
    }
    return event;
  },

  environment: process.env.NODE_ENV,
});
