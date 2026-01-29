# SynScale - AI智能体钱包平台

> **Genesis Ark (创世方舟)** - Phase 1
> 围绕AI算力和智能体Credits的智能资产集成与分发平台

---

## 🎯 项目愿景

SynScale 是一个基于 **Ark（智能容器）** 架构的AI原生经济体基础设施。

在第一阶段，SynScale定位为 **"智能资产的中央银行与可编程分发网络"**，解决AI产业链中的供需错配问题：
- **上游**: 云厂商有大量闲置算力/模型资源
- **下游**: 开发者缺乏低门槛获取资源的渠道
- **中间**: 缺乏精细化的权益控制手段

---

## 🧠 核心概念

### Ark (方舟容器)
不是传统钱包，而是一个**可编程账户**，记录资产的"数量"和"规则"。

### Smart Assets (智能资产)
标准化的AI资源，分为三大类：
- **基础设施**: 算力（GPU）、模型Token
- **数字劳动力**: Agent Credits、工具调用权
- **知识燃料**: 数据集、向量索引、实时信息流

### Smart Rights (智能权益)
附加在资产上的可执行规则：
- 🔥 **时效熔断**: 期限内未使用自动失效
- 📉 **阶梯递减**: 按使用量递减的补贴比例
- 💪 **行为激励**: 按研发行为（PoW）递增额度
- 🔗 **信用流转**: 中间商信用额度分发
- 🔒 **项目绑定**: 资产只能用于指定项目

### 源力 (℉) - Phase 2
RWA（真实世界资产）到IWA（智能世界资产）的通用结算单位。

---

## 📦 技术架构

### 混合架构设计

```
┌─────────────────────────────────┐
│   Electron Desktop App          │  ← React + TypeScript
│   (工业科幻风UI)                  │
└─────────────────────────────────┘
              ↕ HTTPS/WebSocket
┌─────────────────────────────────┐
│   Backend Services (微服务)      │
│                                 │
│   ├─ API Gateway (Node.js)      │  ← 认证、路由
│   ├─ Rights Engine (Go)         │  ← 高性能权益解释器
│   ├─ AI Proxy (Python)          │  ← AI模型调用网关
│   └─ Blockchain Adapter (TS)    │  ← 审计日志上链
└─────────────────────────────────┘
              ↕
┌─────────────────────────────────┐
│   PostgreSQL + Redis            │
│   + TimescaleDB (时序数据)       │
└─────────────────────────────────┘
```

### 技术栈

| 层次 | 技术选型 | 用途 |
|------|---------|------|
| **桌面端** | Electron + React + TypeScript | 跨平台桌面应用 |
| **API网关** | Node.js + Express | 用户认证、请求路由 |
| **权益引擎** | Go + Gin | 毫秒级规则判定 |
| **AI代理** | Python + FastAPI | 模型调用、Token计量 |
| **数据库** | PostgreSQL + TimescaleDB | 主数据 + 时序数据 |
| **缓存** | Redis | Session、热数据 |
| **区块链** | Polygon (轻度集成) | 审计存证 |

---

## 📚 文档导航

### 新手入门
1. 📖 **[技术栈规划](docs/TECH-STACK.md)** - 完整的技术架构说明
2. 🔧 **[开发工具清单](docs/DEVELOPMENT-TOOLS.md)** - 必装软件和VS Code插件
3. 🐳 **[Docker & Go安装指南](docs/INSTALL-DOCKER-GO.md)** - 容器环境和Go语言配置
4. 🤖 **[MCP服务器配置](docs/MCP-SETUP.md)** - Claude Code集成指南
5. 🚀 **[项目初始化](docs/PROJECT-INIT.md)** - 从零搭建项目结构

### 无代码开发
- 🎯 **[Agent Skills使用指南](SKILLS-GUIDE.md)** - 用自然语言完成开发
- 🤖 **[Skill Seekers指南](docs/SKILL-SEEKERS-GUIDE.md)** - 将任何开源项目转为Skills

### 产品文档
- [产品需求文档 (PRD)](SynScale_%20Smart%20Asset%20Integration%20and%20Distribution%20Platform%20PRD.docx)
- [平台规划书](SynScale%20Platform_%20Smart%20Asset%20and%20Rights%20Planning.docx)
- [智能资产与权益设计](Smart%20Asset%20Integration%20and%20Rights%20Design.docx)
- [源力经济学](Source%20Force%20Economics_%20RWA%20to%20IWA%20Conversion.docx)

---

## 🚀 快速开始

### 前置要求

- ✅ Node.js 20+
- ✅ Python 3.11+
- ✅ Go 1.21+
- ✅ Docker Desktop
- ✅ Git & GitHub CLI

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Jerryxiaohei/Claude-Code-Test.git
cd Claude-Code-Test

# 2. 安装依赖
pnpm install  # 或 npm install

# 3. 启动数据库
cd infra/docker
docker-compose -f docker-compose.dev.yml up -d

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的API密钥

# 5. 启动开发环境
bash scripts/dev/start-all.sh
```

### 访问应用

- 🌐 **API网关**: http://localhost:3000
- 🤖 **AI代理**: http://localhost:8000
- ⚙️ **权益引擎**: http://localhost:8080
- 🗄️ **Redis管理**: http://localhost:8081

---

## 🛠️ 开发工作流

### 使用Claude Code开发

1. 配置MCP服务器（见 [MCP-SETUP.md](docs/MCP-SETUP.md)）
2. 启动开发环境
3. 与Claude对话:
   ```
   "Claude,帮我实现时效熔断权益规则"
   "Claude,查询arks表的所有记录"
   "Claude,测试权益引擎的API"
   ```

### Git工作流

```bash
# 创建功能分支
git checkout -b feature/time-fuse-rights

# 提交代码
git add .
git commit -m "feat: implement time-fuse rights rule"

# 推送并创建PR
git push -u origin feature/time-fuse-rights
```

---

## 📅 开发路线图

### Phase 1 - Milestone 1: 核心基础 (4-6周)
- [x] 项目架构搭建
- [ ] 用户认证系统
- [ ] Ark CRUD操作
- [ ] 基础Dashboard UI

### Phase 1 - Milestone 2: 权益系统 (6-8周)
- [ ] 5种核心权益规则实现
- [ ] 权益解释器引擎
- [ ] Marketplace界面

### Phase 1 - Milestone 3: AI集成 (4-6周)
- [ ] AI Proxy服务
- [ ] API网关和转发
- [ ] Token计量和扣费

### Phase 1 - Milestone 4: 运营功能 (4周)
- [ ] 供应商后台
- [ ] 中间商分发系统
- [ ] 消耗熔断和报警

### Phase 2: 源力经济 (TBD)
- [ ] 区块链迁移
- [ ] 源力(℉)通证
- [ ] 去中心化治理

---

## 👥 用户画像

| 角色 | 核心需求 | SynScale价值 |
|------|---------|-------------|
| **供应商** | 去库存、防薅羊毛 | 将营销预算转化为带锁的智能权益 |
| **中间商** | 资源分发管理 | 提供信用额度和多级分发工具 |
| **开发者** | 低成本获取AI资源 | 一站式领取补贴，研发即挖矿 |

---

## 🤝 贡献指南

欢迎贡献代码、文档和想法！

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📄 许可证

MIT License

---

## 📞 联系方式

- **GitHub**: [@Jerryxiaohei](https://github.com/Jerryxiaohei)
- **项目仓库**: [Claude-Code-Test](https://github.com/Jerryxiaohei/Claude-Code-Test)

---

## ⭐ 支持项目

如果这个项目对你有帮助，请给个Star⭐！

---

**🚀 Built with Claude Code** - AI辅助开发的未来
