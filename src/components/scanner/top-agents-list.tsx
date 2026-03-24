'use client';

import { TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { type Agent } from '@/hooks/use-agents';
import { Spinner } from '@/components/shared/spinner';
import { IndustrialCorner } from '@/components/shared/industrial-corner';
import { cn } from '@/lib/utils';

interface TopAgentsListProps {
  agents: Agent[];
  isLoading?: boolean;
}

function scoreColor(score: number) {
  if (score >= 80) return '#4ADE80';
  if (score >= 60) return '#22D3EE';
  if (score >= 40) return '#FCD34D';
  return '#FB7185';
}

function monogram(name: string) {
  return name.slice(0, 1).toUpperCase();
}

export function TopAgentsList({ agents, isLoading }: TopAgentsListProps) {
  const sorted = [...agents]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 4);

  return (
    <div className="group relative border border-flare-stroke bg-flare-surface p-6 rounded-none shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <IndustrialCorner position="tl" size={3} />
      <IndustrialCorner position="tr" size={3} />
      <IndustrialCorner position="bl" size={3} />
      <IndustrialCorner position="br" size={3} />
      
      <div className="mb-6 flex items-center justify-between border-b border-flare-stroke pb-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-flare-accent" />
          <h3 className="text-[11px] font-black text-flare-text-h uppercase tracking-[0.4em]">Top Agents</h3>
        </div>
        <span className="font-mono text-[9px] text-flare-text-l opacity-20 uppercase tracking-widest font-black">Score_High</span>
      </div>

      <div className="space-y-1">
        {isLoading && (
          <div className="flex justify-center py-5"><Spinner size="sm" /></div>
        )}
        {!isLoading && sorted.length === 0 && (
          <p className="py-4 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-flare-text-l opacity-40">System_Idle</p>
        )}
        {!isLoading && sorted.map((agent, i) => {
          const color = scoreColor(agent.trust_score);
          return (
            <Link
              key={agent.address}
              href={`/agents/${agent.address}`}
              className={cn(
                'group/item flex items-center gap-4 px-3 py-3 transition-all duration-200 rounded-none relative overflow-hidden',
                'hover:bg-white/[0.02] border border-transparent'
              )}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-flare-accent scale-y-0 group-hover/item:scale-y-100 transition-transform origin-top" />
              
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-none border border-flare-stroke bg-flare-bg/60 font-mono text-base font-black text-flare-accent group-hover/item:border-flare-accent/40 transition-all">
                {monogram(agent.name)}
              </div>

              <div className="flex-1 min-w-0">
                <span className="block truncate text-[12px] font-black text-flare-text-h group-hover/item:text-flare-accent transition-colors uppercase tracking-tight">
                  {agent.name}
                </span>
                <span className="block font-mono text-[8px] text-flare-text-l opacity-40 uppercase tracking-widest leading-none mt-1">
                  Trust_{agent.trust_score}.0
                </span>
              </div>

              <div className="h-4 w-4 rounded-none border border-flare-stroke flex items-center justify-center text-[7px] font-black text-flare-text-l group-hover/item:border-flare-accent group-hover/item:text-flare-accent transition-all">
                {i + 1}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
