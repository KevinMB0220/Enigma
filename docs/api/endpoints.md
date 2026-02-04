# API Endpoints

## Response Structure

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
    fields?: Record<string, string>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
```

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/agents` | List agents with filters | No |
| GET | `/api/v1/agents/:address` | Agent detail | No |
| POST | `/api/v1/agents/register` | Register new agent | Yes (Wallet) |
| GET | `/api/v1/agents/:address/trust-score` | Trust score with breakdown | No |
| GET | `/api/v1/agents/:address/heartbeats` | Heartbeat history | No |
| POST | `/api/v1/agents/:address/ratings` | Create/update rating | Yes (Wallet) |
| POST | `/api/v1/agents/:address/reports` | Report agent | Yes (Wallet) |
| GET | `/api/v1/health` | Health check | No |

---

## GET /api/v1/agents

**Description**: List all agents with filters and pagination.

**Query Parameters**:
- `type` (optional): TRADING | DEFI | NFT | ORACLE | OTHER
- `status` (optional): VERIFIED | PENDING | FLAGGED
- `minTrustScore` (optional): number 0-100
- `page` (optional, default: 1): page number
- `limit` (optional, default: 20): results per page

**Response**:
```json
{
  "data": [
    {
      "address": "0x123...",
      "name": "TradeBot",
      "type": "TRADING",
      "trust_score": 92,
      "status": "VERIFIED",
      "volumes": [...]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 247,
    "totalPages": 13
  }
}
```

---

## GET /api/v1/agents/:address

**Description**: Get complete detail of a specific agent.

**Path Parameters**:
- `address`: Agent contract address (0x...)

**Response**:
```json
{
  "data": {
    "address": "0x123...",
    "name": "TradeBot",
    "type": "TRADING",
    "description": "Automated trading agent",
    "owner_address": "0xabc...",
    "billing_address": "0xdef...",
    "status": "VERIFIED",
    "trust_score": 92,
    "proxy_detected": false,
    "oz_score": 85,
    "registered_at": "2026-01-15T10:00:00Z",
    "volumes": [...],
    "heartbeats": [...],
    "ratings": [...]
  }
}
```

---

## POST /api/v1/agents/register

**Description**: Register a new agent on the platform.

**Body**:
```json
{
  "address": "0x123...",
  "name": "My Trading Bot",
  "category": "TRADING",
  "description": "Automated DeFi trading agent"
}
```

**Response**:
```json
{
  "data": {
    "address": "0x123...",
    "name": "My Trading Bot",
    "type": "TRADING",
    "status": "PENDING",
    "trust_score": 0,
    "registered_at": "2026-02-04T15:30:00Z"
  }
}
```

---

## GET /api/v1/agents/:address/trust-score

**Description**: Get current trust score with detailed breakdown.

**Response**:
```json
{
  "data": {
    "address": "0x123...",
    "trustScore": 92,
    "breakdown": {
      "volume": {
        "score": 80,
        "weight": 0.25,
        "contribution": 20
      },
      "proxy": {
        "score": 100,
        "weight": 0.20,
        "contribution": 20
      },
      "uptime": {
        "score": 95,
        "weight": 0.25,
        "contribution": 23.75
      },
      "ozMatch": {
        "score": 85,
        "weight": 0.15,
        "contribution": 12.75
      },
      "ratings": {
        "score": 92,
        "weight": 0.15,
        "contribution": 13.8
      }
    },
    "lastUpdated": "2026-02-04T14:00:00Z"
  }
}
```

---

## POST /api/v1/agents/:address/ratings

**Description**: Create or update a user rating for an agent.

**Body**:
```json
{
  "score": 5,
  "comment": "Excellent trading bot, very reliable!",
  "signature": "0xabc..."
}
```

**Response**:
```json
{
  "data": {
    "id": "rating_123",
    "agent_address": "0x123...",
    "user_address": "0xdef...",
    "score": 5,
    "comment": "Excellent trading bot, very reliable!",
    "created_at": "2026-02-04T15:30:00Z"
  }
}
```

---

## POST /api/v1/agents/:address/reports

**Description**: Create a report for a suspicious agent.

**Body**:
```json
{
  "reason": "PROXY_HIDDEN",
  "description": "This agent has an undeclared proxy that changed implementation",
  "signature": "0xabc..."
}
```

**Response**:
```json
{
  "data": {
    "id": "report_123",
    "agent_address": "0x123...",
    "reporter_address": "0xdef...",
    "reason": "PROXY_HIDDEN",
    "status": "OPEN",
    "created_at": "2026-02-04T15:30:00Z"
  }
}
```

---

## GET /api/v1/health

**Description**: Health check endpoint to verify API status.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-02-04T15:30:00Z",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## Rate Limits

- **Without API Key**: 100 requests/minute
- **With free API Key**: 1000 requests/minute
- **Registration endpoints**: 5 requests/hour per IP

## Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request body/params validation error |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `BLOCKCHAIN_ERROR` | 500 | Error interacting with blockchain |
