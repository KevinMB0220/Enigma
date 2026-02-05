import { z } from 'zod';

/**
 * Zod validation schemas for agent registration
 * @see docs/api/endpoints.md
 * @see docs/standards/typescript-guidelines.md
 */

// ============================================
// REUSABLE SCHEMAS
// ============================================

/**
 * Validates Ethereum address format (0x followed by 40 hex characters)
 */
export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Invalid Ethereum address format. Must be 0x followed by 40 hex characters',
  })
  .transform((val) => val.toLowerCase() as `0x${string}`);

/**
 * Validates agent type enum
 */
export const agentTypeSchema = z.enum(
  ['TRADING', 'LENDING', 'GOVERNANCE', 'ORACLE', 'CUSTOM'],
  {
    errorMap: () => ({
      message: 'Agent type must be one of: TRADING, LENDING, GOVERNANCE, ORACLE, CUSTOM',
    }),
  }
);

// ============================================
// AGENT REGISTRATION SCHEMA
// ============================================

/**
 * Schema for agent registration requests
 * Validates all required fields for registering a new agent
 */
export const registerAgentSchema = z.object({
  address: addressSchema,
  name: z
    .string()
    .min(3, 'Agent name must be at least 3 characters')
    .max(50, 'Agent name must not exceed 50 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  type: agentTypeSchema,
});

// ============================================
// EXPORTED TYPES
// ============================================

/**
 * TypeScript type for agent registration input
 * Inferred from registerAgentSchema
 */
export type RegisterAgentInput = z.infer<typeof registerAgentSchema>;

/**
 * TypeScript type for Ethereum address
 * Inferred from addressSchema
 */
export type Address = z.infer<typeof addressSchema>;

/**
 * TypeScript type for agent type
 * Inferred from agentTypeSchema
 */
export type AgentType = z.infer<typeof agentTypeSchema>;
