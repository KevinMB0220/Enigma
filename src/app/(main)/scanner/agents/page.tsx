'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, SlidersHorizontal, X, LayoutList, LayoutGrid, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAgents } from '@/hooks/use-agents';
import { useAgentSparklines } from '@/hooks/use-agent-sparklines';
import { AgentTable } from '@/components/scanner/agent-table';
import { AgentCard } from '@/components/scanner/agent-card';
import { Filters, type FilterValues } from '@/components/scanner/filters';
import { SearchBar } from '@/components/scanner/search-bar';
import { EmptyState } from '@/components/scanner/empty-state';
import { ErrorState } from '@/components/scanner/error-state';
import { AgentTableSkeleton } from '@/components/scanner/agent-table-skeleton';
import { Spinner } from '@/components/shared/spinner';
import { IndustrialCorner } from '@/components/shared/industrial-corner';
import { cn } from '@/lib/utils';
import { type AgentStatus } from '@prisma/client';

const DEFAULT_FILTERS: FilterValues = { service: undefined, status: undefined, trustScoreRange: [0, 100] };

type ViewMode = 'list' | 'grid';

function Pagination({ page, meta, onPage }: {
  page: number;
  meta?: { page: number; totalPages: number; total: number };
  onPage: (p: number) => void;
}) {
  if (!meta || meta.totalPages <= 1) return null;

  const btnCls = cn(
    'flex h-9 items-center justify-center rounded-none px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all',
    'border border-[#4ADE80]/10 bg-[#4ADE80]/5',
    'text-[#4ADE80]/60 hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] hover:border-[#4ADE80]/30',
    'disabled:cursor-not-allowed disabled:opacity-20',
  );

  return (
    <div className="flex items-center justify-between border-t border-[#4ADE80]/10 px-6 py-4 bg-[#05070A]/40">
      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#4ADE80]/30">
        {`PAGE::${page.toString().padStart(2, '0')} // TOTAL::${meta.total}`}
      </span>
      <div className="flex items-center gap-2">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} className={btnCls}>
          <ChevronLeft className="h-4 w-4 mr-2" /> PREV
        </button>
        <button disabled={page >= meta.totalPages} onClick={() => onPage(page + 1)} className={btnCls}>
          NEXT <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
      setPage(1);
    }
  }, [searchParams, search]);

  const isFiltered = !!filters.service || !!filters.status || filters.trustScoreRange[0] > 0 || filters.trustScoreRange[1] < 100;

  const handlePage = (p: number) => {
    setPage(p);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { data, isLoading, isError, refetch } = useAgents({
    ...(filters.service       && { service: filters.service }),
    ...(filters.status        && { status: filters.status as AgentStatus }),
    ...(filters.trustScoreRange[0] > 0  && { minTrustScore: filters.trustScoreRange[0] }),
    ...(filters.trustScoreRange[1] < 100 && { maxTrustScore: filters.trustScoreRange[1] }),
    ...(search                && { search }),
    ...(filters.sortBy        && { sortBy: filters.sortBy }),
    ...(filters.sortOrder     && { sortOrder: filters.sortOrder }),
    page,
    limit: viewMode === 'grid' ? 24 : 12,
  });

  const agents = data?.agents ?? [];
  const meta   = data?.pagination;

  const agentAddresses = agents.map((a) => a.address);
  const { data: sparklinesData } = useAgentSparklines(agentAddresses);
  const sparklines = sparklinesData ?? {};

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 bg-[#05070A] min-h-full">

      {/* Page header (Industrial) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#4ADE80]/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 flex items-center justify-center bg-[#4ADE80]/10 border border-[#4ADE80]/20">
            <Bot className="h-6 w-6 text-[#4ADE80]" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#4ADE80] animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-flare-text-h uppercase tracking-tighter">AGENT_REGISTRY</h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="h-1 w-1 bg-[#4ADE80] rounded-none" />
               <p className="font-mono text-[10px] text-[#64748B] uppercase tracking-[0.3em]">
                 VERIFIED_NODES: {meta?.total ?? agents.length}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Area */}
      <div className="flex gap-8">

        <div ref={contentRef} className="relative flex min-w-0 flex-1 flex-col border border-[#4ADE80]/10 bg-[#0B0F14]/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <IndustrialCorner position="tl" />
          <IndustrialCorner position="tr" />
          <IndustrialCorner position="bl" />
          <IndustrialCorner position="br" />

          {/* Toolbar */}
          <div className="flex items-center gap-4 border-b border-[#4ADE80]/10 px-6 py-4 bg-[#05070A]/40">
            <div className="flex-1">
              <SearchBar 
                value={search} 
                onChange={(v) => { setSearch(v); setPage(1); }}
                className="bg-[#05070A]/60"
              />
            </div>

            {/* View Mode Toggle (Industrial Squares) */}
            <div className="flex border border-[#4ADE80]/10 bg-[#05070A]/80">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex h-10 w-12 items-center justify-center transition-all duration-300',
                  viewMode === 'list'
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80] shadow-[inset_0_0_15px_rgba(74,222,128,0.1)]'
                    : 'text-[#475569] hover:text-[#4ADE80]/60 hover:bg-[#4ADE80]/5',
                )}
                title="List view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <div className="w-px bg-[#4ADE80]/10 h-6 my-auto" />
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex h-10 w-12 items-center justify-center transition-all duration-300',
                  viewMode === 'grid'
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80] shadow-[inset_0_0_15px_rgba(74,222,128,0.1)]'
                    : 'text-[#475569] hover:text-[#4ADE80]/60 hover:bg-[#4ADE80]/5',
                )}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Toggle (Industrial) */}
            <button
              onClick={() => setShowFilters(f => !f)}
              className={cn(
                'flex h-10 items-center gap-3 px-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all xl:hidden',
                'border',
                showFilters || isFiltered
                  ? 'border-[#4ADE80]/40 bg-[#4ADE80]/10 text-[#4ADE80]'
                  : 'border-[#4ADE80]/10 bg-[#05070A]/80 text-[#94A3B8] hover:text-[#4ADE80]',
              )}
            >
              {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
              PARAMS
              {isFiltered && (
                <span className="flex h-1.5 w-1.5 bg-[#4ADE80] animate-pulse" />
              )}
            </button>
          </div>

          {/* Mobile Filter Panel */}
          {showFilters && (
            <div className="border-b border-[#4ADE80]/10 px-6 py-6 bg-[#0B0F14]/20 xl:hidden">
              <Filters values={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
            </div>
          )}

          {/* Content Wrapper */}
          <div className="min-w-0 p-6">
            {isLoading ? (
               <AgentTableSkeleton rows={10} />
            ) : isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : agents.length === 0 ? (
              <EmptyState
                variant={search || isFiltered ? 'no-results' : 'no-agents'}
                onResetFilters={handleReset}
              />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {agents.map((agent) => (
                  <AgentCard key={agent.address} agent={agent} sparklines={sparklines} />
                ))}
              </div>
            ) : (
              <AgentTable agents={agents} />
            )}
          </div>

          <Pagination page={page} meta={meta} onPage={handlePage} />
        </div>

        {/* Desktop Sidebar (Industrial) */}
        <div className="hidden w-72 flex-shrink-0 xl:block">
          <div className="relative border border-[#4ADE80]/20 bg-[#0B0F14] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
             <IndustrialCorner position="tl" />
             <IndustrialCorner position="tr" />
             <IndustrialCorner position="bl" />
             <IndustrialCorner position="br" />
             
            <p className="mb-8 flex items-center gap-3 border-b border-[#4ADE80]/10 pb-4 text-[11px] font-black uppercase tracking-[0.4em] text-flare-text-h">
              <SlidersHorizontal size={14} className="text-[#4ADE80]" />
              PARAMETERS
            </p>
            <Filters values={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </div>
        </div>
      </div>
    </div>
  );
}
