# Database Schema (Supabase + Prisma)

## Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AGENTS
// ============================================

model Agent {
  address              String    @id // Contract address (0x...)
  name                 String
  type                 AgentType
  description          String?
  owner_address        String    // Wallet that registered
  billing_address      String?   // ERC-804 billing address
  source_url           String?   // GitHub, etc.

  // Status
  status               AgentStatus @default(PENDING)
  trust_score          Int         @default(0) // 0-100

  // Verification
  proxy_detected       Boolean     @default(false)
  proxy_type           ProxyType?
  implementation_address String?
  oz_score             Int         @default(0) // 0-100

  // Timestamps
  registered_at        DateTime    @default(now())
  last_verified_at     DateTime?
  updated_at           DateTime    @updatedAt

  // Relations
  volumes              TransactionVolume[]
  heartbeats           HeartbeatLog[]
  ratings              UserRating[]
  reports              Report[]

  @@map("agents")
  @@index([type])
  @@index([status])
  @@index([trust_score(sort: Desc)])
}

enum AgentType {
  TRADING
  DEFI
  NFT
  ORACLE
  SOCIAL
  GAMING
  UTILITY
  OTHER
}

enum AgentStatus {
  DISCOVERED  // Auto-discovered, not claimed
  PENDING     // Registered, awaiting verification
  VERIFIED    // Verified by Centinela
  FLAGGED     // Has reports
  SUSPENDED   // Manually suspended
}

enum ProxyType {
  EIP_1967
  TRANSPARENT
  UUPS
  BEACON
  DIAMOND
}

// ============================================
// TRANSACTION VOLUME (Metrics)
// ============================================

model TransactionVolume {
  id               String   @id @default(cuid())
  agent_address    String

  period           Period
  tx_count         Int      @default(0)
  volume_avax      Float    @default(0)
  volume_usd       Float    @default(0)

  updated_at       DateTime @updatedAt

  agent            Agent    @relation(fields: [agent_address], references: [address], onDelete: Cascade)

  @@map("transaction_volumes")
  @@unique([agent_address, period])
  @@index([agent_address])
}

enum Period {
  HOUR_24
  DAYS_7
  DAYS_30
  ALL_TIME
}

// ============================================
// HEARTBEAT LOGS
// ============================================

model HeartbeatLog {
  id                String          @id @default(cuid())
  agent_address     String

  timestamp         DateTime        @default(now())
  challenge_type    ChallengeType
  response_time_ms  Int?
  result            HeartbeatResult
  details           Json?           // Additional metadata

  agent             Agent           @relation(fields: [agent_address], references: [address], onDelete: Cascade)

  @@map("heartbeat_logs")
  @@index([agent_address, timestamp(sort: Desc)])
}

enum ChallengeType {
  PING
  ECHO
}

enum HeartbeatResult {
  PASS
  FAIL
  TIMEOUT
}

// ============================================
// USER RATINGS
// ============================================

model UserRating {
  id                String   @id @default(cuid())
  agent_address     String
  user_address      String   // User's wallet

  score             Int      // 1-5 stars
  comment           String?  @db.VarChar(280)

  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt

  agent             Agent    @relation(fields: [agent_address], references: [address], onDelete: Cascade)

  @@map("user_ratings")
  @@unique([agent_address, user_address]) // 1 rating per user per agent
  @@index([agent_address])
}

// ============================================
// REPORTS
// ============================================

model Report {
  id                String       @id @default(cuid())
  agent_address     String
  reporter_address  String       // Reporter's wallet

  reason            ReportReason
  description       String?
  status            ReportStatus @default(OPEN)

  created_at        DateTime     @default(now())
  resolved_at       DateTime?

  agent             Agent        @relation(fields: [agent_address], references: [address], onDelete: Cascade)

  @@map("reports")
  @@index([agent_address, status])
}

enum ReportReason {
  PROXY_HIDDEN
  INCONSISTENT_BEHAVIOR
  SCAM
  OTHER
}

enum ReportStatus {
  OPEN
  REVIEWING
  RESOLVED
  DISMISSED
}
```

## Migrations

```bash
# Create new migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Reset DB (development)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

## Common Queries

```typescript
// services/agent-service.ts
import { prisma } from '@/lib/prisma';

// List agents with filters
export async function getAgents({
  type,
  status = 'VERIFIED',
  minTrustScore = 0,
  page = 1,
  limit = 20
}: GetAgentsParams) {
  const skip = (page - 1) * limit;

  const agents = await prisma.agent.findMany({
    where: {
      type,
      status,
      trust_score: { gte: minTrustScore }
    },
    include: {
      volumes: {
        where: { period: 'HOUR_24' }
      },
      ratings: true
    },
    orderBy: {
      trust_score: 'desc'
    },
    skip,
    take: limit
  });

  const total = await prisma.agent.count({
    where: { type, status, trust_score: { gte: minTrustScore } }
  });

  return { agents, total, page, totalPages: Math.ceil(total / limit) };
}

// Create agent
export async function createAgent(data: CreateAgentInput) {
  return prisma.agent.create({
    data: {
      address: data.address,
      name: data.name,
      type: data.type,
      description: data.description,
      owner_address: data.ownerAddress,
      status: 'PENDING'
    }
  });
}

// Update trust score
export async function updateTrustScore(address: string, score: number) {
  return prisma.agent.update({
    where: { address },
    data: {
      trust_score: score,
      last_verified_at: new Date()
    }
  });
}
```

## Realtime (Supabase)

```typescript
// hooks/use-agent-realtime.ts
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export function useAgentRealtime(address: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`agent:${address}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agents',
          filter: `address=eq.${address}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['agent', address] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [address, queryClient]);
}
```
