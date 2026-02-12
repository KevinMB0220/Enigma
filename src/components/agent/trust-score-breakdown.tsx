'use client';

import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Shield,
  Activity,
  ShieldCheck,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { TrustScoreBadge, getScoreRange } from '@/components/shared/trust-score-badge';
import { cn } from '@/lib/utils/index';

/**
 * Individual score component data
 */
export interface ScoreComponentData {
  score: number;
  weight: number;
  weighted: number;
  details: Record<string, unknown>;
}

/**
 * Complete breakdown data from API
 */
export interface TrustScoreData {
  score: number;
  breakdown: {
    volume: ScoreComponentData;
    proxy: ScoreComponentData;
    uptime: ScoreComponentData;
    ozMatch: ScoreComponentData;
    ratings: ScoreComponentData;
  };
  lastUpdated: string;
}

interface TrustScoreBreakdownProps {
  data: TrustScoreData;
  previousScore?: number;
  className?: string;
}

/**
 * Component labels, descriptions and icons
 */
const COMPONENT_INFO: Record<
  keyof TrustScoreData['breakdown'],
  { label: string; description: string; icon: LucideIcon }
> = {
  volume: {
    label: 'Transaction Volume',
    description: 'Based on 24h transaction activity',
    icon: BarChart3,
  },
  proxy: {
    label: 'Proxy Transparency',
    description: 'Contract proxy detection and declaration',
    icon: Shield,
  },
  uptime: {
    label: 'Uptime',
    description: 'Heartbeat response rate (24h)',
    icon: Activity,
  },
  ozMatch: {
    label: 'Security Patterns',
    description: 'OpenZeppelin bytecode similarity',
    icon: ShieldCheck,
  },
  ratings: {
    label: 'Community Rating',
    description: 'Average user rating score',
    icon: Star,
  },
};

/**
 * Get progress bar fill color and score badge color based on score
 */
function getScoreStyles(score: number): { bar: string; badge: string } {
  if (score >= 80) return { bar: 'bg-emerald-500', badge: 'text-emerald-400' };
  if (score >= 60) return { bar: 'bg-blue-500', badge: 'text-blue-400' };
  if (score >= 40) return { bar: 'bg-amber-500', badge: 'text-amber-400' };
  if (score >= 20) return { bar: 'bg-orange-500', badge: 'text-orange-400' };
  return { bar: 'bg-rose-500', badge: 'text-rose-400' };
}

/**
 * TrustScoreBreakdown - Detailed view of trust score components
 *
 * Features:
 * - Overall score with badge
 * - Progress bars for each component
 * - Weight percentages displayed
 * - Explanatory text for each metric
 * - Trend indicator if previous score provided
 */
export function TrustScoreBreakdown({
  data,
  previousScore,
  className,
}: TrustScoreBreakdownProps) {
  const { score, breakdown, lastUpdated } = data;

  // Calculate trend
  const trend = useMemo(() => {
    if (previousScore === undefined) return null;
    const diff = score - previousScore;
    if (diff > 0) return { direction: 'up' as const, value: diff };
    if (diff < 0) return { direction: 'down' as const, value: Math.abs(diff) };
    return { direction: 'stable' as const, value: 0 };
  }, [score, previousScore]);

  const scoreRange = getScoreRange(score);

  return (
    <div
      className={cn(
        'rounded-xl bg-[rgba(15,17,23,0.8)] backdrop-blur-xl',
        'border border-white/[0.08] shadow-lg shadow-black/20',
        'p-6',
        className
      )}
    >
      {/* Header with overall score */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <TrustScoreBadge score={score} size="lg" lastUpdated={lastUpdated} />
          <div>
            <h3 className="text-lg font-semibold text-white">Trust Score</h3>
            <p className={cn('text-sm font-medium', scoreRange.color)}>
              {scoreRange.label}
            </p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1.5">
            {trend.direction === 'up' && (
              <>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">+{trend.value}</span>
              </>
            )}
            {trend.direction === 'down' && (
              <>
                <TrendingDown className="h-4 w-4 text-rose-400" />
                <span className="text-sm font-medium text-rose-400">-{trend.value}</span>
              </>
            )}
            {trend.direction === 'stable' && (
              <>
                <Minus className="h-4 w-4 text-white/50" />
                <span className="text-sm text-white/50">No change</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Component breakdown */}
      <div className="space-y-5">
        {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map((key) => {
          const component = breakdown[key];
          const info = COMPONENT_INFO[key];
          const { bar: barColor, badge: badgeColor } = getScoreStyles(component.score);
          const weightPercent = Math.round(component.weight * 100);
          const Icon = info.icon;

          return (
            <div key={key} className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/70">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="text-sm font-medium text-white">
                        {info.label}
                      </span>
                      <span className="text-xs text-white/40">
                        {weightPercent}%
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-white/50">
                      {info.description}
                    </p>
                  </div>
                </div>
                <div className={cn('shrink-0 text-right text-sm font-semibold tabular-nums', badgeColor)}>
                  {component.score}
                  <span className="font-normal text-white/50">/100</span>
                </div>
              </div>

              {/* Custom progress bar - single element, no indeterminate */}
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={component.score}
              >
                <div
                  className={cn('h-full rounded-full transition-[width] duration-500 ease-out', barColor)}
                  style={{ width: `${Math.max(0, Math.min(100, component.score))}%` }}
                />
              </div>

              <ComponentDetails component={key} details={component.details} />
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <p className="text-xs text-white/40 text-center">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

/**
 * Render component-specific details
 */
function ComponentDetails({
  component,
  details,
}: {
  component: keyof TrustScoreData['breakdown'];
  details: Record<string, unknown>;
}) {
  if (!details || Object.keys(details).length === 0) return null;

  const renderDetail = () => {
    switch (component) {
      case 'volume':
        return (
          <span>
            {details.volume24h as string} • {details.txCount as number} transactions
          </span>
        );
      case 'proxy':
        const proxyType = details.type as string | undefined;
        return (
          <span>
            {details.status as string}
            {proxyType && proxyType !== 'NONE' && ` (${proxyType})`}
          </span>
        );
      case 'uptime':
        return (
          <span>
            {details.successRate as string} success rate • {details.checks24h as number} checks
          </span>
        );
      case 'ozMatch':
        const components = details.matchedComponents as string[] | undefined;
        return components && components.length > 0 ? (
          <span>Matched: {components.join(', ')}</span>
        ) : (
          <span>No known patterns detected</span>
        );
      case 'ratings':
        const avg = details.average as number;
        const count = details.count as number;
        return count > 0 ? (
          <span>
            {avg.toFixed(1)}/5 average • {count} ratings
          </span>
        ) : (
          <span>{details.message as string}</span>
        );
      default:
        return null;
    }
  };

  const content = renderDetail();
  if (!content) return null;

  return (
    <p className="text-xs text-white/45 rounded-md bg-white/[0.04] px-2.5 py-1.5 border border-white/[0.06]">
      {content}
    </p>
  );
}
