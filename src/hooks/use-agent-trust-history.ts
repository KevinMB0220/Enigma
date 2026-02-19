'use client';

import { useQuery } from '@tanstack/react-query';

export interface TrustHistoryPoint {
  date: string;
  score: number;
}

async function fetchTrustHistory(address: string): Promise<TrustHistoryPoint[]> {
  const res = await fetch(`/api/v1/agents/${address}/trust-history`);
  const json: { data: TrustHistoryPoint[] | null; error: unknown } = await res.json();
  if (!res.ok || json.error) throw new Error('Failed to fetch trust history');
  return json.data ?? [];
}

export function useAgentTrustHistory(address: string) {
  return useQuery({
    queryKey: ['trust-history', address],
    queryFn: () => fetchTrustHistory(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
  });
}
