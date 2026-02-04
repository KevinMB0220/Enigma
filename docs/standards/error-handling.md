# Error Handling

## Error Hierarchy

```typescript
Error
├── AppError (base custom error)
│   ├── ValidationError (400)
│   ├── AuthError (401)
│   ├── NotFoundError (404)
│   ├── RateLimitError (429)
│   └── ServerError (500)
└── BlockchainError
    ├── ContractNotFoundError
    ├── RPCError
    └── TransactionFailedError
```

## Custom Error Classes

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode
      }
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class BlockchainError extends AppError {
  constructor(message: string, public originalError?: unknown) {
    super(message, 500, 'BLOCKCHAIN_ERROR');
  }
}
```

## Error Handling in API Routes

```typescript
// app/api/v1/agents/[address]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NotFoundError, BlockchainError } from '@/lib/errors';
import { logger } from '@/lib/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    // Validate input
    if (!isValidAddress(params.address)) {
      throw new ValidationError('Invalid Ethereum address');
    }

    // Fetch agent
    const agent = await getAgent(params.address);

    if (!agent) {
      throw new NotFoundError('Agent');
    }

    return NextResponse.json(agent);

  } catch (error) {
    // Logging
    logger.error('Failed to fetch agent', {
      address: params.address,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // Handle known errors
    if (error instanceof AppError) {
      return NextResponse.json(
        error.toJSON(),
        { status: error.statusCode }
      );
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: { message: 'Database error', code: 'DB_ERROR' } },
        { status: 500 }
      );
    }

    // Catch-all
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
```

## Frontend Error Boundary

```typescript
// components/shared/error-boundary.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error caught by boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">
        {error.message || 'An unexpected error occurred'}
      </p>
      <Button onClick={reset} className="mt-4">Try again</Button>
    </div>
  );
}
```

## Component Error States

```typescript
export function AgentProfile({ address }: { address: string }) {
  const { data: agent, error, isLoading } = useAgent(address);

  // Loading state
  if (isLoading) {
    return <AgentProfileSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <h3 className="mt-2 font-medium">Failed to load agent</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!agent) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center">
          <SearchX className="h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 font-medium">Agent not found</h3>
          <p className="text-sm text-muted-foreground">
            The agent at address {address} does not exist.
          </p>
        </div>
      </Card>
    );
  }

  // Success state
  return <AgentProfileContent agent={agent} />;
}
```

## Toast Notifications

```typescript
// hooks/use-toast.ts
import { toast } from 'sonner';

export function useErrorToast() {
  return {
    showError: (message: string) => {
      toast.error(message, {
        duration: 5000,
        position: 'top-right'
      });
    },

    showSuccess: (message: string) => {
      toast.success(message, {
        duration: 3000,
        position: 'top-right'
      });
    }
  };
}
```

## Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request body/params validation error |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `BLOCKCHAIN_ERROR` | 500 | Error interacting with blockchain |
