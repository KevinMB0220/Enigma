'use client';

import { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="glass max-w-md p-12">
        <div className="mb-6 text-7xl font-extrabold text-status-error/30">500</div>
        <h1 className="mb-3 text-2xl font-bold text-white">Something went wrong</h1>
        <p className="mb-8 text-sm text-text-secondary">
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-semibold text-white shadow-primary transition-all hover:-translate-y-0.5"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border-light px-6 py-2.5 text-sm font-semibold text-white transition-all hover:border-border-primary hover:bg-glass"
          >
            <Home size={16} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
