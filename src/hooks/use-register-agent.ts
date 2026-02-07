'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type RegisterAgentInput } from '@/lib/utils/validation';

/**
 * API response structure for agent registration
 */
interface RegisterAgentResponse {
  data: {
    agent: {
      address: string;
      name: string;
      type: string;
      description: string | null;
      status: string;
      trust_score: number;
      owner_address: string;
      billing_address: string | null;
      created_at: string;
    };
    message: string;
  } | null;
  error: {
    message: string;
    code: string;
    fields?: Record<string, string>;
  } | null;
}

/**
 * Register agent API call
 */
async function registerAgentApi(data: RegisterAgentInput): Promise<RegisterAgentResponse['data']> {
  const response = await fetch('/api/v1/agents/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: RegisterAgentResponse = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error?.message || 'Failed to register agent');
  }

  return result.data;
}

/**
 * Hook for registering a new agent
 *
 * Uses TanStack Query mutation for:
 * - Loading state management
 * - Error handling
 * - Cache invalidation on success
 *
 * @example
 * ```tsx
 * const { mutate, isPending, isError, error } = useRegisterAgent();
 *
 * const handleSubmit = (data: RegisterAgentInput) => {
 *   mutate(data, {
 *     onSuccess: (result) => {
 *       router.push(`/agents/${result.agent.address}`);
 *     },
 *   });
 * };
 * ```
 */
export function useRegisterAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerAgentApi,
    onSuccess: () => {
      // Invalidate agents list to refetch with new agent
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}

/**
 * Type for the mutation result
 */
export type RegisterAgentMutation = ReturnType<typeof useRegisterAgent>;
