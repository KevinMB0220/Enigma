# Code Standards

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## TypeScript Rules

### 1. Always use strict TypeScript

```typescript
// ✅ Correct
function getAgentScore(address: string): number {
  return 85;
}

// ❌ Incorrect (implicit any)
function getAgentScore(address) {
  return 85;
}
```

### 2. Explicit types for component props

```typescript
// ✅ Correct
interface AgentCardProps {
  address: string;
  name: string;
  trustScore: number;
}

export function AgentCard({ address, name, trustScore }: AgentCardProps) {
  // ...
}

// ❌ Incorrect (implicit inference)
export function AgentCard({ address, name, trustScore }) {
  // ...
}
```

### 3. Use `type` for unions/primitives, `interface` for objects

```typescript
// ✅ Correct
type AgentStatus = 'pending' | 'verified' | 'flagged';

interface Agent {
  address: string;
  name: string;
  status: AgentStatus;
}
```

### 4. Use const objects instead of enums

```typescript
// ✅ Correct
export const AGENT_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  FLAGGED: 'flagged'
} as const;

export type AgentStatus = typeof AGENT_STATUS[keyof typeof AGENT_STATUS];

// ❌ Avoid (enums generate extra code)
enum AgentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FLAGGED = 'flagged'
}
```

### 5. Optional chaining and nullish coalescing

```typescript
// ✅ Correct
const score = agent?.trustScore ?? 0;

// ❌ Avoid (verbose)
const score = agent && agent.trustScore !== undefined ? agent.trustScore : 0;
```

## React Components

### Standard Component Structure

```typescript
import { type FC } from 'react';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  address: string;
  name: string;
  trustScore: number;
  className?: string;
}

export const AgentCard: FC<AgentCardProps> = ({
  address,
  name,
  trustScore,
  className
}) => {
  // Hooks first
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: details } = useAgentDetails(address);

  // Event handlers
  const handleExpand = () => setIsExpanded(!isExpanded);

  // Early returns
  if (!details) return <AgentCardSkeleton />;

  // Render
  return (
    <Card className={cn('p-4', className)}>
      <h3>{name}</h3>
      <p>Score: {trustScore}</p>
      <Button onClick={handleExpand}>Expand</Button>
    </Card>
  );
};
```

### Component Rules

1. **Use arrow functions for components**
2. **Props interface declared above the component**
3. **Hooks at the top of component (never conditional)**
4. **Event handlers with `handle` prefix**
5. **Early returns for loading/error states**
6. **className as last prop, optional**
7. **Use `cn()` helper from shadcn for class merging**

### Server vs Client Components (Next.js 14)

```typescript
// ✅ Server Component (default in App Router)
// src/app/scanner/page.tsx
export default async function ScannerPage() {
  const agents = await fetchAgents(); // Direct fetch on server
  return <AgentTable agents={agents} />;
}

// ✅ Client Component (with 'use client')
// src/components/scanner/search-bar.tsx
'use client';

import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  // ... interactive state
}
```

**Rules**:
- **Server Components** (default): For data fetching, layout, static components
- **Client Components** (`'use client'`): For interactivity (useState, event handlers, Context)
- **Minimize Client Components**: Move them as low as possible in the tree

## TailwindCSS

### Class Order

1. Layout (flex, grid, block)
2. Sizing (w-, h-)
3. Spacing (m-, p-)
4. Typography (text-, font-)
5. Visual (bg-, border-, shadow-)
6. Interactive (hover:, focus:)

### Conditional Classes

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-lg border p-4',
  isActive && 'bg-primary',
  className
)}>
```

## Validation (Zod)

```typescript
// lib/utils/validation.ts
import { z } from 'zod';

export const registerAgentSchema = z.object({
  address: z.string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  name: z.string().min(3).max(50),
  category: z.enum(['trading', 'defi', 'nft', 'oracle', 'other']),
  description: z.string().max(280).optional()
});

export type RegisterAgentInput = z.infer<typeof registerAgentSchema>;
```
