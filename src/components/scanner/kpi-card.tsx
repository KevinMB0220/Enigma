'use client';

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { IndustrialCorner } from '@/components/shared/industrial-corner';
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

const DEFAULT_SPARK = [4, 7, 5, 9, 6, 11, 8, 10, 7, 12];

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
      'group relative overflow-hidden p-6 border border-flare-stroke bg-flare-surface transition-all duration-300 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.3)]',
      'flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px]'
    )}>
      <IndustrialCorner position="tl" size={3} />
      <IndustrialCorner position="tr" size={3} />
      <IndustrialCorner position="bl" size={3} />
      <IndustrialCorner position="br" size={3} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-flare-bg/60 transition-all rounded-md">
            <Icon className="h-5 w-5" style={{ color: accentColor }} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-flare-text-l group-hover:text-flare-text-h transition-colors">
            {label}
          </p>
        </div>

        {/* Technical Sparkline */}
        <div className="h-8 w-20 opacity-20 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="stepAfter"
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

      <div className="flex items-end justify-between mt-auto relative z-10">
        <span className="font-mono text-2xl font-black leading-none text-flare-accent tracking-tighter shadow-sm">
          {value}
        </span>
        
        {delta && (
          <div className="flex items-center gap-1.5 border border-flare-stroke/40 px-2 py-0.5 bg-flare-bg/40">
            <TrendIcon className="h-3 w-3" style={{ color: trendColor }} />
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-flare-text-l opacity-80">
              {delta}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
