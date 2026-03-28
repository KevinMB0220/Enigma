import { verifyMessage } from 'viem';
import { UnauthorizedError } from './errors';
import { createLogger } from './logger';

const logger = createLogger('auth');

const DEFAULT_MESSAGE = 'Sign this message to verify your wallet ownership on FLARE';

/**
 * Verify a wallet signature and return the recovered address
 *
 * @param address - The claimed wallet address
 * @param signature - The signature to verify
 * @param message - Optional custom message (defaults to standard FLARE message)
 * @returns The verified wallet address (lowercase)
 * @throws {UnauthorizedError} If signature verification fails
 */
export async function verifyWalletSignature(
  address: string,
  signature: string,
  message: string = DEFAULT_MESSAGE
): Promise<string> {
  try {
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      throw new UnauthorizedError('Invalid wallet signature');
    }

    logger.debug({ address }, 'Wallet signature verified');
    return address.toLowerCase();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    logger.error({ address, error }, 'Signature verification failed');
    throw new UnauthorizedError('Invalid wallet signature');
  }
}
