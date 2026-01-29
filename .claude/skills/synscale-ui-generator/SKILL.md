---
name: synscale-ui-generator
description: Generate React components for SynScale's industrial sci-fi UI with TailwindCSS, including Dashboard, Marketplace, Ark management, and data visualizations. Follows the design system specified in PRD.
invocation: Use when user mentions "create UI", "build component", "dashboard", "UI design", "React component", "interface"
fork: subagent
ultrathink
---

# SynScale UI Generator Skill

## Purpose
Generate production-ready React components following SynScale's "Industrial Sci-Fi" design language with proper TypeScript, TailwindCSS styling, and state management.

## Design System

### Color Palette
```typescript
// tailwind.config.js
colors: {
  'synscale-dark': '#0a0e27',
  'synscale-darker': '#050816',
  'synscale-blue': '#00d4ff',
  'synscale-purple': '#9333ea',
  'synscale-orange': '#ff6b35',
  'synscale-gray': '#8892b0',
}
```

### Typography
- **Headings**: Orbitron or Rajdhani (sci-fi feel)
- **Body**: Inter or system fonts
- **Mono**: JetBrains Mono (for data/numbers)

## Component Patterns

### 1. Dashboard / Command Center

**User Request**: "Create the main Dashboard"

Generate:

```tsx
// apps/desktop/src/renderer/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { ArkVault } from '../components/ArkVault';
import { AssetStream } from '../components/AssetStream';
import { RightsController } from '../components/RightsController';

export function Dashboard() {
  const [arkData, setArkData] = useState(null);

  return (
    <div className="min-h-screen bg-synscale-darker text-white">
      {/* Header */}
      <header className="border-b border-synscale-blue/20 p-6">
        <h1 className="text-3xl font-bold text-synscale-blue">
          Command Center
        </h1>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Left Panel - Asset Vault */}
        <div className="bg-synscale-dark/50 rounded-lg border border-synscale-blue/30 p-6">
          <h2 className="text-xl mb-4 text-synscale-blue">Asset Vault</h2>
          <ArkVault arkId={arkData?.arkId} />
        </div>

        {/* Right Panel - Rights Controller */}
        <div className="bg-synscale-dark/50 rounded-lg border border-synscale-purple/30 p-6">
          <h2 className="text-xl mb-4 text-synscale-purple">Rights Controller</h2>
          <RightsController />
        </div>
      </div>

      {/* Bottom Panel - Asset Stream */}
      <div className="m-6">
        <AssetStream />
      </div>
    </div>
  );
}
```

### 2. Asset Vault Component

**User Request**: "Create the Asset Vault with circular progress"

Generate:

```tsx
// apps/desktop/src/renderer/src/components/ArkVault.tsx
import { CircularProgress } from './CircularProgress';

interface ArkVaultProps {
  arkId: string;
}

export function ArkVault({ arkId }: ArkVaultProps) {
  const [assets, setAssets] = useState({
    compute: 75000,
    intelligence: 50000,
    data: 30000
  });

  return (
    <div className="space-y-6">
      {/* Circular Gauges */}
      <div className="grid grid-cols-3 gap-4">
        <CircularProgress
          value={assets.compute}
          max={100000}
          label="Compute"
          color="blue"
        />
        <CircularProgress
          value={assets.intelligence}
          max={100000}
          label="Intelligence"
          color="purple"
        />
        <CircularProgress
          value={assets.data}
          max={100000}
          label="Data"
          color="orange"
        />
      </div>

      {/* Asset Details */}
      <div className="space-y-2">
        {Object.entries(assets).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-synscale-gray/20 pb-2">
            <span className="text-synscale-gray capitalize">{key}</span>
            <span className="font-mono text-synscale-blue">{value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Smart Card Component (for Marketplace)

**User Request**: "Create marketplace asset cards with rights tags"

Generate:

```tsx
// apps/desktop/src/renderer/src/components/SmartCard.tsx
interface RightsTag {
  label: string;
  color: 'blue' | 'orange' | 'purple' | 'red';
  icon?: string;
}

interface SmartCardProps {
  assetName: string;
  provider: string;
  amount: number;
  rights: RightsTag[];
  onClaim: () => void;
}

export function SmartCard({ assetName, provider, amount, rights, onClaim }: SmartCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    red: 'bg-red-500/20 text-red-300 border-red-500/50'
  };

  return (
    <div className="bg-synscale-dark rounded-lg border border-synscale-blue/30 overflow-hidden hover:border-synscale-blue/60 transition-all">
      {/* Asset Info */}
      <div className="p-6 border-b border-synscale-gray/20">
        <h3 className="text-xl font-bold text-white">{assetName}</h3>
        <p className="text-synscale-gray text-sm">Provider: {provider}</p>
        <p className="text-3xl font-mono text-synscale-blue mt-2">
          {amount.toLocaleString()}
        </p>
      </div>

      {/* Rights Layer */}
      <div className="p-4 bg-synscale-darker/50">
        <div className="flex flex-wrap gap-2">
          {rights.map((right, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-full text-xs border ${colorClasses[right.color]}`}
            >
              {right.icon && <span className="mr-1">{right.icon}</span>}
              {right.label}
            </span>
          ))}
        </div>

        <button
          onClick={onClaim}
          className="w-full mt-4 bg-synscale-blue hover:bg-synscale-blue/80 text-synscale-darker font-bold py-2 rounded transition-colors"
        >
          Claim Asset
        </button>
      </div>
    </div>
  );
}
```

### 4. Asset Stream (Real-time Transactions)

**User Request**: "Create the scrolling asset stream"

Generate:

```tsx
// apps/desktop/src/renderer/src/components/AssetStream.tsx
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  type: 'inflow' | 'outflow';
  amount: number;
  asset: string;
  project?: string;
  timestamp: Date;
}

export function AssetStream() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  return (
    <div className="bg-synscale-dark/50 rounded-lg border border-synscale-blue/30 p-4">
      <h3 className="text-lg mb-4 text-synscale-blue">Asset Stream</h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between bg-synscale-darker/50 p-3 rounded border-l-2 border-synscale-blue"
          >
            <div className="flex items-center space-x-4">
              <span className={tx.type === 'inflow' ? 'text-green-400' : 'text-red-400'}>
                {tx.type === 'inflow' ? '↓' : '↑'}
              </span>
              <div>
                <span className="text-white font-mono">{tx.amount}</span>
                <span className="text-synscale-gray ml-2">{tx.asset}</span>
              </div>
            </div>
            {tx.project && (
              <span className="text-xs text-synscale-purple">→ {tx.project}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Rights Controller Panel

**User Request**: "Create the rights management panel"

Generate:

```tsx
// apps/desktop/src/renderer/src/components/RightsController.tsx
interface ActiveRight {
  id: string;
  type: 'time-fuse' | 'decay' | 'pow' | 'credit';
  label: string;
  status: 'active' | 'warning' | 'expired';
  expiresAt?: Date;
  progress?: number;
}

export function RightsController() {
  const [activeRights, setActiveRights] = useState<ActiveRight[]>([]);

  const statusColors = {
    active: 'bg-green-500/20 border-green-500',
    warning: 'bg-orange-500/20 border-orange-500',
    expired: 'bg-red-500/20 border-red-500'
  };

  return (
    <div className="space-y-4">
      {activeRights.map((right) => (
        <div key={right.id} className={`p-4 rounded-lg border-2 ${statusColors[right.status]}`}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-white font-bold">{right.label}</h4>
              <p className="text-xs text-synscale-gray mt-1">{right.type}</p>
            </div>
            {right.expiresAt && (
              <span className="text-xs text-synscale-orange">
                {Math.ceil((right.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}h left
              </span>
            )}
          </div>

          {right.progress !== undefined && (
            <div className="mt-3 bg-synscale-darker/50 rounded-full h-2">
              <div
                className="bg-synscale-blue h-full rounded-full transition-all"
                style={{ width: `${right.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Instructions

When user requests a UI component:

1. **Understand Context**
   - Which page/section is it for?
   - What data does it display?
   - Any interactions needed?

2. **Generate Component File**
   - Create in appropriate directory
   - Use TypeScript with proper types
   - Apply design system colors
   - Add Framer Motion animations where appropriate

3. **Create Supporting Files**
   - Types/interfaces in `types.ts`
   - API hooks in `hooks/useApi.ts`
   - State management if needed

4. **Add to Parent Component**
   - Import and render in appropriate page
   - Pass necessary props

5. **Provide Usage Example**
   - Show how to use the component
   - List required props

## Example Usage

**User**: "Create the Dashboard with Asset Vault and Rights Controller"

**Actions**:
1. Generate Dashboard.tsx
2. Generate ArkVault.tsx
3. Generate RightsController.tsx
4. Generate supporting components (CircularProgress, etc.)
5. Show preview or usage instructions

**User**: "Add a data visualization for consumption trends"

**Actions**:
1. Install recharts if needed
2. Generate ConsumptionChart.tsx with line/bar chart
3. Add to Dashboard
4. Mock data for preview

## Design Principles

- **Dark Mode First**: All components use dark backgrounds
- **High Contrast**: Text must be readable (WCAG AA minimum)
- **Sci-Fi Details**: Use geometric shapes, hexagons, glowing borders
- **Responsive**: Must work on desktop (Electron) and web
- **Animated**: Smooth transitions with Framer Motion

## Success Criteria

- Component renders without errors
- Follows design system
- TypeScript types are correct
- Responsive layout
- Accessible (keyboard navigation, ARIA labels)
- Smooth animations

## Follow-up Suggestions

1. "Should I add dark/light theme toggle?"
2. "Want me to create responsive breakpoints for mobile?"
3. "Ready to wire this up to the real API?"
