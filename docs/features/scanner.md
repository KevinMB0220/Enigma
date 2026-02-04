# Scanner / Directory

## Overview

The Scanner is the main discovery interface for browsing all registered agents on the platform. It provides a table view with filtering, sorting, and search capabilities.

## Features

### Agent Table

- **Columns**: Rank, Name, Type, Trust Score, Volume 24h, Status, Last Heartbeat
- **Sorting**: By trust score (default), volume, name
- **Pagination**: 20 agents per page (configurable)

### Filters

| Filter | Options | Default |
|--------|---------|---------|
| Type | TRADING, DEFI, NFT, ORACLE, OTHER, All | All |
| Status | VERIFIED, PENDING, FLAGGED, All | VERIFIED |
| Min Trust Score | 0-100 slider | 0 |

### Search

- Search by agent name (fuzzy match)
- Search by contract address (exact match)
- Debounced input (500ms)
- Autocomplete dropdown with top 5 results

## UI Components

### AgentTable

```typescript
interface AgentTableProps {
  agents: Agent[];
  isLoading: boolean;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}
```

### Filters

```typescript
interface FiltersProps {
  filters: {
    type?: AgentType;
    status?: AgentStatus;
    minTrustScore?: number;
  };
  onChange: (filters: Filters) => void;
}
```

### SearchBar

```typescript
interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
  results: Agent[];
  onSelect: (agent: Agent) => void;
}
```

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Logo, Nav, Wallet Connect)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Stats Cards (Total Agents | Verified | Vol 24h)    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐  ┌───────────────────────────────────────┐   │
│  │          │  │  SearchBar                            │   │
│  │ Filters  │  ├───────────────────────────────────────┤   │
│  │          │  │                                       │   │
│  │ • Type   │  │  AgentTable                           │   │
│  │ • Status │  │  ┌─────┬──────┬──────┬───────┬─────┐ │   │
│  │ • Score  │  │  │Rank │ Name │ Type │ Score │ Vol │ │   │
│  │          │  │  ├─────┼──────┼──────┼───────┼─────┤ │   │
│  │          │  │  │  1  │ Bot1 │TRADE │  92   │ 500 │ │   │
│  │          │  │  │  2  │ Bot2 │ DEFI │  88   │ 320 │ │   │
│  │          │  │  │  3  │ Bot3 │ NFT  │  85   │ 180 │ │   │
│  │          │  │  └─────┴──────┴──────┴───────┴─────┘ │   │
│  └──────────┘  │                                       │   │
│                │  Pagination                           │   │
│                └───────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. User loads /scanner
   ↓
2. Page fetches initial agents (GET /api/v1/agents?status=VERIFIED&limit=20)
   ↓
3. User applies filter (e.g., type=TRADING)
   ↓
4. useAgents hook refetches with new params
   ↓
5. Table re-renders with filtered results
   ↓
6. User clicks agent row
   ↓
7. Navigate to /agent/[address]
```

## States

### Loading State
- Table skeleton with 10 placeholder rows
- Filters disabled during load

### Empty State
- Illustration
- "No agents found" message
- CTA to adjust filters or register an agent

### Error State
- Error icon
- Error message
- Retry button
