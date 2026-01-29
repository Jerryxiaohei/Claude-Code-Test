# 🎯 SynScale Agent Skills 使用指南

> **无代码开发**：通过自然语言命令完成整个项目开发

---

## 📚 概述

我已经为你创建了**6个强大的Agent Skills**，让你可以用简单的自然语言指令完成SynScale的全栈开发，**无需手写代码**！

---

## ✨ 可用的Skills列表

| Skill名称 | 功能 | 触发词 |
|-----------|------|--------|
| **synscale-init-project** | 初始化项目结构、安装依赖 | "初始化项目", "setup project" |
| **synscale-database-design** | 设计数据库schema、生成ORM模型 | "创建数据库", "database schema" |
| **synscale-api-generator** | 生成RESTful API端点 | "创建API", "generate API" |
| **synscale-ui-generator** | 生成React组件和UI界面 | "创建UI", "build dashboard" |
| **synscale-rights-rules** | 实现5种智能权益规则 | "实现权益规则", "smart rights" |
| **synscale-testing** | 生成测试代码 | "写测试", "test coverage" |

---

## 🚀 快速开始

### Step 1: Skills已自动加载

这些Skills已经创建在 `.claude/skills/` 目录中，Claude Code会自动识别并加载它们。

### Step 2: 开始使用

只需用**自然语言**告诉我你想做什么！

---

## 💬 使用示例

### 🏗️ 示例1：初始化整个项目

**你说**：
```
"初始化SynScale项目结构，创建所有服务的目录和配置文件"
```

**我会做**：
1. 创建完整的目录结构（apps/, services/, packages/, etc.）
2. 初始化API Gateway (Node.js + Express)
3. 初始化Rights Engine (Go)
4. 初始化AI Proxy (Python + FastAPI)
5. 初始化Desktop App (Electron + React)
6. 安装所有依赖
7. 创建monorepo配置文件

**结果**：完整的项目骨架已就绪！✅

---

### 🗄️ 示例2：设计数据库

**你说**：
```
"为SynScale创建PostgreSQL数据库schema，包括Arks、Asset Ledger、Rights Templates和Projects表"
```

**我会做**：
1. 生成完整的SQL migration文件
2. 创建所有表（arks, asset_ledger, rights_templates, projects, consumption_logs）
3. 添加索引和外键约束
4. 配置TimescaleDB hypertable
5. 生成Prisma schema（TypeScript）
6. 生成SQLAlchemy models（Python）
7. 运行migration（如果数据库可用）

**结果**：数据库完全设计好，ORM模型已生成！✅

---

### 🔌 示例3：创建API端点

**你说**：
```
"为Ark资源创建完整的CRUD API，包括获取余额的端点"
```

**我会做**：
1. 生成路由文件 (`routes/arks.ts`)
2. 生成控制器 (`controllers/ArkController.ts`)
3. 创建验证中间件
4. 添加认证
5. 注册路由到主应用
6. 生成OpenAPI文档
7. 提供测试用的curl命令

**结果**：完整的API端点已上线！✅

---

### 🎨 示例4：构建UI界面

**你说**：
```
"创建Dashboard页面，包括Asset Vault和Rights Controller组件"
```

**我会做**：
1. 生成Dashboard.tsx页面
2. 创建ArkVault组件（显示资产余额）
3. 创建RightsController组件（显示活跃权益）
4. 创建支持组件（CircularProgress, AssetStream）
5. 应用工业科幻风格设计
6. 添加Framer Motion动画
7. 集成到路由

**结果**：精美的Dashboard已完成！✅

---

### 🔐 示例5：实现智能权益规则

**你说**：
```
"实现Time-Fuse权益规则，资产在7天内未使用自动失效"
```

**我会做**：
1. 创建TimeFuseRight类型定义
2. 实现Go语言的评估器
3. 创建后台任务检查过期
4. 添加API端点
5. 生成测试用例
6. 创建示例使用文档

**结果**：时效熔断规则已实现并测试通过！✅

---

### 🧪 示例6：生成测试

**你说**：
```
"为Ark API生成完整的测试套件，包括单元测试和集成测试"
```

**我会做**：
1. 生成单元测试（所有controller方法）
2. 生成集成测试（数据库操作）
3. 创建测试fixtures（模拟数据）
4. 配置测试环境
5. 运行测试并报告覆盖率

**结果**：完整测试套件已就绪，覆盖率>80%！✅

---

## 🎭 组合使用Skills

你可以一次性完成多个任务！

### 场景：从零开始构建Ark管理功能

**你说**：
```
"我想完整实现Ark管理功能：
1. 设计Ark相关的数据库表
2. 创建Ark的CRUD API
3. 构建Ark管理UI界面
4. 生成所有测试"
```

**我会自动调用**：
1. `synscale-database-design` → 创建数据库表
2. `synscale-api-generator` → 生成API
3. `synscale-ui-generator` → 构建UI
4. `synscale-testing` → 生成测试

**结果**：完整的Ark管理功能栈已完成！✅

---

## 🌟 高级用法

### 迭代开发

**第一次**：
```
"创建基础的Dashboard UI"
```

**修改**：
```
"在Dashboard中添加实时资产流动画"
```

**优化**：
```
"优化Dashboard性能，添加虚拟滚动"
```

每次我都会在现有代码基础上增量更新！

---

### 自定义需求

**你说**：
```
"创建一个特殊的权益规则：团队共享额度，每个成员每天限额1000 credits"
```

**我会**：
1. 分析需求
2. 设计新的TeamQuotaRight类型
3. 实现评估逻辑
4. 创建API
5. 生成测试

---

## 📖 完整开发流程示例

### Phase 1：环境和基础（第1周）

```
[你] "初始化SynScale项目结构"
[我] ✅ 项目初始化完成

[你] "创建PostgreSQL数据库schema"
[我] ✅ 数据库设计完成

[你] "生成种子数据用于测试"
[我] ✅ 测试数据已创建
```

### Phase 2：核心API（第2-3周）

```
[你] "创建Ark的完整CRUD API"
[我] ✅ Ark API已生成

[你] "创建Asset Ledger的API"
[我] ✅ Asset Ledger API已生成

[你] "创建Rights Templates的API"
[我] ✅ Rights API已生成

[你] "为所有API生成测试"
[我] ✅ 测试套件已完成
```

### Phase 3：智能权益（第4-6周）

```
[你] "实现所有5种智能权益规则"
[我] ✅ 5种规则全部实现

[你] "创建权益规则的管理界面"
[我] ✅ 管理UI已创建

[你] "添加权益规则的E2E测试"
[我] ✅ E2E测试已生成
```

### Phase 4：用户界面（第7-9周）

```
[你] "创建完整的Dashboard界面"
[我] ✅ Dashboard已完成

[你] "创建Marketplace界面"
[我] ✅ Marketplace已完成

[你] "创建Project管理界面"
[我] ✅ Project管理已完成
```

### Phase 5：AI集成（第10-12周）

```
[你] "创建AI Proxy服务，支持OpenAI和Claude"
[我] ✅ AI Proxy已实现

[你] "实现Token计量和扣费逻辑"
[我] ✅ 计量系统已完成

[你] "创建AI聊天的UI界面"
[我] ✅ 聊天界面已完成
```

---

## 🎯 Skills的能力边界

### ✅ Skills可以做：

- 生成完整的代码文件
- 创建项目结构
- 设计数据库schema
- 实现业务逻辑
- 生成测试
- 配置开发环境
- 优化现有代码
- 修复bug
- 添加新功能

### ❌ Skills不能做（需要你手动）：

- 获取真实的API密钥（需要你从OpenAI/Anthropic获取）
- 部署到生产环境（需要你配置云服务）
- 设计商业策略（这是你的产品决策）
- 与真实用户沟通

---

## 💡 最佳实践

### 1. 明确你的需求

❌ **模糊**："做个界面"
✅ **清晰**："创建Dashboard页面，显示3种资产类型的圆形进度条"

### 2. 分步骤进行

❌ **一次太多**："完成整个项目"
✅ **分步骤**："先初始化项目" → "再创建数据库" → "然后生成API"

### 3. 验证每一步

✅ "运行测试看看API是否正常工作"
✅ "启动开发服务器预览UI"

### 4. 迭代优化

✅ "这个UI看起来不错，但能让卡片圆角更大吗？"
✅ "API响应太慢，帮我优化查询"

---

## 🐛 故障排除

### 问题：Skill没有被触发

**解决方案**：
- 使用更明确的触发词（见Skills列表）
- 例如："创建数据库schema"比"数据库"更明确

### 问题：生成的代码有错误

**解决方案**：
- 告诉我具体的错误信息
- 我会分析并修复

### 问题：想修改生成的代码

**解决方案**：
- 直接说出你想要的改变
- 例如："把这个按钮改成紫色"

---

## 🎓 学习资源

### 了解更多关于Skills

- **Claude Skills官方文档**: https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview
- **Skills语法**: 查看`.claude/skills/*/SKILL.md`文件
- **创建自定义Skills**: 参考现有Skills的结构

### 了解SynScale技术栈

- 查看 `docs/TECH-STACK.md`
- 查看 `docs/DEVELOPMENT-TOOLS.md`
- 阅读产品PRD文档

---

## 🚀 开始你的无代码开发之旅

现在你已经了解了所有Skills，可以开始了！

### 第一步：初始化项目

```
"Claude，帮我初始化SynScale项目结构"
```

### 第二步：跟着感觉走

```
"现在创建数据库schema"
"接下来生成Ark的API"
"然后创建Dashboard界面"
...
```

### 我会一步步引导你！

每完成一个任务，我会建议下一步做什么。你只需要：

1. 📝 告诉我你想要什么
2. ✅ 验证结果
3. 🔄 如果需要，要求修改
4. 🎉 完成后进入下一步

---

## 🎊 总结

通过这6个Skills，你可以：

- ✅ **无需手写代码**完成全栈开发
- ✅ **自然语言交互**，像和开发团队聊天一样
- ✅ **快速迭代**，几分钟完成以往需要几小时的工作
- ✅ **专注产品**，把时间花在设计和决策上
- ✅ **AI辅助**，充分利用Claude Code的能力

**你的角色**：产品经理和架构师
**我的角色**：全栈开发工程师

让我们一起构建SynScale吧！🚀

---

**准备好了吗？试试第一个命令：**

```
"Claude，帮我初始化SynScale项目结构"
```

我会立即开始工作！💪
