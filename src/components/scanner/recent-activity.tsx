'use client';

import { Activity, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { type Agent } from '@/hooks/use-agents';
import { Spinner } from '@/components/shared/spinner';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  agents: Agent[];
  isLoading?: boolean;
}

function statusIcon(status: string) {
  switch (status) {
    case 'VERIFIED':   return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
    case 'FLAGGED':    return <AlertTriangle className="h-3.5 w-3.5 text-[#FB7185]" />;
    case 'SUSPENDED':  return <AlertTriangle className="h-3.5 w-3.5 text-[#FB7185]" />;
    default:           return <Clock className="h-3.5 w-3.5 text-[#FCD34D]" />;
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function RecentActivity({ agents, isLoading }: RecentActivityProps) {
  const recent = [...agents]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="glass p-4">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-[#22D3EE]" />
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-1">
        {isLoading && (
          <div className="flex justify-center py-5"><Spinner size="sm" /></div>
        )}
        {!isLoading && recent.length === 0 && (
          <p className="py-4 text-center text-xs text-[#475569]">No recent activity</p>
        )}
        {!isLoading && recent.map((agent) => (
          <div
            key={agent.address}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[rgba(255,255,255,0.03)] transition-all"
          >
            {statusIcon(agent.status)}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-[#94A3B8]">{agent.name}</p>
              <p className="text-[10px] text-[#475569] capitalize">{agent.status.toLowerCase()}</p>
            </div>
            <span className="font-data shrink-0 text-[10px] text-[#475569]">
              {timeAgo(agent.updated_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
