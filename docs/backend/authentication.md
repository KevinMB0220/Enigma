# Wallet Authentication

## Overview

Enigma uses wallet-based authentication via message signing. Users prove ownership of their wallet by signing a message, which is then verified on the backend.

## Wallet Connection (wagmi)

### Configuration

```typescript
// lib/blockchain/wagmi-config.ts
'use client';

import { createConfig, http } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
    })
  ],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http()
  }
});
```

### Wallet Connect Button

```typescript
// components/shared/wallet-connect-button.tsx
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <Button variant="outline" onClick={() => disconnect()}>
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </Button>
  );
}
```

## Signature Verification

### Client-Side Signing

```typescript
// hooks/use-sign-message.ts
import { useSignMessage } from 'wagmi';

export function useAuthSignature() {
  const { signMessageAsync } = useSignMessage();

  const getSignature = async (message: string) => {
    const signature = await signMessageAsync({ message });
    return signature;
  };

  return { getSignature };
}
```

### Server-Side Verification

```typescript
// lib/utils/auth.ts
import { verifyMessage } from 'viem';

export async function verifyWalletSignature(
  signature: string,
  message: string = 'Sign this message to verify your wallet'
): Promise<string> {
  try {
    const address = await verifyMessage({
      address: signature.address,
      message,
      signature: signature.sig
    });

    return address;
  } catch (error) {
    throw new AuthError('Invalid signature');
  }
}
```

## Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiters = {
  default: new RateLimiterMemory({
    points: 100,    // 100 requests
    duration: 60    // per minute
  }),
  register: new RateLimiterMemory({
    points: 5,      // 5 registrations
    duration: 3600  // per hour
  })
};

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? 'unknown';
  const path = request.nextUrl.pathname;

  const limiter = path.includes('/register')
    ? rateLimiters.register
    : rateLimiters.default;

  try {
    await limiter.consume(ip);
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      {
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED'
        }
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60'
        }
      }
    );
  }
}

export const config = {
  matcher: '/api/:path*'
};
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ENV=testnet  # or 'mainnet'
```
