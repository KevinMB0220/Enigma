# Testing Strategy

## Testing Stack

| Tool | Purpose | Version |
|------|---------|---------|
| **Vitest** | Unit tests | latest |
| **Playwright** | E2E tests | latest |
| **React Testing Library** | Component tests | 14.x |

## Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── agent-service.test.ts
│   │   ├── trust-score-service.test.ts
│   │   └── centinela-service.test.ts
│   └── utils/
│       ├── format.test.ts
│       └── validation.test.ts
├── integration/
│   ├── api/
│   │   ├── agents.test.ts
│   │   └── trust-score.test.ts
│   └── database/
│       └── queries.test.ts
├── components/
│   ├── agent-card.test.tsx
│   ├── trust-score-badge.test.tsx
│   └── wallet-connect.test.tsx
└── e2e/
    ├── registration.spec.ts
    ├── scanner.spec.ts
    └── agent-profile.spec.ts
```

## Unit Tests

### Service Tests

```typescript
// tests/unit/services/trust-score-service.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTrustScore } from '@/services/trust-score-service';

describe('TrustScoreService', () => {
  describe('calculateTrustScore', () => {
    it('should return 100 for perfect agent', () => {
      const agent = {
        volumeScore: 100,
        proxyScore: 100,
        uptimeScore: 100,
        ozScore: 100,
        ratingsScore: 100
      };

      expect(calculateTrustScore(agent)).toBe(100);
    });

    it('should apply correct weights', () => {
      const agent = {
        volumeScore: 80,   // 80 * 0.25 = 20
        proxyScore: 100,   // 100 * 0.20 = 20
        uptimeScore: 90,   // 90 * 0.25 = 22.5
        ozScore: 70,       // 70 * 0.15 = 10.5
        ratingsScore: 80   // 80 * 0.15 = 12
      };

      expect(calculateTrustScore(agent)).toBe(85);
    });

    it('should handle zero scores', () => {
      const agent = {
        volumeScore: 0,
        proxyScore: 0,
        uptimeScore: 0,
        ozScore: 0,
        ratingsScore: 0
      };

      expect(calculateTrustScore(agent)).toBe(0);
    });
  });
});
```

### Validation Tests

```typescript
// tests/unit/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import { registerAgentSchema } from '@/lib/utils/validation';

describe('Validation Schemas', () => {
  describe('registerAgentSchema', () => {
    it('should validate correct input', () => {
      const input = {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Test Agent',
        category: 'trading'
      };

      expect(registerAgentSchema.safeParse(input).success).toBe(true);
    });

    it('should reject invalid address', () => {
      const input = {
        address: 'invalid',
        name: 'Test Agent',
        category: 'trading'
      };

      expect(registerAgentSchema.safeParse(input).success).toBe(false);
    });

    it('should reject short name', () => {
      const input = {
        address: '0x1234567890123456789012345678901234567890',
        name: 'AB',
        category: 'trading'
      };

      expect(registerAgentSchema.safeParse(input).success).toBe(false);
    });
  });
});
```

## Component Tests

```typescript
// tests/components/trust-score-badge.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TrustScoreBadge } from '@/components/agent/trust-score-badge';

describe('TrustScoreBadge', () => {
  it('should render excellent score', () => {
    render(<TrustScoreBadge score={95} />);

    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('should render correct color for good score', () => {
    render(<TrustScoreBadge score={75} />);

    const badge = screen.getByTestId('trust-badge');
    expect(badge).toHaveClass('trust-good');
  });

  it('should render warning for medium score', () => {
    render(<TrustScoreBadge score={55} />);

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });
});
```

## E2E Tests

```typescript
// tests/e2e/scanner.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Scanner Page', () => {
  test('should load agents list', async ({ page }) => {
    await page.goto('/scanner');

    // Wait for loading to complete
    await page.waitForSelector('[data-testid="agent-table"]');

    // Should have agents
    const rows = await page.locator('[data-testid="agent-row"]').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('should filter by type', async ({ page }) => {
    await page.goto('/scanner');

    // Select TRADING filter
    await page.selectOption('[data-testid="type-filter"]', 'TRADING');

    // Wait for refetch
    await page.waitForResponse('**/api/v1/agents*');

    // All visible agents should be TRADING type
    const types = await page.locator('[data-testid="agent-type"]').allTextContents();
    types.forEach(type => expect(type).toBe('TRADING'));
  });

  test('should navigate to agent profile', async ({ page }) => {
    await page.goto('/scanner');

    // Click first agent
    await page.locator('[data-testid="agent-row"]').first().click();

    // Should navigate to agent profile
    await expect(page).toHaveURL(/\/agent\/0x/);
  });
});
```

## Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

## CI Configuration

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
```
