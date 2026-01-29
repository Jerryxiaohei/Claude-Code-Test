# SynScale 开发工具和插件清单

> 完整的开发环境配置指南,涵盖工具安装、VS Code插件、Claude Code集成

---

## 一、必装软件清单

### 1.1 基础开发工具

| 工具 | 版本 | 下载地址 | 用途 | 验证命令 |
|------|------|---------|------|---------|
| **Node.js** | 20 LTS+ | https://nodejs.org/ | 前端和Node.js后端 | `node --version` |
| **Python** | 3.11+ | https://python.org/ | AI Proxy服务 | `python --version` |
| **Go** | 1.21+ | https://go.dev/ | 权益引擎 | `go version` |
| **Git** | 最新版 | https://git-scm.com/ | 版本控制 | `git --version` |
| **Docker Desktop** | 最新版 | https://docker.com/ | 容器化开发 | `docker --version` |

### 1.2 数据库工具

| 工具 | 用途 | 下载地址 |
|------|------|---------|
| **PostgreSQL** | 主数据库 | https://postgresql.org/download/ |
| **Redis** | 缓存层 | https://redis.io/download (或用Docker) |
| **pgAdmin** | 数据库管理GUI | https://pgadmin.org/ |
| **RedisInsight** | Redis可视化工具 | https://redis.com/redis-enterprise/redis-insight/ |

### 1.3 API开发和测试

| 工具 | 用途 | 下载地址 |
|------|------|---------|
| **Postman** | API测试和文档 | https://postman.com/ |
| **或 Insomnia** | 轻量级API客户端 | https://insomnia.rest/ |

---

## 二、VS Code 扩展插件

### 2.1 核心开发插件

#### 必装插件 (Essential)

```json
{
  "recommendations": [
    // === 基础增强 ===
    "dbaeumer.vscode-eslint",           // ESLint
    "esbenp.prettier-vscode",           // Prettier
    "editorconfig.editorconfig",        // EditorConfig

    // === TypeScript/JavaScript ===
    "ms-vscode.vscode-typescript-next", // TypeScript最新支持

    // === React开发 ===
    "dsznajder.es7-react-js-snippets",  // React代码片段
    "formulahendry.auto-rename-tag",     // HTML标签自动重命名

    // === Python开发 ===
    "ms-python.python",                  // Python官方插件
    "ms-python.vscode-pylance",          // Pylance类型检查
    "ms-python.black-formatter",         // Black格式化

    // === Go开发 ===
    "golang.go",                         // Go官方插件

    // === Git ===
    "eamodio.gitlens",                   // Git增强
    "mhutchie.git-graph",                // Git图形化

    // === Docker ===
    "ms-azuretools.vscode-docker",       // Docker支持

    // === 数据库 ===
    "mtxr.sqltools",                     // SQL工具
    "mtxr.sqltools-driver-pg",           // PostgreSQL驱动

    // === 实用工具 ===
    "streetsidesoftware.code-spell-checker",  // 拼写检查
    "wayou.vscode-todo-highlight",            // TODO高亮
    "aaron-bond.better-comments",             // 增强注释
    "usernamehw.errorlens",                   // 错误提示增强
    "christian-kohler.path-intellisense",     // 路径智能提示
    "gruntfuggly.todo-tree",                  // TODO树视图

    // === Markdown ===
    "yzhang.markdown-all-in-one",        // Markdown增强
    "bierner.markdown-mermaid",          // Mermaid图表

    // === TailwindCSS ===
    "bradlc.vscode-tailwindcss",         // Tailwind智能提示

    // === API开发 ===
    "humao.rest-client"                  // REST Client
  ]
}
```

### 2.2 可选但推荐的插件

```json
{
  "recommendations": [
    // === 主题和图标 ===
    "github.github-vscode-theme",        // GitHub主题
    "pkief.material-icon-theme",         // Material图标

    // === 效率提升 ===
    "vscodevim.vim",                     // Vim模式(如果习惯)
    "eamodio.gitlens",                   // Git超级增强
    "ritwickdey.liveserver",             // 静态页面预览

    // === 协作 ===
    "ms-vsliveshare.vsliveshare"         // 实时协作
  ]
}
```

### 2.3 区块链开发插件(轻度集成需要)

```json
{
  "recommendations": [
    "juanblanco.solidity",               // Solidity语法支持(如果写智能合约)
    "nomic-foundation.hardhat-solidity"  // Hardhat框架支持
  ]
}
```

---

## 三、全局npm包安装

```bash
# 包管理器
npm install -g pnpm

# TypeScript工具链
npm install -g typescript ts-node

# 代码质量
npm install -g eslint prettier

# 开发工具
npm install -g nodemon          # 自动重启Node服务
npm install -g concurrently     # 并行运行多个命令
npm install -g npm-check-updates # 依赖更新检查

# Electron开发
npm install -g electron         # Electron CLI

# 前端工具
npm install -g vite             # 现代构建工具

# 实用工具
npm install -g http-server      # 简单HTTP服务器
```

---

## 四、Python环境配置

### 4.1 虚拟环境创建

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Unix/MacOS
source venv/bin/activate
```

### 4.2 核心Python包

```bash
# Web框架
pip install fastapi uvicorn[standard]

# AI SDK
pip install openai anthropic

# 区块链
pip install web3

# 数据库
pip install sqlalchemy alembic psycopg2-binary asyncpg
pip install redis

# 工具库
pip install python-dotenv pydantic httpx

# 开发工具
pip install pytest pytest-asyncio black flake8 mypy

# Token计量
pip install tiktoken  # OpenAI tokenizer
```

或使用 `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

## 五、Go环境配置

### 5.1 Go依赖管理

```bash
# 初始化Go模块
go mod init github.com/yourname/synscale-rights-engine

# 安装核心依赖
go get github.com/gin-gonic/gin              # Web框架
go get github.com/go-redis/redis/v9          # Redis客户端
go get gorm.io/gorm                          # ORM
go get gorm.io/driver/postgres               # PostgreSQL驱动
go get github.com/golang-jwt/jwt/v5          # JWT
go get github.com/joho/godotenv              # 环境变量
go get github.com/stretchr/testify           # 测试库
```

---

## 六、Docker Compose 开发环境

创建 `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: synscale
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: synscale_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  redis-commander:
    image: rediscommander/redis-commander:latest
    ports:
      - "8081:8081"
    environment:
      REDIS_HOSTS: local:redis:6379

volumes:
  postgres_data:
  redis_data:
```

启动开发环境:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

---

## 七、VS Code 配置文件

### 7.1 项目设置 (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },

  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true
  },

  "[go]": {
    "editor.formatOnSave": true
  },

  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],

  "files.associations": {
    "*.css": "tailwindcss"
  },

  "sqltools.connections": [
    {
      "name": "SynScale Dev",
      "driver": "PostgreSQL",
      "server": "localhost",
      "port": 5432,
      "database": "synscale_dev",
      "username": "synscale",
      "password": "dev_password"
    }
  ]
}
```

### 7.2 推荐扩展 (`.vscode/extensions.json`)

已在上方"VS Code扩展插件"部分提供。

### 7.3 调试配置 (`.vscode/launch.json`)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Electron: Main",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/apps/desktop",
      "runtimeExecutable": "${workspaceFolder}/apps/desktop/node_modules/.bin/electron",
      "args": ["."],
      "outputCapture": "std"
    },
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["main:app", "--reload"],
      "cwd": "${workspaceFolder}/services/ai-proxy"
    },
    {
      "name": "Go: Rights Engine",
      "type": "go",
      "request": "launch",
      "mode": "debug",
      "program": "${workspaceFolder}/services/rights-engine/main.go"
    }
  ]
}
```

---

## 八、环境变量配置

### 8.1 创建 `.env.example` 模板

```bash
# === 应用配置 ===
NODE_ENV=development
PORT=3000

# === 数据库 ===
DATABASE_URL=postgresql://synscale:dev_password@localhost:5432/synscale_dev
REDIS_URL=redis://localhost:6379

# === 安全 ===
JWT_SECRET=your-jwt-secret-change-in-production
ENCRYPTION_KEY=your-32-byte-encryption-key

# === AI服务 ===
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# === 区块链 ===
POLYGON_RPC_URL=https://polygon-rpc.com/
ETHERSCAN_API_KEY=your-api-key
BLOCKCHAIN_PRIVATE_KEY=0x...  # 仅用于测试,生产使用KMS

# === 外部服务 ===
GITHUB_CLIENT_ID=your-github-oauth-id
GITHUB_CLIENT_SECRET=your-github-oauth-secret
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

复制为实际使用的 `.env`:
```bash
cp .env.example .env
```

**⚠️ 重要**: 将 `.env` 添加到 `.gitignore`

---

## 九、代码质量工具配置

### 9.1 ESLint配置 (`.eslintrc.json`)

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### 9.2 Prettier配置 (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 9.3 Python配置 (`pyproject.toml`)

```toml
[tool.black]
line-length = 100
target-version = ['py311']

[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

---

## 十、Git配置

### 10.1 `.gitignore` 模板

```gitignore
# === Dependencies ===
node_modules/
venv/
__pycache__/
*.pyc
vendor/

# === Build outputs ===
dist/
build/
out/
*.egg-info/

# === Environment ===
.env
.env.local
.env.*.local

# === IDE ===
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.swp
*.swo

# === OS ===
.DS_Store
Thumbs.db

# === Logs ===
*.log
npm-debug.log*
logs/

# === Database ===
*.sqlite
*.db

# === Secrets ===
*.pem
*.key
secrets/
```

### 10.2 Husky预提交钩子

```bash
# 安装husky
pnpm add -D husky lint-staged

# 初始化husky
npx husky install

# 添加pre-commit钩子
npx husky add .husky/pre-commit "npx lint-staged"
```

`package.json` 中添加:
```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"],
    "*.py": ["black", "flake8"]
  }
}
```

---

## 十一、浏览器扩展

### 11.1 开发工具扩展

- **React Developer Tools** - 调试React应用
- **Redux DevTools** (如果使用Redux) - 状态调试

### 11.2 区块链扩展

- **MetaMask** - 以太坊钱包,测试区块链交互
- **Polygon Wallet** (可选)

---

## 十二、验证安装

创建一个验证脚本 `scripts/verify-setup.sh`:

```bash
#!/bin/bash

echo "🔍 验证开发环境..."

# 检查Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node --version)"
else
    echo "❌ Node.js 未安装"
fi

# 检查Python
if command -v python &> /dev/null; then
    echo "✅ Python $(python --version)"
else
    echo "❌ Python 未安装"
fi

# 检查Go
if command -v go &> /dev/null; then
    echo "✅ Go $(go version)"
else
    echo "❌ Go 未安装"
fi

# 检查Git
if command -v git &> /dev/null; then
    echo "✅ Git $(git --version)"
else
    echo "❌ Git 未安装"
fi

# 检查Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker $(docker --version)"
else
    echo "❌ Docker 未安装"
fi

# 检查pnpm
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm $(pnpm --version)"
else
    echo "⚠️  pnpm 未安装 (运行: npm install -g pnpm)"
fi

echo ""
echo "🎉 验证完成!"
```

运行验证:
```bash
bash scripts/verify-setup.sh
```

---

## 下一步

1. ✅ 安装所有必装软件
2. ✅ 配置VS Code插件
3. ✅ 启动Docker开发环境
4. 📖 查看 `MCP-SETUP.md` 配置Claude Code MCP服务器
5. 🚀 查看 `PROJECT-INIT.md` 初始化项目结构

---

## 故障排除

### Node.js版本管理

如果需要管理多个Node版本,推荐使用 **nvm**:
- Windows: https://github.com/coreybutler/nvm-windows
- Unix/MacOS: https://github.com/nvm-sh/nvm

### Python包安装慢

配置国内镜像:
```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### Go模块下载慢

配置代理:
```bash
go env -w GOPROXY=https://goproxy.cn,direct
```

### Docker Desktop权限问题

Windows用户需要:
1. 启用WSL 2
2. 以管理员身份运行Docker Desktop
