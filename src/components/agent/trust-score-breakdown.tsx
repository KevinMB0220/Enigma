'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
 * Component labels and descriptions
 */
const COMPONENT_INFO: Record<keyof TrustScoreData['breakdown'], { label: string; description: string }> = {
  volume: {
    label: 'Transaction Volume',
    description: 'Based on 24h transaction activity',
  },
  proxy: {
    label: 'Proxy Transparency',
    description: 'Contract proxy detection and declaration',
  },
  uptime: {
    label: 'Uptime',
    description: 'Heartbeat response rate (24h)',
  },
  ozMatch: {
    label: 'Security Patterns',
    description: 'OpenZeppelin bytecode similarity',
  },
  ratings: {
    label: 'Community Rating',
    description: 'Average user rating score',
  },
};

/**
 * Get color class based on score
 */
function getProgressColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  if (score >= 20) return 'bg-orange-500';
  return 'bg-red-500';
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
        'rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl',
        'border border-[rgba(255,255,255,0.06)] p-6',
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

        {/* Trend indicator */}
        {trend && (
          <div className="flex items-center gap-1">
            {trend.direction === 'up' && (
              <>
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">+{trend.value}</span>
              </>
            )}
            {trend.direction === 'down' && (
              <>
                <TrendingDown className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">-{trend.value}</span>
              </>
            )}
            {trend.direction === 'stable' && (
              <>
                <Minus className="h-4 w-4 text-[rgba(255,255,255,0.5)]" />
                <span className="text-sm text-[rgba(255,255,255,0.5)]">No change</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Component breakdown */}
      <div className="space-y-4">
        {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map((key) => {
          const component = breakdown[key];
          const info = COMPONENT_INFO[key];
          const progressColor = getProgressColor(component.score);
          const weightPercent = Math.round(component.weight * 100);

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {info.label}
                    </span>
                    <span className="text-xs text-[rgba(255,255,255,0.4)]">
                      ({weightPercent}%)
                    </span>
                  </div>
                  <p className="text-xs text-[rgba(255,255,255,0.5)]">
                    {info.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-white">
                    {component.score}
                  </span>
                  <span className="text-xs text-[rgba(255,255,255,0.5)]">/100</span>
                </div>
              </div>

              <div className="relative">
                <Progress
                  value={component.score}
                  className="h-2 bg-[rgba(31,41,55,0.6)]"
                />
                {/* Overlay with custom color */}
                <div
                  className={cn('absolute top-0 left-0 h-2 rounded-full transition-all duration-500', progressColor)}
                  style={{ width: `${component.score}%` }}
                />
              </div>

              {/* Component-specific details */}
              <ComponentDetails component={key} details={component.details} />
            </div>
          );
        })}
      </div>

      {/* Last updated */}
      <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <p className="text-xs text-[rgba(255,255,255,0.4)] text-center">
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
    <p className="text-xs text-[rgba(255,255,255,0.4)] pl-2 border-l-2 border-[rgba(255,255,255,0.1)]">
      {content}
    </p>
  );
}
