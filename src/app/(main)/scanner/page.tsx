'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, ShieldCheck, Activity, Star, ChevronLeft, ChevronRight, SlidersHorizontal, Layers, BookOpen } from 'lucide-react';
import { type AgentStatus } from '@prisma/client';
import { useAgents } from '@/hooks/use-agents';
import { useAgentStats } from '@/hooks/use-agent-stats';
import { KpiCard } from '@/components/scanner/kpi-card';
import { ActivityChart } from '@/components/scanner/activity-chart';
import { TopAgentsList } from '@/components/scanner/top-agents-list';
import { RecentActivity } from '@/components/scanner/recent-activity';
import { AgentTable } from '@/components/scanner/agent-table';
import { Filters, type FilterValues } from '@/components/scanner/filters';
import { EmptyState } from '@/components/scanner/empty-state';
import { ErrorState } from '@/components/scanner/error-state';
import { AgentTableSkeleton } from '@/components/scanner/agent-table-skeleton';
import { SearchBar } from '@/components/scanner/search-bar';
import { IndustrialCorner } from '@/components/shared/industrial-corner';
import { cn } from '@/lib/utils';

const DEFAULT_FILTERS: FilterValues = { service: undefined, status: undefined, trustScoreRange: [0, 100] };

function TablePagination({ page, meta, onPage }: {
  page: number;
  meta?: { page: number; totalPages: number; total: number };
  onPage: (p: number) => void;
}) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-flare-stroke px-6 py-4 bg-flare-bg/40 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-flare-text-l opacity-40">
          INDEX_PROTOCOL_{meta.total}
        </span>
      </div>
      <div className="flex items-center gap-6">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className={cn(
            'flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] transition-all rounded-none',
            'border border-flare-stroke bg-flare-surface/40 hover:border-flare-accent/40 hover:text-flare-accent',
            'disabled:cursor-not-allowed disabled:opacity-20'
          )}
        >
          <ChevronLeft className="h-3 w-3" />
          PREV_SYNC
        </button>
        <span className="font-mono text-[10px] font-black text-flare-text-h tracking-widest mt-0.5">
          {page.toString().padStart(2, '0')} // {meta.totalPages.toString().padStart(2, '0')}
        </span>
        <button
          disabled={page >= meta.totalPages}
          onClick={() => onPage(page + 1)}
          className={cn(
            'flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] transition-all rounded-none',
            'border border-flare-stroke bg-flare-surface/40 hover:border-flare-accent/40 hover:text-flare-accent',
            'disabled:cursor-not-allowed disabled:opacity-20'
          )}
        >
          NEXT_SYNC
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export default function ScannerPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Synchronize state with URL search param if it changes (e.g. from Navbar)
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
      setPage(1);
    }
  }, [searchParams, search]);

  const { data, isLoading, isError, refetch } = useAgents({
    ...(search && { search }),
    ...(filters.service && { service: filters.service }),
    ...(filters.status && { status: filters.status as AgentStatus }),
    ...(filters.trustScoreRange[0] > 0 && { minTrustScore: filters.trustScoreRange[0] }),
    ...(filters.trustScoreRange[1] < 100 && { maxTrustScore: filters.trustScoreRange[1] }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
    page,
    limit: 12, // Reduced to reduce height and fit better
  });
  const { data: stats } = useAgentStats();

  const agents = data?.agents ?? [];
  const meta = data?.pagination;

  const verifiedPct = stats && stats.total > 0
    ? Math.round((stats.verified / stats.total) * 100)
    : 0;

  const avgTrustScore = agents.length > 0
    ? Math.round(agents.reduce((s, a) => s + a.trust_score, 0) / agents.length)
    : 0;

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-8 p-6 sm:p-8 bg-flare-bg min-h-full">

      {/* KPI Cards: More contrast and industrial */}
      <div data-tour="scanner-kpi" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Indexed Agents" value={stats?.total ?? 0} trend="up" icon={Bot} accentColor="#4ADE80" />
        <KpiCard label="Trust Ratio" value={`${verifiedPct}%`} trend={verifiedPct > 50 ? 'up' : 'flat'} icon={ShieldCheck} accentColor="#22D3EE" />
        <KpiCard label="Active Sync" value={stats?.active24h ?? 0} trend="up" icon={Activity} accentColor="#FCD34D" />
        <KpiCard label="Network Health" value={`${avgTrustScore}.0`} trend={avgTrustScore > 60 ? 'up' : 'flat'} icon={Star} accentColor="#4ADE80" />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">

        {/* Left Section: Velocity & Table */}
        <div className="flex flex-col gap-8 min-w-0">
          <ActivityChart />

          <div data-tour="scanner-table" className="group relative border border-flare-stroke bg-flare-surface rounded-none overflow-hidden transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <IndustrialCorner position="tl" />
            <IndustrialCorner position="tr" />
            <IndustrialCorner position="bl" />
            <IndustrialCorner position="br" />
            
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-flare-stroke px-6 py-4 bg-flare-bg/40 gap-6">
              <div className="flex flex-col gap-1 shrink-0">
                <h2 className="text-[14px] font-bold text-flare-text-h tracking-wide">Agent Registry</h2>
                <span className="text-[12px] text-flare-text-l font-mono opacity-80">
                  {stats?.total ?? 0} agents on-chain
                </span>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <a href="/docs" className="hidden sm:flex items-center gap-2 px-4 py-2 text-[12px] font-bold transition-all rounded-md border border-flare-stroke bg-[#1a1b23] hover:border-flare-accent/40 text-[#A0A5B5] hover:text-flare-text-h">
                  <BookOpen className="h-4 w-4 text-[#A0A5B5]" />
                  How to Register
                </a>
                <div className="w-full md:w-[280px]" data-tour="scanner-search">
                  <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} className="bg-[#1a1b23] h-10 border-flare-stroke" />
                </div>
              </div>
            </div>

            <div className="w-full overflow-hidden">
              {isLoading ? (
                <AgentTableSkeleton rows={10} />
              ) : isError ? (
                <ErrorState onRetry={() => refetch()} />
              ) : agents.length === 0 ? (
                <EmptyState variant={!!search || !!filters.service ? 'no-results' : 'no-agents'} onResetFilters={handleReset} />
              ) : (
                <AgentTable agents={agents} />
              )}
            </div>

            <TablePagination page={page} meta={meta} onPage={setPage} />
          </div>
        </div>

        {/* Right Section: Sidebar Activity & Parameters */}
        <div className="flex flex-col gap-8">
          <TopAgentsList agents={agents} isLoading={isLoading} />
          <RecentActivity agents={agents} isLoading={isLoading} />

          <div data-tour="scanner-filters" className="group relative border border-flare-stroke bg-flare-surface p-8 rounded-none shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <IndustrialCorner position="tl" />
            <IndustrialCorner position="tr" />
            <IndustrialCorner position="bl" />
            <IndustrialCorner position="br" />
            
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-flare-stroke text-flare-text-h uppercase font-black text-[12px] tracking-[0.4em]">
              <SlidersHorizontal size={14} className="text-flare-accent" />
              Parameters
            </div>
            <Filters values={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </div>
        </div>

      </div>

    </div>
  );
}
