'use client';

import Link from 'next/link';
import { ShieldAlert, ShieldX, ExternalLink } from 'lucide-react';
import { type Agent } from '@/hooks/use-agents';
import { cn } from '@/lib/utils';

interface RiskAlertsProps {
  agents: Agent[];
}

export function RiskAlerts({ agents }: RiskAlertsProps) {
  const risky = agents.filter(
    (a) => a.status === 'FLAGGED' || a.status === 'SUSPENDED',
  );

  return (
    <div className="glass p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#FB7185]" />
          <h3 className="text-sm font-semibold text-white">Risk Monitor</h3>
        </div>
        {risky.length > 0 && (
          <span className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-bold',
            'bg-[rgba(251,113,133,0.12)] text-[#FB7185]',
          )}>
            {risky.length}
          </span>
        )}
      </div>

      {risky.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(74,222,128,0.1)]">
            <ShieldX className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-[#64748B]">No risk alerts</p>
        </div>
      ) : (
        <div className="space-y-1">
          {risky.slice(0, 4).map((agent) => (
            <Link
              key={agent.address}
              href={`/agents/${agent.address}`}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-2 py-2 transition-all',
                'hover:bg-[rgba(251,113,133,0.04)]',
              )}
            >
              <div className={cn(
                'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md',
                agent.status === 'SUSPENDED'
                  ? 'bg-[rgba(251,113,133,0.12)]'
                  : 'bg-[rgba(252,211,77,0.12)]',
              )}>
                <ShieldAlert className={cn(
                  'h-3.5 w-3.5',
                  agent.status === 'SUSPENDED' ? 'text-[#FB7185]' : 'text-[#FCD34D]',
                )} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[#94A3B8] group-hover:text-white transition-colors">
                  {agent.name}
                </p>
                <p className={cn(
                  'text-[10px] font-semibold',
                  agent.status === 'SUSPENDED' ? 'text-[#FB7185]' : 'text-[#FCD34D]',
                )}>
                  {agent.status}
                </p>
              </div>
              <ExternalLink className="h-3 w-3 text-[#334155] group-hover:text-[#64748B] transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
