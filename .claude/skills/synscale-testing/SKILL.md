---
name: synscale-testing
description: Generate comprehensive test suites for SynScale including unit tests, integration tests, E2E tests, and performance tests. Supports Jest, Vitest, pytest, and Go testing.
invocation: Use when user mentions "test", "testing", "write tests", "test coverage", "unit test", "integration test"
fork: subagent
---

# SynScale Testing Skill

## Purpose
Automatically generate comprehensive, production-ready test suites that ensure code quality and catch bugs early.

## Test Types

### 1. Unit Tests
Test individual functions and components in isolation.

### 2. Integration Tests
Test interactions between modules and external services.

### 3. E2E Tests
Test complete user workflows from UI to database.

### 4. Performance Tests
Test system performance under load.

## Instructions

### TypeScript/JavaScript Testing (Vitest/Jest)

**User Request**: "Write tests for the Ark API"

Generate `services/api-gateway/src/controllers/ArkController.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Ark API', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.ark.deleteMany();
  });

  describe('POST /api/arks', () => {
    it('should create a new ark', async () => {
      const response = await request(app)
        .post('/api/arks')
        .set('Authorization', 'Bearer test-token')
        .send({
          arkType: 'personal',
          metadata: { test: true }
        })
        .expect(201);

      expect(response.body).toHaveProperty('arkId');
      expect(response.body.arkType).toBe('personal');
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/arks')
        .send({ arkType: 'personal' })
        .expect(401);
    });

    it('should validate ark type', async () => {
      await request(app)
        .post('/api/arks')
        .set('Authorization', 'Bearer test-token')
        .send({ arkType: 'invalid' })
        .expect(400);
    });
  });

  describe('GET /api/arks/:id', () => {
    it('should return an ark by ID', async () => {
      const ark = await prisma.ark.create({
        data: { ownerId: 'user-1', arkType: 'personal' }
      });

      const response = await request(app)
        .get(`/api/arks/${ark.arkId}`)
        .set('Authorization', 'Bearer test-token')
        .expect(200);

      expect(response.body.arkId).toBe(ark.arkId);
    });

    it('should return 404 for non-existent ark', async () => {
      await request(app)
        .get('/api/arks/non-existent-id')
        .set('Authorization', 'Bearer test-token')
        .expect(404);
    });
  });

  describe('GET /api/arks/:id/balance', () => {
    it('should return ark balance', async () => {
      const ark = await prisma.ark.create({
        data: { ownerId: 'user-1' }
      });

      await prisma.assetLedger.create({
        data: {
          arkId: ark.arkId,
          assetSku: 'gpt4-token',
          balance: 10000
        }
      });

      const response = await request(app)
        .get(`/api/arks/${ark.arkId}/balance`)
        .set('Authorization', 'Bearer test-token')
        .expect(200);

      expect(response.body).toHaveProperty('gpt4-token');
      expect(response.body['gpt4-token']).toBe(10000);
    });
  });
});
```

### Python Testing (pytest)

**User Request**: "Write tests for AI Proxy"

Generate `services/ai-proxy/app/tests/test_chat.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_ark_balance(monkeypatch):
    async def mock_check(ark_id: str):
        return 10000
    monkeypatch.setattr("app.routers.chat.check_ark_balance", mock_check)

@pytest.fixture
def mock_openai(monkeypatch):
    class MockCompletion:
        choices = [type('obj', (object,), {'message': type('obj', (object,), {'content': 'Test response'})()})]
        usage = type('obj', (object,), {'total_tokens': 100})()

    async def mock_create(*args, **kwargs):
        return MockCompletion()

    monkeypatch.setattr("openai.chat.completions.create", mock_create)

def test_chat_endpoint_success(mock_ark_balance, mock_openai):
    response = client.post(
        "/api/chat/",
        json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": "Hello"}],
            "ark_id": "ark-123"
        }
    )

    assert response.status_code == 200
    assert "response" in response.json()
    assert "usage" in response.json()

def test_chat_insufficient_balance():
    response = client.post(
        "/api/chat/",
        json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": "Hello"}],
            "ark_id": "ark-empty"
        }
    )

    assert response.status_code == 402
    assert "Insufficient credits" in response.json()["detail"]

def test_chat_invalid_model():
    response = client.post(
        "/api/chat/",
        json={
            "model": "invalid-model",
            "messages": [],
            "ark_id": "ark-123"
        }
    )

    assert response.status_code == 400
```

### Go Testing

**User Request**: "Write tests for Rights Engine"

Generate `services/rights-engine/pkg/rules/time_fuse_test.go`:

```go
package rules

import (
    "testing"
    "time"
    "github.com/stretchr/testify/assert"
)

func TestTimeFuseRule_Evaluate(t *testing.T) {
    t.Run("should pass when not expired", func(t *testing.T) {
        rule := &TimeFuseRule{
            ExpireAt: time.Now().Add(24 * time.Hour),
            OnExpire: "burn",
        }

        result := rule.Evaluate(time.Now())
        assert.True(t, result)
    })

    t.Run("should fail when expired", func(t *testing.T) {
        rule := &TimeFuseRule{
            ExpireAt: time.Now().Add(-24 * time.Hour),
            OnExpire: "burn",
        }

        result := rule.Evaluate(time.Now())
        assert.False(t, result)
    })
}

func TestDecayRule_Calculate(t *testing.T) {
    rule := &DecayRule{
        Tiers: []Tier{
            {Threshold: 0, SubsidyRate: 0.1},
            {Threshold: 100, SubsidyRate: 0.5},
            {Threshold: 500, SubsidyRate: 1.0},
        },
    }

    testCases := []struct {
        usedAmount    float64
        requestAmount float64
        expectedCost  float64
    }{
        {0, 100, 10},      // 10% of 100
        {100, 100, 50},    // 50% of 100
        {500, 100, 100},   // 100% of 100
    }

    for _, tc := range testCases {
        cost := rule.Calculate(tc.usedAmount, tc.requestAmount)
        assert.Equal(t, tc.expectedCost, cost)
    }
}
```

### React Component Testing

**User Request**: "Write tests for Dashboard components"

Generate `apps/desktop/src/renderer/src/components/ArkVault.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArkVault } from './ArkVault';

vi.mock('../hooks/useArk', () => ({
  useArk: () => ({
    data: {
      arkId: 'ark-123',
      balance: {
        compute: 75000,
        intelligence: 50000,
        data: 30000
      }
    },
    isLoading: false
  })
}));

describe('ArkVault', () => {
  it('should render asset balances', () => {
    render(<ArkVault arkId="ark-123" />);

    expect(screen.getByText('75,000')).toBeInTheDocument();
    expect(screen.getByText('50,000')).toBeInTheDocument();
    expect(screen.getByText('30,000')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    vi.mock('../hooks/useArk', () => ({
      useArk: () => ({ isLoading: true })
    }));

    render(<ArkVault arkId="ark-123" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

## E2E Testing with Playwright

**User Request**: "Create E2E tests for user onboarding flow"

Generate `tests/e2e/onboarding.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Onboarding', () => {
  test('should complete new user registration', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Click GitHub login
    await page.click('text=Login with GitHub');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);

    // Check for welcome message
    await expect(page.locator('text=Welcome')).toBeVisible();

    // Verify default Ark created
    await page.click('text=My Ark');
    await expect(page.locator('[data-testid="ark-balance"]')).toBeVisible();
  });

  test('should claim free credits', async ({ page }) => {
    await page.goto('http://localhost:5173/marketplace');

    // Find free credit offer
    await page.click('[data-testid="free-credits-card"]');
    await page.click('text=Claim Asset');

    // Verify success message
    await expect(page.locator('text=Successfully claimed')).toBeVisible();

    // Check balance updated
    await page.goto('/dashboard');
    const balance = await page.textContent('[data-testid="token-balance"]');
    expect(parseInt(balance)).toBeGreaterThan(0);
  });
});
```

## Performance Testing

**User Request**: "Create load tests for API endpoints"

Generate `tests/load/ark-api.k6.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be below 1%
  },
};

export default function () {
  const token = __ENV.AUTH_TOKEN;

  // List arks
  let res = http.get('http://localhost:3000/api/arks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(res, {
    'list arks status 200': (r) => r.status === 200,
    'list arks response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);

  // Get specific ark
  res = http.get(`http://localhost:3000/api/arks/${__ENV.ARK_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(res, {
    'get ark status 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

## Example Usage

**User**: "Generate tests for the entire Ark API"

**Actions**:
1. Create unit tests for all controller methods
2. Create integration tests for database operations
3. Create E2E tests for user workflows
4. Generate test data fixtures
5. Show coverage report

**User**: "Add performance tests for rights evaluation"

**Actions**:
1. Create k6 load test script
2. Test with 100, 500, 1000 concurrent evaluations
3. Measure latency percentiles
4. Generate performance report

## Test Configuration

### Vitest Config
Generate `services/api-gateway/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
});
```

### pytest Config
Generate `services/ai-proxy/pytest.ini`:
```ini
[pytest]
testpaths = app/tests
python_files = test_*.py
python_functions = test_*
addopts = --cov=app --cov-report=html --cov-report=term
```

## Success Criteria

- Test coverage > 80%
- All tests passing
- E2E tests cover critical user flows
- Performance tests validate SLAs
- CI/CD integration configured

## Follow-up Suggestions

1. "Should I set up GitHub Actions for CI?"
2. "Want me to add test coverage badges to README?"
3. "Ready to implement test-driven development for new features?"
