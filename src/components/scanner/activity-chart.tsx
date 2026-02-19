'use client';

import { useState } from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { Clock } from 'lucide-react';
import { useAgentActivity } from '@/hooks/use-agent-activity';
import { Spinner } from '@/components/shared/spinner';
import { cn } from '@/lib/utils';

type Timeframe = '1W' | '1M' | '3M' | 'ALL';

const TIMEFRAME_DAYS: Record<Timeframe, number> = {
  '1W':  7,
  '1M':  30,
  '3M':  90,
  'ALL': 3650, // 10 years — effectively "all time"
};

function formatLabel(dateStr: string, timeframe: Timeframe) {
  const d = new Date(dateStr + 'T00:00:00Z');
  if (timeframe === '1W') return d.toLocaleDateString('en', { weekday: 'short' });
  if (timeframe === '1M') return `${d.getDate()}/${d.getMonth() + 1}`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className={cn(
      'rounded-xl border border-[rgba(255,255,255,0.1)] px-4 py-3',
      'bg-[rgba(11,15,20,0.97)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
    )}>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-xs capitalize text-[#94A3B8]">{entry.name}</span>
          </div>
          <span className="font-data text-sm font-bold text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ActivityChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('ALL');
  const days = TIMEFRAME_DAYS[timeframe];
  const { data: raw, isLoading } = useAgentActivity(days);

  const tabs: Timeframe[] = ['1W', '1M', '3M', 'ALL'];

  const data = (raw ?? []).map((d) => ({
    label: formatLabel(d.date, timeframe),
    registrations: d.registrations,
    verifications: d.verifications,
  }));

  return (
    <div className="glass flex h-full flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Agent Activity</h2>
          <p className="mt-0.5 text-xs text-[#64748B]">Registrations & verifications over time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                  timeframe === t
                    ? 'bg-[rgba(74,222,128,0.12)] text-primary'
                    : 'text-[#64748B] hover:text-[#94A3B8]',
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-1.5 text-[#475569] sm:flex">
            <Clock className="h-3 w-3" />
            <span className="text-[11px]">Live</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5">
        {[
          { color: '#4ADE80', label: 'Registrations' },
          { color: '#22D3EE', label: 'Verifications' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: color }} />
            <span className="text-xs text-[#64748B]">{label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="flex flex-1 min-h-[180px] items-center justify-center">
          <Spinner size="md" />
        </div>
      ) : !data.length ? (
        <div className="flex flex-1 min-h-[180px] flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-[#475569]">No registration data for this period</p>
          <p className="text-xs text-[#334155]">Data appears as agents register on-chain</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#4ADE80" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#4ADE80" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#475569', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#475569', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="registrations"
                stroke="#4ADE80"
                strokeWidth={1.5}
                fill="url(#greenGrad)"
                dot={false}
                activeDot={{ r: 3, fill: '#4ADE80', strokeWidth: 0 }}
              />
              <Bar
                dataKey="verifications"
                fill="rgba(34,211,238,0.2)"
                radius={[2, 2, 0, 0]}
                maxBarSize={18}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
