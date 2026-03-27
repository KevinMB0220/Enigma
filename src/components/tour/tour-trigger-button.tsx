'use client';

import { HelpCircle, Loader2 } from 'lucide-react';
import { useTour } from './use-tour';
import { cn } from '@/lib/utils';
import type { TourPage } from './tour-provider';

interface TourTriggerButtonProps {
  page: TourPage;
  className?: string;
}

export function TourTriggerButton({ page, className }: TourTriggerButtonProps) {
  const { startTour, isCompleted, isReady } = useTour(page);

  return (
    <button
      data-tour="help-button"
      onClick={startTour}
      disabled={!isReady}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-none transition-all duration-150',
        'border border-white/[0.08] bg-white/[0.04]',
        'text-[#94A3B8] hover:border-flare-accent/40 hover:bg-flare-accent/[0.06] hover:text-flare-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        !isCompleted && isReady && 'animate-pulse',
        className
      )}
      title={isReady ? `Take the ${page} tour` : 'Loading tour...'}
      aria-label={`Start ${page} page tour`}
    >
      {isReady ? (
        <HelpCircle className="h-4 w-4" />
      ) : (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
    </button>
  );
}
