import { type Address, getContract } from 'viem';
import { publicClient } from '@/lib/blockchain/client';
import { ERC804_ABI } from '@/lib/blockchain/abis/erc804';
import {
  BlockchainError,
  ContractNotFoundError,
  RPCError,
} from '@/lib/utils/errors';
import { createLogger } from '@/lib/utils/logger';

const logger = createLogger('blockchain-service');

/**
 * Agent metadata from ERC-804 contract
 */
export interface AgentMetadata {
  name: string;
  agentType: string;
  billingAddress: Address;
  owner: Address;
}

/**
 * Read agent metadata from ERC-804 compliant contract
 *
 * @param address - Contract address to read from
 * @returns Agent metadata including name, type, billing address, and owner
 * @throws {ContractNotFoundError} If contract doesn't exist at address
 * @throws {RPCError} If RPC communication fails
 * @throws {BlockchainError} For other blockchain-related errors
 */
export async function readAgentMetadata(
  address: Address
): Promise<AgentMetadata> {
  try {
    logger.info({ address }, 'Reading agent metadata from contract');

    // First verify contract exists
    const hasCode = await verifyContractExists(address);
    if (!hasCode) {
      throw new ContractNotFoundError(address);
    }

    // Create contract instance
    const contract = getContract({
      address,
      abi: ERC804_ABI,
      client: publicClient,
    });

    // Read all metadata in parallel with retry logic
    const [name, agentType, billingAddress, owner] = await retryOperation(
      async () => {
        return Promise.all([
          contract.read.name(),
          contract.read.agentType(),
          contract.read.billingAddress(),
          contract.read.owner(),
        ]);
      },
      {
        maxRetries: 3,
        retryDelay: 1000,
        operation: `readAgentMetadata(${address})`,
      }
    );

    logger.info({ address, name, agentType }, 'Successfully read agent metadata');

    return {
      name,
      agentType,
      billingAddress,
      owner,
    };
  } catch (error) {
    if (error instanceof BlockchainError) {
      throw error;
    }

    logger.error({ address, error }, 'Failed to read agent metadata');
    throw new BlockchainError(
      `Failed to read agent metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get contract bytecode at given address
 *
 * @param address - Contract address
 * @returns Bytecode as hex string, or null if no code exists
 * @throws {RPCError} If RPC communication fails
 */
export async function getContractCode(
  address: Address
): Promise<string | null> {
  try {
    logger.debug({ address }, 'Getting contract code');

    const code = await retryOperation(
      async () => {
        return publicClient.getCode({ address });
      },
      {
        maxRetries: 3,
        retryDelay: 1000,
        operation: `getContractCode(${address})`,
      }
    );

    // getCode returns undefined for EOAs or non-existent addresses
    return code ?? null;
  } catch (error) {
    logger.error({ address, error }, 'Failed to get contract code');
    throw new RPCError('Failed to retrieve contract bytecode');
  }
}

/**
 * Verify if address has contract code (is a contract, not an EOA)
 *
 * @param address - Address to check
 * @returns true if address has code, false otherwise
 * @throws {RPCError} If RPC communication fails
 */
export async function verifyContractExists(address: Address): Promise<boolean> {
  const code = await getContractCode(address);

  // Contract code is either '0x' (no code) or a hex string with code
  // We check if code exists and is not just '0x'
  return code !== null && code !== '0x';
}

/**
 * Retry configuration for transient RPC errors
 */
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  operation: string;
}

/**
 * Execute an operation with retry logic for transient errors
 *
 * @param operation - Async function to execute
 * @param config - Retry configuration
 * @returns Result of the operation
 * @throws {RPCError} If all retries fail
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  const { maxRetries, retryDelay, operation: operationName } = config;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Log retry attempt
      logger.warn(
        {
          operation: operationName,
          attempt,
          maxRetries,
          error: lastError.message,
        },
        'RPC operation failed, retrying...'
      );

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, retryDelay * attempt)
      );
    }
  }

  // All retries failed
  logger.error(
    {
      operation: operationName,
      attempts: maxRetries,
      error: lastError?.message,
    },
    'RPC operation failed after all retries'
  );

  throw new RPCError(
    `Operation ${operationName} failed after ${maxRetries} attempts: ${lastError?.message}`
  );
}
