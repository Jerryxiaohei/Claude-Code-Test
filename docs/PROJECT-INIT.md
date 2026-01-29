# SynScale 项目初始化指南

> 从零开始搭建完整的项目结构

---

## 前置检查

在开始之前，确认以下已完成:

- ✅ 阅读了产品需求文档（PRD）
- ✅ 查看了技术栈规划（TECH-STACK.md）
- ✅ 安装了所有必要工具（DEVELOPMENT-TOOLS.md）
- ✅ 配置了MCP服务器（MCP-SETUP.md）

---

## 一、项目结构创建

### 1.1 创建目录结构

在项目根目录运行以下命令:

```bash
cd Claude-Code-Test

# 创建顶层目录
mkdir -p apps services packages infra docs scripts tools

# 创建应用目录
mkdir -p apps/desktop/src/main
mkdir -p apps/desktop/src/renderer

# 创建服务目录
mkdir -p services/api-gateway/src
mkdir -p services/rights-engine/cmd services/rights-engine/pkg
mkdir -p services/ai-proxy/app
mkdir -p services/blockchain-adapter/src

# 创建共享包目录
mkdir -p packages/shared-types/src
mkdir -p packages/rights-sdk/src
mkdir -p packages/ui-components/src

# 创建基础设施目录
mkdir -p infra/docker
mkdir -p infra/k8s

# 创建工具目录
mkdir -p tools/mcp-servers
mkdir -p scripts/setup scripts/dev scripts/deploy
```

### 1.2 完整目录树

```
Claude-Code-Test/
├── apps/
│   └── desktop/                    # Electron桌面应用
│       ├── src/
│       │   ├── main/               # 主进程
│       │   │   ├── index.ts
│       │   │   ├── ipc.ts          # IPC通信
│       │   │   └── store.ts        # 本地存储
│       │   └── renderer/           # 渲染进程(React)
│       │       ├── src/
│       │       │   ├── App.tsx
│       │       │   ├── pages/      # 页面组件
│       │       │   ├── components/ # UI组件
│       │       │   ├── hooks/      # React Hooks
│       │       │   ├── store/      # 状态管理
│       │       │   └── utils/
│       │       ├── index.html
│       │       └── vite.config.ts
│       ├── package.json
│       └── electron-builder.json
│
├── services/
│   ├── api-gateway/                # Node.js API网关
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── controllers/
│   │   │   └── utils/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── rights-engine/              # Go权益引擎
│   │   ├── cmd/
│   │   │   └── main.go
│   │   ├── pkg/
│   │   │   ├── engine/             # 核心引擎
│   │   │   ├── rules/              # 规则实现
│   │   │   ├── ledger/             # 账本逻辑
│   │   │   └── api/                # API接口
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── ai-proxy/                   # Python AI代理
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── routers/
│   │   │   ├── services/           # AI服务封装
│   │   │   ├── models/
│   │   │   └── utils/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   └── blockchain-adapter/         # TypeScript区块链适配器
│       ├── src/
│       │   ├── index.ts
│       │   ├── contracts/
│       │   ├── clients/
│       │   └── utils/
│       ├── package.json
│       └── Dockerfile
│
├── packages/
│   ├── shared-types/               # 共享TypeScript类型
│   │   ├── src/
│   │   │   ├── ark.ts
│   │   │   ├── asset.ts
│   │   │   ├── rights.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── rights-sdk/                 # 权益规则SDK
│   │   ├── src/
│   │   │   ├── rules/
│   │   │   ├── executor.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ui-components/              # 共享UI组件库
│       ├── src/
│       │   ├── components/
│       │   ├── styles/
│       │   └── index.ts
│       └── package.json
│
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   └── docker-compose.dev.yml
│   └── k8s/                        # Kubernetes配置(可选)
│
├── docs/                           # 文档(已存在)
│   ├── TECH-STACK.md
│   ├── DEVELOPMENT-TOOLS.md
│   ├── MCP-SETUP.md
│   └── PROJECT-INIT.md
│
├── scripts/
│   ├── setup/
│   │   ├── install-deps.sh
│   │   └── setup-db.sh
│   ├── dev/
│   │   ├── start-all.sh
│   │   └── watch.sh
│   └── deploy/
│
├── tools/
│   └── mcp-servers/                # 自定义MCP服务器
│       ├── synscale-api.js
│       └── blockchain.js
│
├── .gitignore
├── .env.example
├── pnpm-workspace.yaml             # pnpm工作区配置
├── package.json
└── README.md
```

---

## 二、初始化各子项目

### 2.1 创建根package.json（Monorepo）

```bash
cd Claude-Code-Test
pnpm init
```

编辑 `package.json`:

```json
{
  "name": "synscale-monorepo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"pnpm run dev:desktop\" \"pnpm run dev:api\" \"pnpm run dev:ai\"",
    "dev:desktop": "pnpm --filter desktop dev",
    "dev:api": "pnpm --filter api-gateway dev",
    "dev:ai": "pnpm --filter ai-proxy dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

### 2.2 配置pnpm工作区

创建 `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'services/*'
  - 'packages/*'
```

### 2.3 初始化Electron应用

```bash
cd apps
pnpm create vite desktop --template react-ts
cd desktop
pnpm add -D electron electron-builder vite-plugin-electron
pnpm add electron-store
```

编辑 `apps/desktop/package.json`:

```json
{
  "name": "desktop",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && electron-builder"
  }
}
```

### 2.4 初始化Node.js API网关

```bash
cd services/api-gateway
pnpm init
pnpm add express cors helmet jsonwebtoken bcrypt
pnpm add -D @types/express @types/cors typescript ts-node nodemon
pnpm add -D @types/jsonwebtoken @types/bcrypt
```

创建 `services/api-gateway/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 2.5 初始化Go权益引擎

```bash
cd services/rights-engine
go mod init github.com/yourname/synscale/rights-engine

# 安装依赖
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/postgres
go get github.com/go-redis/redis/v9
```

### 2.6 初始化Python AI代理

```bash
cd services/ai-proxy
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 创建requirements.txt
cat > requirements.txt << EOF
fastapi==0.109.0
uvicorn[standard]==0.27.0
openai==1.10.0
anthropic==0.15.0
httpx==0.26.0
pydantic==2.5.0
python-dotenv==1.0.0
tiktoken==0.5.2
EOF

pip install -r requirements.txt
```

---

## 三、数据库初始化

### 3.1 启动Docker数据库环境

创建 `infra/docker/docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    container_name: synscale-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: synscale
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: synscale_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    container_name: synscale-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: synscale-redis-ui
    ports:
      - "8081:8081"
    environment:
      REDIS_HOSTS: local:redis:6379

volumes:
  postgres_data:
  redis_data:
```

启动:
```bash
cd infra/docker
docker-compose -f docker-compose.dev.yml up -d
```

### 3.2 创建数据库表结构

创建 `infra/docker/init-db.sql`:

```sql
-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ark表
CREATE TABLE arks (
    ark_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    parent_ark_id UUID REFERENCES arks(ark_id),
    ark_type VARCHAR(50) DEFAULT 'personal',  -- personal, team, distributor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- 资产账本
CREATE TABLE asset_ledger (
    ledger_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ark_id UUID REFERENCES arks(ark_id),
    asset_sku VARCHAR(100) NOT NULL,  -- 如 'gpt4-token'
    balance DECIMAL(20, 4) NOT NULL DEFAULT 0,
    source_provider VARCHAR(100),
    rights_rules JSONB[],  -- 关联的权益规则ID数组
    expire_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 权益规则模板
CREATE TABLE rights_templates (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_type VARCHAR(50) NOT NULL,  -- 'time-fuse', 'decay', 'pow', etc.
    rule_name VARCHAR(200),
    rule_logic JSONB NOT NULL,  -- 规则参数
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 项目表
CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(200) NOT NULL,
    owner_ark_id UUID REFERENCES arks(ark_id),
    description TEXT,
    github_repo VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 消耗日志(使用TimescaleDB)
CREATE TABLE consumption_logs (
    log_id UUID DEFAULT uuid_generate_v4(),
    ark_id UUID REFERENCES arks(ark_id),
    project_id UUID REFERENCES projects(project_id),
    asset_sku VARCHAR(100),
    amount DECIMAL(20, 4),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- 转为时序表
SELECT create_hypertable('consumption_logs', 'timestamp');

-- 创建索引
CREATE INDEX idx_arks_owner ON arks(owner_id);
CREATE INDEX idx_ledger_ark ON asset_ledger(ark_id);
CREATE INDEX idx_projects_owner ON projects(owner_ark_id);
CREATE INDEX idx_logs_ark_time ON consumption_logs(ark_id, timestamp DESC);
```

### 3.3 验证数据库

```bash
# 连接数据库
psql -h localhost -U synscale -d synscale_dev

# 查看表
\dt

# 退出
\q
```

---

## 四、环境变量配置

### 4.1 创建 `.env.example`

```bash
# === 应用配置 ===
NODE_ENV=development
API_PORT=3000
AI_PROXY_PORT=8000
RIGHTS_ENGINE_PORT=8080

# === 数据库 ===
DATABASE_URL=postgresql://synscale:dev_password@localhost:5432/synscale_dev
REDIS_URL=redis://localhost:6379

# === 安全 ===
JWT_SECRET=your-jwt-secret-change-me
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-byte-encryption-key-change-me

# === AI服务 ===
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_ORG_ID=org-...

# === 区块链(轻度集成) ===
POLYGON_RPC_URL=https://polygon-rpc.com/
BLOCKCHAIN_PRIVATE_KEY=0x...  # 仅测试用
ETHERSCAN_API_KEY=your-etherscan-key

# === OAuth ===
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

# === 外部服务 ===
SENTRY_DSN=  # 可选,错误追踪
```

### 4.2 复制为实际环境文件

```bash
cp .env.example .env
```

**⚠️ 重要**: 编辑 `.env` 填入真实的API密钥。

---

## 五、编写启动脚本

### 5.1 创建开发启动脚本

`scripts/dev/start-all.sh`:

```bash
#!/bin/bash

echo "🚀 启动SynScale开发环境..."

# 启动数据库
echo "📦 启动数据库容器..."
cd infra/docker
docker-compose -f docker-compose.dev.yml up -d
cd ../..

# 等待数据库就绪
echo "⏳ 等待数据库启动..."
sleep 5

# 启动后端服务
echo "🔧 启动后端服务..."
concurrently \
  "pnpm --filter api-gateway dev" \
  "cd services/rights-engine && go run cmd/main.go" \
  "cd services/ai-proxy && uvicorn app.main:app --reload --port 8000" \
  "pnpm --filter desktop dev"

echo "✅ 所有服务已启动!"
echo "🌐 访问 http://localhost:3000"
```

赋予执行权限:
```bash
chmod +x scripts/dev/start-all.sh
```

### 5.2 Windows启动脚本

`scripts/dev/start-all.bat`:

```batch
@echo off
echo Starting SynScale Development Environment...

echo Starting database...
cd infra\docker
docker-compose -f docker-compose.dev.yml up -d
cd ..\..

echo Waiting for database...
timeout /t 5 /nobreak

echo Starting services...
start cmd /k "pnpm --filter api-gateway dev"
start cmd /k "cd services\rights-engine && go run cmd\main.go"
start cmd /k "cd services\ai-proxy && venv\Scripts\activate && uvicorn app.main:app --reload"
start cmd /k "pnpm --filter desktop dev"

echo All services started!
```

---

## 六、初始代码示例

### 6.1 API网关示例 (`services/api-gateway/src/index.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Ark路由
app.get('/api/arks/:arkId', (req, res) => {
  res.json({
    ark_id: req.params.arkId,
    balance: 10000,
    // TODO: 从数据库查询
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});
```

### 6.2 Python AI Proxy示例 (`services/ai-proxy/app/main.py`)

```python
from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os

app = FastAPI(title="SynScale AI Proxy")

openai.api_key = os.getenv("OPENAI_API_KEY")

class ChatRequest(BaseModel):
    model: str = "gpt-3.5-turbo"
    messages: list
    ark_id: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-proxy"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    # TODO: 1. 验证Ark余额
    # TODO: 2. 调用模型
    # TODO: 3. 扣除Token

    response = openai.chat.completions.create(
        model=request.model,
        messages=request.messages
    )

    return {
        "response": response.choices[0].message.content,
        "usage": response.usage.model_dump()
    }
```

### 6.3 Go权益引擎示例 (`services/rights-engine/cmd/main.go`)

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    r := gin.Default()

    r.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status":  "ok",
            "service": "rights-engine",
        })
    })

    // 权益规则评估接口
    r.POST("/api/rights/evaluate", func(c *gin.Context) {
        // TODO: 实现权益解释器逻辑
        c.JSON(http.StatusOK, gin.H{
            "allowed": true,
            "computed_amount": 100,
        })
    })

    r.Run(":8080")
}
```

---

## 七、验证项目设置

### 7.1 运行健康检查

```bash
# 启动所有服务
bash scripts/dev/start-all.sh

# 测试API网关
curl http://localhost:3000/health

# 测试AI Proxy
curl http://localhost:8000/health

# 测试Rights Engine
curl http://localhost:8080/health
```

### 7.2 预期输出

```json
{"status":"ok","service":"api-gateway"}
{"status":"ok","service":"ai-proxy"}
{"status":"ok","service":"rights-engine"}
```

---

## 八、下一步开发建议

### Phase 1 - Milestone 1 (核心基础)
1. 完善用户认证系统 (JWT)
2. 实现Ark CRUD操作
3. 搭建基础Dashboard UI

### Phase 1 - Milestone 2 (权益系统)
1. 实现5种核心权益规则
2. 开发权益解释器引擎
3. 构建Marketplace界面

### Phase 1 - Milestone 3 (AI集成)
1. 完善AI Proxy Token计量
2. 实现API调用网关
3. 开发Project绑定逻辑

---

## 九、开发工作流

### 典型开发流程

1. **启动环境**:
   ```bash
   bash scripts/dev/start-all.sh
   ```

2. **使用Claude Code开发**:
   ```
   "Claude,帮我实现时效熔断权益规则"
   "Claude,查询arks表的结构"
   "Claude,测试权益规则的执行逻辑"
   ```

3. **提交代码**:
   ```bash
   git add .
   git commit -m "feat: implement time-fuse rights rule"
   git push
   ```

4. **运行测试**:
   ```bash
   pnpm test
   ```

---

## 十、常见问题

### Q1: 端口冲突怎么办?
修改 `.env` 文件中的端口配置。

### Q2: Docker容器无法启动?
检查Docker Desktop是否运行,运行 `docker ps` 查看状态。

### Q3: Go依赖下载慢?
配置Go代理: `go env -w GOPROXY=https://goproxy.cn,direct`

### Q4: Python虚拟环境激活失败?
Windows使用 `venv\Scripts\activate`，Unix使用 `source venv/bin/activate`。

---

## 总结

🎉 恭喜! 你已经完成了SynScale项目的初始化。

**现在你可以**:
- ✅ 启动完整的开发环境
- ✅ 使用Claude Code进行AI辅助开发
- ✅ 访问数据库和调试工具
- ✅ 开始实现核心功能

**建议的学习路径**:
1. 先实现一个简单的Ark创建和查询功能
2. 再实现一个基础的权益规则
3. 逐步完善整个系统

祝开发顺利! 🚀
