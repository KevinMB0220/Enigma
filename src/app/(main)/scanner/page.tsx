'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, Shield, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgents, type AgentFilters } from '@/hooks/use-agents';
import { AgentTable } from '@/components/scanner/agent-table';
import { AgentTableSkeleton } from '@/components/scanner/agent-table-skeleton';
import { EmptyState } from '@/components/scanner/empty-state';
import { ErrorState } from '@/components/scanner/error-state';
import { Filters, type FilterValues } from '@/components/scanner/filters';
import { SearchBar } from '@/components/scanner/search-bar';
import { cn } from '@/lib/utils/index';

/**
 * Stats card component
 */
function StatCard({
  icon: Icon,
  label,
  value,
  className,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg',
        'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]',
        'interactive-card animate-fade-in-up',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-[rgba(255,255,255,0.6)]">{label}</p>
        <p className="text-xl font-bold text-white number-animate">{value}</p>
      </div>
    </div>
  );
}

/**
 * Pagination component
 */
function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-[rgba(255,255,255,0.6)] px-4">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
}

/**
 * Scanner Page - Main agent directory
 * Combines filters, search, and agent table for discovering agents
 */
export default function ScannerPage() {
  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    type: undefined,
    status: undefined,
    minTrustScore: 0,
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Build query filters
  const queryFilters: AgentFilters = {
    ...(filters.type && { type: filters.type as AgentFilters['type'] }),
    ...(filters.status && { status: filters.status as AgentFilters['status'] }),
    ...(filters.minTrustScore > 0 && { minTrustScore: filters.minTrustScore }),
    ...(search && { search }),
    page,
    limit: 20,
  };

  // Fetch agents
  const { data, isLoading, isError, error, refetch } = useAgents(queryFilters);

  const agents = data?.agents || [];
  const pagination = data?.pagination;

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  }, []);

  // Handle filter reset
  const handleResetFilters = useCallback(() => {
    setFilters({
      type: undefined,
      status: undefined,
      minTrustScore: 0,
    });
    setSearch('');
    setPage(1);
  }, []);

  // Determine empty state variant
  const getEmptyStateVariant = () => {
    if (search) return 'no-results';
    if (filters.type || filters.status || filters.minTrustScore > 0) return 'filtered';
    return 'no-agents';
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Agent Scanner</h1>
            <p className="text-[rgba(255,255,255,0.6)]">
              Discover and verify autonomous agents on Avalanche
            </p>
          </div>
          <Button asChild className="btn-press hover-lift">
            <Link href="/register">
              <Plus className="mr-2 h-4 w-4" />
              Register Agent
            </Link>
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={Shield}
            label="Total Agents"
            value={pagination?.total || 0}
            delay={100}
          />
          <StatCard
            icon={TrendingUp}
            label="Verified"
            value={agents.filter((a) => a.status === 'VERIFIED').length}
            delay={200}
          />
          <StatCard
            icon={Activity}
            label="Active (24h)"
            value={agents.length}
            delay={300}
          />
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            className="max-w-md"
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0 animate-slide-in-left" style={{ animationDelay: '200ms' }}>
            <Filters values={filters} onChange={handleFilterChange} />
          </aside>

          {/* Agent Table */}
          <div className="flex-1 min-w-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            {isLoading ? (
              <AgentTableSkeleton rows={10} />
            ) : isError ? (
              <ErrorState
                message={error?.message}
                onRetry={() => refetch()}
              />
            ) : agents.length === 0 ? (
              <EmptyState
                variant={getEmptyStateVariant()}
                onResetFilters={handleResetFilters}
              />
            ) : (
              <>
                <AgentTable agents={agents} />
                {pagination && (
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
