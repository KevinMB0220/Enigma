'use client';

import { useQuery } from '@tanstack/react-query';

export type SparklineMap = Record<string, { v: number }[]>;

async function fetchSparklines(addresses: string[]): Promise<SparklineMap> {
  if (addresses.length === 0) return {};
  const param = addresses.join(',');
  const res = await fetch(`/api/v1/agents/sparklines?addresses=${param}`);
  const json: { data: SparklineMap | null; error: unknown } = await res.json();
  if (!res.ok || json.error) throw new Error('Failed to fetch sparklines');
  return json.data ?? {};
}

/**
 * Fetches the last 10 trust score snapshots for a batch of agents.
 * Agents that have no snapshot history are omitted from the result map.
 * The caller should fall back to a deterministic mock for missing addresses.
 *
 * @param addresses - list of agent addresses currently visible on screen
 */
export function useAgentSparklines(addresses: string[]) {
  // Sort for a stable query key regardless of list order
  const sorted = [...addresses].sort();
  return useQuery({
    queryKey:  ['sparklines', sorted],
    queryFn:   () => fetchSparklines(sorted),
    enabled:   addresses.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchInterval: false,
  });
}
