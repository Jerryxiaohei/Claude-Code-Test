# SynScale 技术栈规划 (Phase 1)

> 基于产品需求文档和技术选型，为**Genesis Ark**量身定制的技术方案

---

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│              Electron Desktop App (桌面客户端)            │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Renderer Process (前端界面)                      │   │
│  │   React + TypeScript + TailwindCSS              │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Main Process (主进程)                           │   │
│  │   Node.js + Electron IPC                        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTPS/WebSocket
┌─────────────────────────────────────────────────────────┐
│              Backend Services (后端服务)                 │
│                                                         │
│  ┌──────────────────┐      ┌─────────────────────┐    │
│  │  API Gateway     │      │  Rights Engine      │    │
│  │  (Node.js)       │──────│  (Go/Rust)          │    │
│  │  - 用户认证       │      │  - 权益解释器        │    │
│  │  - 路由转发       │      │  - 规则执行          │    │
│  └──────────────────┘      └─────────────────────┘    │
│                                                         │
│  ┌──────────────────┐      ┌─────────────────────┐    │
│  │  AI Proxy        │      │  Blockchain Adapter │    │
│  │  (Python)        │      │  (TypeScript)       │    │
│  │  - 模型调用       │      │  - 审计日志上链      │    │
│  │  - Token计量     │      │  - 凭证验证          │    │
│  └──────────────────┘      └─────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Data Layer (数据层)                        │
│  PostgreSQL  +  Redis  +  TimescaleDB                  │
└─────────────────────────────────────────────────────────┘
```

---

## 一、前端技术栈

### 1.1 桌面框架

**Electron** (最新稳定版)
- **主进程 (Main Process)**:
  - Node.js + TypeScript
  - 负责窗口管理、系统集成、安全密钥存储
  - 使用 `electron-store` 存储本地配置
  - 使用 `keytar` 安全存储敏感信息

- **渲染进程 (Renderer Process)**:
  - React 18+
  - TypeScript 5+
  - Vite (构建工具)

### 1.2 UI框架和组件库

**核心库**:
- **React** 18+ (UI框架)
- **TailwindCSS** 3+ (样式系统)
  - 支持自定义"工业科幻风"设计系统
  - 深色主题优先
- **Framer Motion** (动画库)
  - 实现"资产流" (Asset Stream) 动态效果
  - 权益卡片的交互动画

**UI组件库** (选一):
- **shadcn/ui** (推荐) - 基于Radix UI的无样式组件，完全可定制
- **Ant Design** - 成熟的企业级组件库
- **Mantine** - 现代化React组件库

**数据可视化**:
- **Recharts** 或 **Apache ECharts** - 环形图、仪表盘
- **D3.js** - 复杂的自定义可视化 (资产流、连接视图)

### 1.3 状态管理

- **Zustand** (推荐) - 轻量级状态管理
- 或 **Redux Toolkit** - 适合复杂状态

### 1.4 路由和导航

- **React Router** v6 - SPA路由管理

---

## 二、后端技术栈 (混合架构)

### 2.1 API网关层 (Node.js + TypeScript)

**框架**: Express 或 Fastify (高性能)

**职责**:
- 用户认证 (JWT)
- API路由和请求转发
- WebSocket连接管理
- 与权益引擎的通信

**关键依赖**:
```json
{
  "express": "最新版",
  "jsonwebtoken": "认证",
  "bcrypt": "密码哈希",
  "helmet": "安全头",
  "rate-limiter-flexible": "限流",
  "ws": "WebSocket"
}
```

### 2.2 权益解释器引擎 (Go 或 Rust)

**选择**: **Go** (推荐，生态成熟，性能优秀)

**职责**:
- 实时解析和执行智能权益规则
- 毫秒级规则判定
- 资产账本核心逻辑

**框架**:
- **Gin** (Go Web框架) 或 **gRPC** (高性能RPC)
- 使用 **protobuf** 与其他服务通信

**核心模块**:
```go
// 伪代码示例
type RightsEngine struct {
    RuleExecutor  *Executor
    AssetLedger   *Ledger
}

func (e *RightsEngine) EvaluateRule(arkID, assetID, ruleID) bool {
    // 时效熔断检查
    // 阶梯递减计算
    // 行为激励验证
}
```

### 2.3 AI代理层 (Python + FastAPI)

**框架**: **FastAPI** (异步高性能)

**职责**:
- 统一AI模型调用接口
- Token计量和扣费
- 调用OpenAI、Anthropic、本地模型等
- 与Ark账本交互

**关键依赖**:
```python
fastapi
uvicorn[standard]
openai  # OpenAI SDK
anthropic  # Claude SDK
httpx  # 异步HTTP客户端
pydantic  # 数据验证
```

### 2.4 区块链适配层 (TypeScript)

**框架**: ethers.js 或 viem

**职责** (轻度集成):
- 将关键操作日志哈希上链 (审计追溯)
- 生成权益凭证的链上证明
- 未来为Phase 2预留接口

**推荐链**: Polygon (低Gas费) 或 Arbitrum

---

## 三、数据库技术栈

### 3.1 主数据库

**PostgreSQL** 15+

**用途**:
- 用户账户、Ark数据
- 资产库存 (Asset Vault)
- 项目绑定关系
- 权益规则定义

**关键表设计**:
```sql
-- Ark表
CREATE TABLE arks (
    ark_id UUID PRIMARY KEY,
    owner_id UUID,
    parent_ark_id UUID,  -- 支持父子Ark
    created_at TIMESTAMP,
    metadata JSONB
);

-- 资产账本 (多维结构)
CREATE TABLE asset_ledger (
    ledger_id UUID PRIMARY KEY,
    ark_id UUID,
    asset_sku VARCHAR,
    balance DECIMAL,
    source_provider VARCHAR,
    rights_rules JSONB[],  -- 关联的权益规则
    expire_at TIMESTAMP
);

-- 权益规则定义
CREATE TABLE rights_templates (
    rule_id UUID PRIMARY KEY,
    rule_type VARCHAR,  -- 'time-fuse', 'decay', 'pow'
    rule_logic JSONB,
    created_by UUID
);
```

### 3.2 缓存层

**Redis** 7+

**用途**:
- Session管理
- 权益规则热数据缓存
- API限流计数器
- 实时资产流事件队列

### 3.3 时序数据库

**TimescaleDB** (PostgreSQL扩展)

**用途**:
- API调用日志 (Consumption Log)
- 资产消耗历史
- 用于分析和生成"影子汇率"

---

## 四、AI和模型集成

### 4.1 AI SDK集成

**直接集成的模型**:
- **OpenAI** (gpt-4, gpt-3.5-turbo)
- **Anthropic** (claude-3.5-sonnet)
- **本地模型** (Ollama, LM Studio)

**Token计量方案**:
- 使用 `tiktoken` (OpenAI) 或模型自带tokenizer
- 实时记录输入/输出token数
- 按权益规则计算实际扣费

### 4.2 Agent框架 (可选)

**LangChain** 或 **AutoGPT**
- 如果需要构建复杂Agent能力
- 集成工具调用 (Tool Invocation)

---

## 五、开发工具链

### 5.1 版本控制

- **Git** + **GitHub**
- 分支策略: `main` (生产), `develop` (开发), `feature/*` (功能)

### 5.2 包管理器

- **前端**: `pnpm` (快速、节省空间)
- **后端 (Node.js)**: `pnpm`
- **Python**: `poetry` 或 `pip` + `venv`
- **Go**: 内置 `go mod`

### 5.3 代码质量

**Linters & Formatters**:
- **TypeScript**: ESLint + Prettier
- **Python**: Black + Flake8 + mypy
- **Go**: gofmt + golangci-lint

**Pre-commit Hooks**:
- **husky** + **lint-staged** (自动格式化)

### 5.4 测试框架

- **前端**: Vitest + React Testing Library
- **后端 (Node.js)**: Jest 或 Vitest
- **Python**: pytest + pytest-asyncio
- **Go**: 内置 `testing` + `testify`

### 5.5 API文档

- **Swagger/OpenAPI** (自动生成API文档)
- **Postman** 或 **Insomnia** (API测试)

---

## 六、DevOps和部署

### 6.1 容器化

**Docker** + **Docker Compose**

示例 `docker-compose.yml`:
```yaml
version: '3.8'
services:
  api-gateway:
    build: ./services/api-gateway
    ports: ["3000:3000"]

  rights-engine:
    build: ./services/rights-engine
    ports: ["8080:8080"]

  ai-proxy:
    build: ./services/ai-proxy
    ports: ["8000:8000"]

  postgres:
    image: timescale/timescaledb:latest-pg15
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  redis:
    image: redis:7-alpine
```

### 6.2 CI/CD

- **GitHub Actions** (推荐)
  - 自动化测试
  - Electron应用打包 (Windows/Mac/Linux)
  - Docker镜像构建

### 6.3 监控和日志

- **日志**: Winston (Node.js) + Loguru (Python)
- **监控**: Prometheus + Grafana (可选)
- **错误追踪**: Sentry

---

## 七、安全架构

### 7.1 密钥管理

- **本地**: Electron的 `safeStorage` API
- **服务端**: **HashiCorp Vault** 或 **AWS Secrets Manager**
- 绝不在前端暴露API Key

### 7.2 认证授权

- **JWT** + **Refresh Token** 机制
- 支持 OAuth 2.0 (GitHub, Google SSO)

### 7.3 API安全

- **Helmet.js** (安全HTTP头)
- **Rate Limiting** (防DDoS)
- **HTTPS Only**
- **CORS** 配置

---

## 八、区块链集成 (轻度)

### 8.1 技术选型

**链**: Polygon PoS 或 Arbitrum One (低成本)

**库**:
- **ethers.js** (TypeScript)
- **Web3.py** (Python)

### 8.2 Phase 1用途

仅用于:
- 关键操作日志的哈希存证
- 权益凭证的Merkle证明
- 不涉及复杂智能合约

**示例代码**:
```typescript
import { ethers } from 'ethers';

async function logToChain(operationHash: string) {
  const provider = new ethers.JsonRpcProvider(POLYGON_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // 简单的存证合约调用
  const tx = await auditContract.logHash(operationHash);
  await tx.wait();
  return tx.hash;
}
```

---

## 九、开发流程建议

### Phase 1 里程碑

#### Milestone 1: 核心基础 (4-6周)
- Electron应用框架搭建
- 用户认证系统
- 基础Ark数据模型
- 简单的Dashboard UI

#### Milestone 2: 资产与权益 (6-8周)
- 资产SKU管理
- 权益解释器引擎 (Go)
- 5种核心权益实现 (时效、递减、PoW、信用、项目绑定)
- Marketplace界面

#### Milestone 3: AI集成 (4-6周)
- AI Proxy服务
- API网关和转发
- Token计量和扣费
- Project绑定和消耗

#### Milestone 4: 运营功能 (4周)
- 供应商后台
- 中间商分发系统
- 消耗熔断和报警

---

## 十、推荐的项目结构

```
synscale/
├── apps/
│   └── desktop/              # Electron应用
│       ├── src/
│       │   ├── main/         # 主进程
│       │   └── renderer/     # 前端React应用
│       └── package.json
│
├── services/
│   ├── api-gateway/          # Node.js API网关
│   ├── rights-engine/        # Go 权益引擎
│   ├── ai-proxy/             # Python AI代理
│   └── blockchain-adapter/   # TypeScript 区块链适配器
│
├── packages/
│   ├── shared-types/         # 共享TypeScript类型
│   ├── rights-sdk/           # 权益规则SDK
│   └── ui-components/        # 共享UI组件库
│
├── infra/
│   ├── docker/               # Docker配置
│   └── k8s/                  # Kubernetes配置(可选)
│
├── docs/                     # 文档
└── scripts/                  # 工具脚本
```

---

## 总结

这个技术栈兼顾了:
- ✅ **快速开发**: TypeScript生态成熟
- ✅ **高性能**: Go处理核心权益逻辑
- ✅ **AI友好**: Python无缝集成AI服务
- ✅ **可扩展**: 微服务架构,易于横向扩展
- ✅ **安全性**: 多层加密和权限控制
- ✅ **未来兼容**: 预留了向区块链迁移的接口

下一步建议: 查看 `DEVELOPMENT-TOOLS.md` 了解具体的开发工具和插件清单。
