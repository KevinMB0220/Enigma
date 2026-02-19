'use client';

import { useQuery } from '@tanstack/react-query';

export interface ActivityPoint {
  date: string;          // "YYYY-MM-DD"
  registrations: number;
  verifications: number;
}

async function fetchActivity(days: number): Promise<ActivityPoint[]> {
  const res = await fetch(`/api/v1/agents/activity?days=${days}`);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Failed to fetch activity');
  return json.data ?? [];
}

export function useAgentActivity(days: number = 30) {
  return useQuery({
    queryKey: ['agent-activity', days],
    queryFn: () => fetchActivity(days),
    staleTime: 5 * 60 * 1000,
  });
}
