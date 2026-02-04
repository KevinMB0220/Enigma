# Trust Score System

## Overview

The Trust Score is a composite rating (0-100) that measures the trustworthiness of an autonomous agent based on multiple verifiable signals.

## Formula

```typescript
const WEIGHTS = {
  VOLUME: 0.25,    // 25% - Transaction volume activity
  PROXY: 0.20,     // 20% - No hidden proxy detected
  UPTIME: 0.25,    // 25% - Heartbeat response rate
  OZ_MATCH: 0.15,  // 15% - OpenZeppelin bytecode similarity
  RATINGS: 0.15    // 15% - Community ratings average
};

trust_score = (volume_score * 0.25) +
              (proxy_score * 0.20) +
              (uptime_score * 0.25) +
              (oz_score * 0.15) +
              (ratings_score * 0.15)
```

## Score Components

### 1. Volume Score (25%)

Measures transaction activity through the agent's billing address.

| Volume (24h) | Score |
|--------------|-------|
| > 1000 AVAX | 100 |
| 500-1000 AVAX | 80 |
| 100-500 AVAX | 60 |
| 10-100 AVAX | 40 |
| < 10 AVAX | 20 |

### 2. Proxy Score (20%)

Penalizes agents with hidden or undeclared proxy contracts.

| Condition | Score |
|-----------|-------|
| No proxy detected | 100 |
| Declared proxy (transparent) | 80 |
| Undeclared proxy detected | 0 |

### 3. Uptime Score (25%)

Based on heartbeat response rate over last 24 hours.

```typescript
uptime_score = (successful_heartbeats / total_heartbeats) * 100
```

| Uptime | Score |
|--------|-------|
| 99%+ | 100 |
| 95-99% | 90 |
| 90-95% | 70 |
| 80-90% | 50 |
| < 80% | 25 |

### 4. OpenZeppelin Match Score (15%)

Measures bytecode similarity to known secure OpenZeppelin contracts.

| Match Level | Score |
|-------------|-------|
| High similarity (>80%) | 100 |
| Medium similarity (50-80%) | 70 |
| Low similarity (20-50%) | 40 |
| No match (<20%) | 20 |

### 5. Community Ratings Score (15%)

Average of user ratings (1-5 stars).

```typescript
ratings_score = (average_rating / 5) * 100
```

## Score Ranges

| Range | Label | Color | Interpretation |
|-------|-------|-------|----------------|
| 90-100 | Excellent | Green | Highly trusted, all signals positive |
| 70-89 | Good | Blue | Generally trusted, minor concerns |
| 50-69 | Medium | Yellow | Use with caution, some flags |
| 0-49 | Low | Red | Not recommended, significant issues |

## Update Frequency

- **Real-time**: User ratings
- **Hourly**: Heartbeat checks, uptime calculation
- **Every 15 min**: Transaction volume updates
- **On-demand**: Proxy detection (on registration + periodic)

## API Response

```json
{
  "address": "0x123...",
  "trustScore": 92,
  "breakdown": {
    "volume": {
      "score": 80,
      "weight": 0.25,
      "contribution": 20,
      "details": {
        "volume24h": "542 AVAX",
        "txCount": 1247
      }
    },
    "proxy": {
      "score": 100,
      "weight": 0.20,
      "contribution": 20,
      "details": {
        "detected": false,
        "type": null
      }
    },
    "uptime": {
      "score": 95,
      "weight": 0.25,
      "contribution": 23.75,
      "details": {
        "successRate": "95.2%",
        "checks24h": 24,
        "passed": 23
      }
    },
    "ozMatch": {
      "score": 85,
      "weight": 0.15,
      "contribution": 12.75,
      "details": {
        "matchedComponents": ["Ownable", "AccessControl"]
      }
    },
    "ratings": {
      "score": 92,
      "weight": 0.15,
      "contribution": 13.8,
      "details": {
        "average": 4.6,
        "count": 47
      }
    }
  },
  "lastUpdated": "2026-02-04T14:00:00Z"
}
```
