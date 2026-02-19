'use client';

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  sparkData?: number[];
  icon: LucideIcon;
  accentColor?: string;
}

const DEFAULT_SPARK = [4, 7, 5, 9, 6, 11, 8];

export function KpiCard({
  label,
  value,
  delta,
  trend = 'flat',
  sparkData = DEFAULT_SPARK,
  icon: Icon,
  accentColor = '#4ADE80',
}: KpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? '#4ADE80' : trend === 'down' ? '#FB7185' : '#64748B';

  const chartData = sparkData.map((v, i) => ({ i, v }));

  return (
    <div className={cn(
      'glass group relative overflow-hidden p-5 interactive-card',
      'flex flex-col justify-between gap-4',
    )}>
      {/* Subtle accent glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: accentColor }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
            style={{ background: `${accentColor}14` }}
          >
            <Icon className="h-4 w-4" style={{ color: accentColor }} />
          </div>
          <p className="text-xs font-medium text-[#64748B]">{label}</p>
        </div>

        {/* Sparkline */}
        <div className="h-12 w-20 opacity-60 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={accentColor}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-end justify-between">
        <span className="font-data text-3xl font-bold leading-none text-white">
          {value}
        </span>
        {delta && (
          <div className="flex items-center gap-1">
            <TrendIcon className="h-3 w-3" style={{ color: trendColor }} />
            <span className="font-data text-xs font-medium" style={{ color: trendColor }}>
              {delta}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
