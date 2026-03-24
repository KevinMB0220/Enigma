'use client';

import { Activity, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { type Agent } from '@/hooks/use-agents';
import { Spinner } from '@/components/shared/spinner';
import { IndustrialCorner } from '@/components/shared/industrial-corner';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  agents: Agent[];
  isLoading?: boolean;
}

function statusConfig(status: string) {
  switch (status) {
    case 'VERIFIED':   return { icon: CheckCircle2, color: 'text-flare-accent' };
    case 'FLAGGED':    return { icon: AlertTriangle, color: 'text-[#FB7185]' };
    case 'SUSPENDED':  return { icon: AlertTriangle, color: 'text-[#FB7185]' };
    default:           return { icon: Clock, color: 'text-[#FCD34D]' };
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}M AGO`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}H AGO`;
  return `${Math.floor(hrs / 24)}D AGO`;
}

export function RecentActivity({ agents, isLoading }: RecentActivityProps) {
  const recent = [...agents]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4);

  return (
    <div className="group relative border border-flare-stroke bg-flare-surface p-6 rounded-none shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
      <IndustrialCorner position="tl" size={3} />
      <IndustrialCorner position="tr" size={3} />
      <IndustrialCorner position="bl" size={3} />
      <IndustrialCorner position="br" size={3} />
      
      <div className="mb-6 flex items-center gap-3 border-b border-flare-stroke pb-4">
        <Activity className="h-4 w-4 text-[#22D3EE]" />
        <h3 className="text-[11px] font-black text-flare-text-h uppercase tracking-[0.4em]">Recent Activity</h3>
      </div>

      <div className="space-y-1">
        {isLoading && (
          <div className="flex justify-center py-5"><Spinner size="sm" /></div>
        )}
        {!isLoading && recent.length === 0 && (
          <p className="py-4 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-flare-text-l opacity-40">System_Idle</p>
        )}
        {!isLoading && recent.map((agent) => {
          const config = statusConfig(agent.status);
          const Icon = config.icon;
          return (
            <div
              key={agent.address}
              className="group/item flex items-center gap-4 px-3 py-3 transition-all duration-200 rounded-none border border-transparent hover:bg-white/[0.02] relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#22D3EE] scale-y-0 group-hover/item:scale-y-100 transition-transform origin-top" />
              
              <div className={cn("p-2 bg-flare-bg/60 border border-flare-stroke", config.color)}>
                 <Icon className="h-3.5 w-3.5" />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-black text-flare-text-h uppercase tracking-tight leading-none">{agent.name}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                   <div className={cn("w-1 h-1 rounded-none", config.color.replace('text-', 'bg-'))} />
                   <p className="text-[8px] text-flare-text-l opacity-40 uppercase tracking-[0.2em] font-black">{agent.status}</p>
                </div>
              </div>
              
              <span className="font-mono text-[8px] font-black text-flare-text-l opacity-20 uppercase tracking-widest group-hover/item:opacity-100 transition-opacity">
                {timeAgo(agent.updated_at)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
