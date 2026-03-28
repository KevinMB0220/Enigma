'use client';

import Link from 'next/link';
import { Clock, Database, Shield, ShieldAlert, ShieldCheck, ShieldX, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { type Agent } from '@/hooks/use-agents';
import { type SparklineMap } from '@/hooks/use-agent-sparklines';
import { cn } from '@/lib/utils/index';

function getTrustColor(score: number) {
  // Neo-Precisión: Strictly warm/cool emerald and industrial warnings. No standard sky-blue.
  if (score >= 80) return { text: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10', line: '#4ADE80' };
  if (score >= 60) return { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', line: '#10B981' };
  if (score >= 40) return { text: 'text-[#FCD34D]', bg: 'bg-[#FCD34D]/10', line: '#FCD34D' };
  return { text: 'text-[#FB7185]', bg: 'bg-[#FB7185]/10', line: '#FB7185' };
}

function getStatusConfig(status: string) {
  const map: Record<string, { icon: typeof ShieldCheck; text: string; bg: string }> = {
    VERIFIED:  { icon: ShieldCheck, text: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10' },
    PENDING:   { icon: Clock,       text: 'text-[#FCD34D]', bg: 'bg-[#FCD34D]/10' },
    FLAGGED:   { icon: ShieldAlert, text: 'text-[#FB7185]', bg: 'bg-[#FB7185]/10' },
    SUSPENDED: { icon: ShieldX,     text: 'text-[#FB7185]', bg: 'bg-[#FB7185]/5' },
  };
  return map[status] ?? { icon: Shield, text: 'text-[#64748B]', bg: 'bg-[#64748B]/5' };
}

function mockSparkData(address: string, score: number) {
  const seed = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Array.from({ length: 12 }, (_, i) => {
    const v = ((seed * (i + 1) * 7919) % 31) - 15;
    return { v: Math.max(0, Math.min(100, score + v)) };
  });
}

function monogram(name: string) {
  return name.slice(0, 2).toUpperCase();
}

interface AgentCardProps {
  agent: Agent;
  sparklines?: SparklineMap;
}

export function AgentCard({ agent, sparklines = {} }: AgentCardProps) {
  const colors = getTrustColor(agent.trust_score);
  const status = getStatusConfig(agent.status);
  const StatusIcon = status.icon;
  const realData = sparklines[agent.address];
  const sparkData = (realData && realData.length >= 2) ? realData : mockSparkData(agent.address, agent.trust_score);

  return (
    <Link
      href={`/agents/${agent.address}`}
      className={cn(
        'group flex flex-col gap-4 p-5 transition-all duration-300',
        'border border-[#4ADE80]/10 bg-[#0F1219] rounded-none relative overflow-hidden',
        'hover:border-[#4ADE80]/40 hover:bg-[#4ADE80]/[0.02]',
        'shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
      )}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#4ADE80]/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#4ADE80]/30" />

      {/* Top row: avatar + score */}
      <div className="flex items-start justify-between">
        <div className="relative h-12 w-12 flex-shrink-0">
          <div
            className={cn(
              'h-full w-full flex items-center justify-center rounded-none font-mono text-sm font-black border border-[#4ADE80]/20',
              'bg-[#05070A]'
            )}
            style={{ color: colors.line }}
          >
            {monogram(agent.name)}
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#05070A] border border-[#4ADE80]/30 flex items-center justify-center">
             <TrendingUp className="h-2 w-2 text-[#4ADE80]/60" />
          </div>
        </div>

        <div className={cn('flex flex-col items-end gap-0.5')}>
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#475569] mb-1">TR_INDEX</span>
           <div className={cn('flex items-center gap-1.5 px-3 py-1 bg-[#4ADE80]/5 border border-[#4ADE80]/10')}>
              <span className={cn('font-mono text-[16px] font-black leading-none', colors.text)}>
                {agent.trust_score}.0
              </span>
           </div>
        </div>
      </div>

      {/* Name + address */}
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-black text-flare-text-h uppercase tracking-tight group-hover:text-[#4ADE80] transition-colors">
            {agent.name}
          </p>
          {agent.metadata && (
            <Database className="h-3 w-3 shrink-0 text-[#4ADE80]/40" />
          )}
        </div>
        <p className="font-mono text-[9px] text-[#475569] uppercase tracking-widest opacity-60">
          ID_{agent.address.slice(0, 12)}
        </p>
      </div>

      {/* High-Contrast Industrial Area Chart (Replaces "just a line") */}
      <div className="h-14 w-full relative pt-2">
        <div className="absolute top-0 left-0 text-[8px] font-black text-[#4ADE80]/20 tracking-tighter">DATA_STRM</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id={`grad-${agent.address}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.line} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={colors.line} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 100]} />
            <Area
              type="stepAfter"
              dataKey="v"
              stroke={colors.line}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${agent.address})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom: status + type */}
      <div className="flex items-center justify-between mt-1 pt-3 border-t border-[#4ADE80]/5">
        <div className={cn('flex items-center gap-2 px-2 py-1 text-[9px] font-black uppercase tracking-widest', status.text)}>
          <StatusIcon className="h-3 w-3" />
          {agent.status}
        </div>
        <span className="text-[9px] font-mono text-[#475569] uppercase tracking-widest">{agent.type}</span>
      </div>
    </Link>
  );
}
