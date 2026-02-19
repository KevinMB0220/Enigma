'use client';

import { useQuery } from '@tanstack/react-query';

/**
 * Agent statistics from API
 */
export interface AgentStats {
  total: number;
  verified: number;
  active24h: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
}

/**
 * API response structure
 */
interface StatsResponse {
  data: AgentStats | null;
  error: {
    message: string;
    code: string;
  } | null;
}

/**
 * Fetch agent statistics
 */
async function fetchStats(): Promise<AgentStats> {
  const response = await fetch('/api/v1/agents/stats');
  const result: StatsResponse = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error?.message || 'Failed to fetch stats');
  }

  return result.data || {
    total: 0,
    verified: 0,
    active24h: 0,
    byStatus: {},
    byType: {},
  };
}

/**
 * Hook for fetching agent statistics
 *
 * Features:
 * - Auto-refetch every 60 seconds
 * - 5 minute stale time
 * - Cached across the app
 *
 * @example
 * ```tsx
 * const { data: stats, isLoading } = useAgentStats();
 *
 * return (
 *   <div>
 *     <p>Total: {stats?.total}</p>
 *     <p>Verified: {stats?.verified}</p>
 *   </div>
 * );
 * ```
 */
export function useAgentStats() {
  return useQuery({
    queryKey: ['agent-stats'],
    queryFn: fetchStats,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
