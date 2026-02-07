'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error state component for the Scanner page
 * Shows error message with retry action
 */
export function ErrorState({
  message = 'Something went wrong while loading agents.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        Failed to load agents
      </h3>

      <p className="text-sm text-[rgba(255,255,255,0.6)] text-center max-w-sm mb-6">
        {message}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
