'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body
        style={{
          background: '#0A0B0F',
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(15, 17, 23, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '3rem',
              maxWidth: '28rem',
            }}
          >
            <div
              style={{
                fontSize: '4.5rem',
                fontWeight: 800,
                color: 'rgba(239, 68, 68, 0.3)',
                marginBottom: '1.5rem',
              }}
            >
              Error
            </div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              Critical Error
            </h1>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#9CA3AF',
                marginBottom: '2rem',
              }}
            >
              A critical error occurred in the application. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: '#FFFFFF',
                padding: '0.625rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
