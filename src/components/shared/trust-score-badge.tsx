'use client';

import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/index';

/**
 * Trust score range configuration
 */
interface ScoreRange {
  min: number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const SCORE_RANGES: ScoreRange[] = [
  {
    min: 81,
    label: 'Excellent',
    color: 'text-[#4ADE80]',
    bgColor: 'bg-[#4ADE80]/10',
    borderColor: 'border-[#4ADE80]/30',
  },
  {
    min: 61,
    label: 'Good',
    color: 'text-[#22C55E]',
    bgColor: 'bg-[#22C55E]/10',
    borderColor: 'border-[#22C55E]/30',
  },
  {
    min: 41,
    label: 'Moderate',
    color: 'text-[#EAB308]',
    bgColor: 'bg-[#EAB308]/10',
    borderColor: 'border-[#EAB308]/30',
  },
  {
    min: 21,
    label: 'Low',
    color: 'text-[#F97316]',
    bgColor: 'bg-[#F97316]/10',
    borderColor: 'border-[#F97316]/30',
  },
  {
    min: 0,
    label: 'Poor',
    color: 'text-[#EF4444]',
    bgColor: 'bg-[#EF4444]/10',
    borderColor: 'border-[#EF4444]/30',
  },
];

/**
 * Size variants for the badge
 */
type BadgeSize = 'sm' | 'md' | 'lg';

const SIZE_STYLES: Record<BadgeSize, { container: string; text: string; icon: string }> = {
  sm: {
    container: 'h-8 w-8',
    text: 'text-xs font-semibold',
    icon: 'h-2 w-2',
  },
  md: {
    container: 'h-12 w-12',
    text: 'text-sm font-bold',
    icon: 'h-3 w-3',
  },
  lg: {
    container: 'h-16 w-16',
    text: 'text-lg font-bold',
    icon: 'h-4 w-4',
  },
};

interface TrustScoreBadgeProps {
  score: number;
  size?: BadgeSize;
  showTooltip?: boolean;
  lastUpdated?: Date | string;
  className?: string;
}

/**
 * TrustScoreBadge - Circular badge displaying trust score
 *
 * Features:
 * - Color-coded by score range
 * - Size variants (sm, md, lg)
 * - Optional tooltip with last updated time
 */
export function TrustScoreBadge({
  score,
  size = 'md',
  showTooltip = true,
  lastUpdated,
  className,
}: TrustScoreBadgeProps) {
  // Find the appropriate color range for the score
  const scoreRange = useMemo(() => {
    return SCORE_RANGES.find((range) => score >= range.min) || SCORE_RANGES[SCORE_RANGES.length - 1];
  }, [score]);

  // Format the last updated time
  const formattedTime = useMemo(() => {
    if (!lastUpdated) return null;
    const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
    return date.toLocaleString();
  }, [lastUpdated]);

  const sizeStyle = SIZE_STYLES[size];

  const badge = (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full border',
        scoreRange.bgColor,
        scoreRange.borderColor,
        sizeStyle.container,
        className
      )}
      role="img"
      aria-label={`Trust score: ${score} - ${scoreRange.label}`}
    >
      <span className={cn(scoreRange.color, sizeStyle.text)}>{score}</span>
    </div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">
              Trust Score: <span className={scoreRange.color}>{score}</span>
            </p>
            <p className="text-[rgba(255,255,255,0.6)]">{scoreRange.label}</p>
            {formattedTime && (
              <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1">
                Last updated: {formattedTime}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Get score range info for external use
 */
export function getScoreRange(score: number): ScoreRange {
  return SCORE_RANGES.find((range) => score >= range.min) || SCORE_RANGES[SCORE_RANGES.length - 1];
}
