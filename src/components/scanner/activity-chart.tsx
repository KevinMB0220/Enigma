'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Activity, Radio } from 'lucide-react';
import { useAgentActivity } from '@/hooks/use-agent-activity';
import { Spinner } from '@/components/shared/spinner';
import { IndustrialCorner } from '@/components/shared/industrial-corner';
import { cn } from '@/lib/utils';

export function ActivityChart() {
  const { data, isLoading } = useAgentActivity();

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((d: any) => ({
      name: d.date.split('-').slice(1).join('/'),
      count: d.registrations,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center border border-flare-stroke bg-flare-surface">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="group relative border border-flare-stroke bg-flare-surface p-6 rounded-none transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <IndustrialCorner position="tl" />
      <IndustrialCorner position="tr" />
      <IndustrialCorner position="bl" />
      <IndustrialCorner position="br" />
      
      <div className="mb-6 flex items-center justify-between border-b border-flare-stroke pb-4">
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4 text-flare-accent" />
          <h3 className="text-[12px] font-black text-flare-text-h uppercase tracking-[0.4em]">Network Velocity</h3>
        </div>
        <div className="flex items-center gap-3">
           <Radio className="h-3 w-3 text-flare-accent animate-pulse" />
           <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-flare-text-l opacity-40 font-bold">Protocol_Sync_Live</span>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 222, 128, 0.04)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}
            />
            <Tooltip
              cursor={{ fill: '#4ADE8008' }}
              contentStyle={{
                backgroundColor: '#0F1219',
                border: '1px solid rgba(74, 222, 128, 0.1)',
                borderRadius: '0px',
                fontSize: '11px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
              itemStyle={{ color: '#4ADE80' }}
            />
            <Bar dataKey="count" radius={[0, 0, 0, 0]}>
              {chartData.map((_entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === chartData.length - 1 ? '#4ADE80' : 'rgba(74, 222, 128, 0.2)'} 
                  className="transition-all duration-300 hover:fill-flare-accent"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between border-t border-flare-stroke pt-4 font-mono text-[9px] uppercase tracking-widest text-flare-text-l opacity-20 font-bold">
        <span>Historical_Snapshot_T-30D</span>
        <span className="text-flare-accent">Status_Online</span>
      </div>
    </div>
  );
}
