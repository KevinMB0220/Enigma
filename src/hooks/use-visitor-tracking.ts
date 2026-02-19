'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Visitor statistics response
 */
export interface VisitorStats {
  uniqueVisitors: number;
  totalVisits: number;
}

/**
 * Track visitor response
 */
interface TrackVisitorResponse {
  tracked: boolean;
  visitCount: number;
  isNewVisitor: boolean;
}

/**
 * Track a visitor by calling the API
 */
async function trackVisitor(): Promise<TrackVisitorResponse> {
  const response = await fetch('/api/v1/visitors/track', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to track visitor');
  }

  const json = await response.json();
  return json.data;
}

/**
 * Fetch visitor statistics from the API
 */
async function fetchVisitorStats(): Promise<VisitorStats> {
  const response = await fetch('/api/v1/visitors/stats');

  if (!response.ok) {
    throw new Error('Failed to fetch visitor stats');
  }

  const json = await response.json();
  return json.data;
}

/**
 * Hook for tracking visitors and fetching statistics
 *
 * Automatically tracks the current visitor on mount
 */
export function useVisitorTracking() {
  // Mutation to track visitor
  const trackMutation = useMutation({
    mutationFn: trackVisitor,
  });

  // Query to fetch visitor stats
  const statsQuery = useQuery({
    queryKey: ['visitor-stats'],
    queryFn: fetchVisitorStats,
    staleTime: 5 * 60 * 1000, // 5 minutes — visitor counts don't need frequent updates
  });

  // Track visitor on mount
  useEffect(() => {
    trackMutation.mutate();
  }, []);

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
  };
}

/**
 * Hook for fetching visitor statistics only (without tracking)
 */
export function useVisitorStats() {
  return useQuery({
    queryKey: ['visitor-stats'],
    queryFn: fetchVisitorStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
