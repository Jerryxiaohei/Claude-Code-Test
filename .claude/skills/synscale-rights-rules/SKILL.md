---
name: synscale-rights-rules
description: Implement SynScale's 5 core Smart Rights rules (Time-Fuse, Decay, PoW, Credit, Project-Binding). Generates rule evaluation logic in Go, TypeScript, or Python with proper validation and testing.
invocation: Use when user mentions "implement rights", "smart rights", "time fuse", "decay", "behavior incentive", "rights rule", "权益规则"
fork: subagent
ultrathink
---

# SynScale Smart Rights Rules Implementation Skill

## Purpose
Implement the 5 core Smart Rights rules that are central to SynScale's value proposition. Generate production-ready code with comprehensive testing.

## Core Rights Rules

### 1. Time-Fuse Subsidy (时效熔断)
**Purpose**: Assets expire if not used within deadline.

**Logic**:
```typescript
interface TimeFuseRight {
  type: 'time-fuse';
  expireAt: Date;
  onExpire: 'burn' | 'return_to_pool';
}

function evaluateTimeFuse(right: TimeFuseRight, currentTime: Date): boolean {
  if (currentTime > right.expireAt) {
    if (right.onExpire === 'burn') {
      // Set balance to 0
    } else if (right.onExpire === 'return_to_pool') {
      // Return to provider pool
    }
    return false; // Not allowed to use
  }
  return true; // Allowed to use
}
```

### 2. Decay Curve Subsidy (阶梯递减)
**Purpose**: Subsidy rate decreases with usage.

**Logic**:
```typescript
interface DecayRight {
  type: 'decay';
  tiers: Array<{
    threshold: number;
    subsidyRate: number; // 0.0 to 1.0
  }>;
}

function evaluateDecay(right: DecayRight, usedAmount: number, requestAmount: number): number {
  // Find current tier based on total used amount
  let currentRate = 1.0;
  for (const tier of right.tiers) {
    if (usedAmount >= tier.threshold) {
      currentRate = tier.subsidyRate;
    } else {
      break;
    }
  }

  // Calculate actual cost
  const subsidizedCost = requestAmount * currentRate;
  return subsidizedCost;
}

// Example configuration:
// Tiers: [
//   { threshold: 0, subsidyRate: 0.1 },     // 0-100: 10% of cost
//   { threshold: 100, subsidyRate: 0.5 },   // 100-500: 50% of cost
//   { threshold: 500, subsidyRate: 1.0 }    // 500+: full cost
// ]
```

### 3. Proof-of-Work Incentive (行为激励)
**Purpose**: Reward development activity with increased credits.

**Logic**:
```typescript
interface PoWRight {
  type: 'pow';
  activityScore: number;
  rewardTiers: Array<{
    minScore: number;
    creditBonus: number;
  }>;
  activitySources: {
    githubCommits: number;
    agentDeployments: number;
    apiUsage: number;
  };
}

function calculateActivityScore(sources: PoWRight['activitySources']): number {
  return (
    sources.githubCommits * 10 +
    sources.agentDeployments * 50 +
    sources.apiUsage * 0.1
  );
}

function evaluatePoW(right: PoWRight): number {
  const score = calculateActivityScore(right.activitySources);

  let bonus = 0;
  for (const tier of right.rewardTiers) {
    if (score >= tier.minScore) {
      bonus = tier.creditBonus;
    }
  }

  return bonus;
}
```

### 4. Credit Delegation (信用流转)
**Purpose**: Parent Ark delegates credits to child Arks.

**Logic**:
```typescript
interface CreditDelegationRight {
  type: 'credit-delegation';
  parentArkId: string;
  childArkId: string;
  delegatedAmount: number;
  maxOverdraft: number;
}

function evaluateCreditDelegation(
  right: CreditDelegationRight,
  requestAmount: number,
  currentChildBalance: number
): { allowed: boolean; deductFrom: 'child' | 'parent' } {
  if (currentChildBalance >= requestAmount) {
    return { allowed: true, deductFrom: 'child' };
  }

  const overdraft = requestAmount - currentChildBalance;
  if (overdraft <= right.maxOverdraft) {
    // Deduct from parent's credit
    return { allowed: true, deductFrom: 'parent' };
  }

  return { allowed: false, deductFrom: 'child' };
}
```

### 5. Project Binding (项目强绑定)
**Purpose**: Assets can only be used by specific projects.

**Logic**:
```typescript
interface ProjectBindingRight {
  type: 'project-binding';
  allowedProjects: string[]; // Project IDs
  enforceGithubLink: boolean;
}

function evaluateProjectBinding(
  right: ProjectBindingRight,
  requestingProjectId: string
): boolean {
  if (!right.allowedProjects.includes(requestingProjectId)) {
    return false; // Not allowed
  }

  if (right.enforceGithubLink) {
    // Verify project has valid GitHub repo
    const project = await fetchProject(requestingProjectId);
    if (!project.githubRepo) {
      return false;
    }
  }

  return true;
}
```

## Instructions

### Implementing a Rights Rule

**User Request**: "Implement the Time-Fuse rights rule"

**Actions**:

1. **Create Rule Type Definition**
   `packages/shared-types/src/rights.ts`:
   ```typescript
   export interface TimeFuseRight {
     ruleId: string;
     type: 'time-fuse';
     expireAt: Date;
     onExpire: 'burn' | 'return_to_pool';
     createdAt: Date;
   }
   ```

2. **Implement Evaluator (Go)**
   `services/rights-engine/pkg/rules/time_fuse.go`:
   ```go
   package rules

   import "time"

   type TimeFuseRule struct {
       ExpireAt time.Time
       OnExpire string // "burn" or "return_to_pool"
   }

   func (r *TimeFuseRule) Evaluate(currentTime time.Time) bool {
       return currentTime.Before(r.ExpireAt)
   }

   func (r *TimeFuseRule) OnExpiration(arkId string, assetId string) error {
       if r.OnExpire == "burn" {
           return burnAsset(arkId, assetId)
       } else {
           return returnToPool(arkId, assetId)
       }
   }
   ```

3. **Create Background Job**
   `services/rights-engine/pkg/jobs/expiration_checker.go`:
   ```go
   func CheckExpirations() {
       // Query all assets with time-fuse rights
       assets := db.FindAssetsWithTimeFuse()

       for _, asset := range assets {
           if time.Now().After(asset.ExpireAt) {
               // Trigger expiration logic
               asset.Rights.OnExpiration(asset.ArkId, asset.AssetId)
           }
       }
   }
   ```

4. **Add API Endpoint**
   `services/rights-engine/pkg/api/handlers.go`:
   ```go
   func (h *Handler) CreateTimeFuseRight(c *gin.Context) {
       var req TimeFuseRightRequest
       if err := c.ShouldBindJSON(&req); err != nil {
           c.JSON(400, gin.H{"error": err.Error()})
           return
       }

       right := &TimeFuseRule{
           ExpireAt: req.ExpireAt,
           OnExpire: req.OnExpire,
       }

       // Save to database
       db.CreateRight(right)

       c.JSON(201, right)
   }
   ```

5. **Add Tests**
   `services/rights-engine/pkg/rules/time_fuse_test.go`:
   ```go
   func TestTimeFuseRule_Evaluate(t *testing.T) {
       rule := &TimeFuseRule{
           ExpireAt: time.Now().Add(24 * time.Hour),
       }

       // Should pass (not expired)
       assert.True(t, rule.Evaluate(time.Now()))

       // Should fail (expired)
       assert.False(t, rule.Evaluate(time.Now().Add(48 * time.Hour)))
   }
   ```

### Implementing Multiple Rules

**User Request**: "Implement all 5 Smart Rights rules"

**Actions**:
1. Create type definitions for all 5 rules
2. Implement evaluators in Go
3. Create TypeScript client SDK
4. Add API endpoints for CRUD operations
5. Create background jobs for automated checks
6. Generate comprehensive test suite

## Example Usage

**User**: "Implement Time-Fuse rights with 7-day expiration"

**Response**:
- Generate TimeFuseRight type
- Implement Go evaluator
- Create cron job to check expirations daily
- Add API endpoint to create time-fuse rights
- Generate tests

**User**: "Create a rights template for new user onboarding"

**Response**:
- Combine Decay (90% subsidy first 100 calls) + Time-Fuse (30 days)
- Create template in database
- Generate API to apply this template to new users

## Advanced Features

### Composite Rights
Combine multiple rights on single asset:

```typescript
interface CompositeRight {
  rules: Array<TimeFuseRight | DecayRight | PoWRight>;
  logic: 'all' | 'any'; // All rules must pass, or any rule can pass
}

function evaluateComposite(right: CompositeRight): boolean {
  if (right.logic === 'all') {
    return right.rules.every(rule => evaluate(rule));
  } else {
    return right.rules.some(rule => evaluate(rule));
  }
}
```

### Dynamic Rule Adjustment
Allow AI to suggest optimal rule parameters:

```typescript
interface RuleOptimization {
  currentRule: DecayRight;
  usageData: UsageStats;
  goal: 'maximize_usage' | 'minimize_cost' | 'balance';
}

function optimizeRule(opt: RuleOptimization): DecayRight {
  // Use historical data to suggest better tier thresholds
  // AI-driven optimization
}
```

## Success Criteria

- All 5 rules implemented and tested
- Background jobs running for automated checks
- API endpoints functional
- TypeScript SDK generated
- Comprehensive test coverage (>80%)
- Performance: Rule evaluation <10ms

## Follow-up Suggestions

1. "Should I create a UI for managing rights templates?"
2. "Want me to add analytics for rights effectiveness?"
3. "Ready to implement the rights marketplace?"

## Testing Scenarios

Generate test cases for each rule:

```typescript
describe('Time-Fuse Rights', () => {
  it('should allow usage before expiration', async () => {
    const right = createTimeFuseRight({ expiresIn: '7d' });
    expect(await evaluate(right)).toBe(true);
  });

  it('should deny usage after expiration', async () => {
    const right = createTimeFuseRight({ expiresIn: '-1d' });
    expect(await evaluate(right)).toBe(false);
  });

  it('should burn assets on expiration', async () => {
    const right = createTimeFuseRight({ onExpire: 'burn' });
    await simulateExpiration(right);
    const balance = await getBalance(arkId);
    expect(balance).toBe(0);
  });
});
```
