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
        'flex h-10 w-10 items-center justify-center rounded-none transition-all duration-300',
        'border border-[#4ADE80]/20 bg-[#4ADE80]/5',
        'text-[#4ADE80]/60 hover:border-[#4ADE80]/50 hover:bg-[#4ADE80]/15 hover:text-[#4ADE80]',
        'hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]',
        'disabled:opacity-20 disabled:cursor-not-allowed',
        !isCompleted && isReady && 'animate-pulse',
        className
      )}
      title={isReady ? `Take the ${page} tour` : 'Loading tour...'}
      aria-label={`Start ${page} page tour`}
    >
      {isReady ? (
        <span className="font-mono text-[15px] font-black mt-0.5">?</span>
      ) : (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
    </button>
  );
}
