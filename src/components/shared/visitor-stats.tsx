'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useVisitorTracking } from '@/hooks/use-visitor-tracking';
import { cn } from '@/lib/utils/index';

interface VisitorStatsProps {
  className?: string;
}

/**
 * VisitorStats - Display unique visitors and total visits
 *
 * Automatically tracks the current visitor and displays real-time statistics
 */
export function VisitorStats({ className }: VisitorStatsProps) {
  const { stats, isLoading } = useVisitorTracking();

  if (isLoading || !stats) {
    return null;
  }

  return (
    <div className={cn(
      'group relative inline-flex items-center gap-4 overflow-hidden rounded-lg',
      'border border-[rgba(255,255,255,0.06)] bg-[rgba(15,17,23,0.6)]',
      'px-6 py-3 backdrop-blur-xl transition-all',
      'hover:border-[rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]',
      className
    )}>
      {/* Icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(59,130,246,0.08)] transition-colors group-hover:bg-[rgba(59,130,246,0.15)]">
        <TrendingUp className="h-4 w-4 text-primary" />
      </div>

      {/* Stats */}
      <div className="flex items-baseline gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-white tabular-nums">
            {stats.uniqueVisitors.toLocaleString()}
          </span>
          <span className="text-xs text-white/40">visitors</span>
        </div>
        <div className="h-4 w-px bg-white/[0.08]" />
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-white tabular-nums">
            {stats.totalVisits.toLocaleString()}
          </span>
          <span className="text-xs text-white/40">visits</span>
        </div>
      </div>
    </div>
  );
}
