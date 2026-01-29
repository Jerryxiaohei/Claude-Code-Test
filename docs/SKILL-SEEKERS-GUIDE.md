# Skill Seekers 使用指南

> 🤖 将任何GitHub仓库、文档网站、PDF文件转化为Claude Code Skills

---

## 📚 目录

1. [什么是Skill Seekers](#什么是skill-seekers)
2. [核心功能](#核心功能)
3. [快速开始](#快速开始)
4. [详细使用教程](#详细使用教程)
5. [实战案例](#实战案例)
6. [最佳实践](#最佳实践)
7. [故障排除](#故障排除)

---

## 什么是Skill Seekers

**Skill Seekers** 是一个自动化工具，可以将开源项目、技术文档和PDF文件转换为Claude Code可以直接使用的Skills。

### 为什么需要它？

传统上，创建一个Claude Skill需要：
- 阅读大量文档
- 理解代码结构
- 手写SKILL.md文件
- 提取最佳实践
- **耗时：3-6小时**

使用Skill Seekers后：
- 提供GitHub仓库URL或文档网址
- AI自动分析代码和文档
- 自动生成专业的SKILL.md
- **耗时：20-40分钟** ✅

---

## 核心功能

### 1. 🐙 GitHub仓库分析
- **深度代码分析**：使用AST解析器分析代码结构
- **API提取**：自动提取函数、类、参数和返回类型
- **冲突检测**：发现文档和实际代码之间的不一致
- **多语言支持**：TypeScript, Python, Go, Java等

### 2. 📄 文档网站抓取
- **智能识别**：自动检测llms.txt文件（LLM专用文档索引）
- **主题分类**：自动按主题组织内容
- **增量抓取**：支持断点续传

### 3. 📑 PDF文档处理
- **文本提取**：从PDF中提取文本和代码
- **OCR支持**：处理扫描的PDF文档
- **密码PDF**：支持加密PDF文件
- **表格提取**：提取PDF中的表格数据

### 4. 🧠 AI增强
- **多模型支持**：Claude, Gemini, GPT-4o
- **本地处理**：无需API密钥也可基础分析
- **智能优化**：自动优化Skill质量

### 5. 📦 三流架构（Three-Stream）

Skill Seekers使用独特的三流分析架构：

```
┌─────────────────┐
│  Code Stream    │ → 代码模式、示例、最佳实践
├─────────────────┤
│  Docs Stream    │ → README、贡献指南、API文档
├─────────────────┤
│  Insight Stream │ → GitHub Issues、社区知识
└─────────────────┘
           ↓
    AI Analysis & Merge
           ↓
   Professional Skill
```

---

## 快速开始

### 安装状态

✅ **已安装**: Skill Seekers v2.7.2（包含所有功能）

**安装命令**（已执行）:
```bash
pip install "skill-seekers[all]"
```

### 第一次使用：配置GitHub访问

**步骤1：生成GitHub Token**

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置权限：
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (Read org and team membership)
4. 点击 "Generate token"
5. **复制token**（只显示一次！）

**步骤2：配置Skill Seekers**

运行配置向导：
```bash
skill-seekers config --github
```

按提示输入你的GitHub token。

**提示**：如果遇到编码问题，也可以手动创建配置文件。

---

## 详细使用教程

### 命令结构

```bash
skill-seekers <command> [options]
```

### 可用命令

| 命令 | 功能 | 适用场景 |
|------|------|----------|
| `config` | 配置GitHub token和API密钥 | 首次使用 |
| `github` | 分析GitHub仓库 | 想将开源项目转为Skill |
| `scrape` | 抓取文档网站 | 想从官方文档创建Skill |
| `pdf` | 处理PDF文件 | 有PDF格式的技术文档 |
| `unified` | 多源组合（GitHub+文档+PDF） | 需要全面分析 |
| `enhance` | AI增强Skill质量 | 提升Skill专业度 |
| `package` | 打包为.zip文件 | 准备上传到Claude |
| `upload` | 上传到Claude | 自动安装到`.claude/skills/` |
| `install` | 完整工作流（一键完成所有步骤） | 快速创建Skill |

---

## 实战案例

### 案例1：将React官方文档转为Skill

**场景**：你想让Claude帮你写React代码，需要一个React Skill。

**步骤**：

1. **分析React仓库**
```bash
skill-seekers github --repo facebook/react --name react
```

这会：
- Clone React仓库
- 分析所有React API
- 提取组件模式
- 生成Skill文件

2. **增强Skill质量**
```bash
skill-seekers enhance output/react/
```

3. **上传到Claude**
```bash
skill-seekers upload output/react.zip
```

4. **使用Skill**
在Claude Code中直接说：
```
"用React创建一个带动画的Dashboard组件"
```

Claude会自动调用react skill！

---

### 案例2：将FastAPI文档转为Skill

**场景**：你在用Python的FastAPI框架，想要一个FastAPI Skill。

**步骤**：

1. **创建配置文件**（可选）

创建 `configs/fastapi.json`：
```json
{
  "base_url": "https://fastapi.tiangolo.com",
  "output_dir": "output/fastapi",
  "name": "fastapi",
  "max_pages": 500,
  "rate_limit": 10
}
```

2. **抓取文档**
```bash
skill-seekers scrape --config configs/fastapi.json
```

3. **组合GitHub代码分析**
```bash
skill-seekers github --repo tiangolo/fastapi --name fastapi
```

4. **合并为统一Skill**
```bash
skill-seekers unified --config configs/fastapi_unified.json
```

5. **上传**
```bash
skill-seekers upload output/fastapi.zip
```

---

### 案例3：将Prisma ORM转为Skill（适合SynScale）

**场景**：SynScale项目使用Prisma作为ORM，创建一个Prisma Skill可以帮助生成数据库代码。

**一键完成**：
```bash
skill-seekers install --repo prisma/prisma --name prisma-orm
```

这个命令会自动：
1. ✅ Clone仓库
2. ✅ 分析代码
3. ✅ 抓取文档
4. ✅ AI增强
5. ✅ 打包
6. ✅ 上传到Claude

**使用**：
```
"用Prisma创建用户和订单的数据库模型"
```

---

### 案例4：将Electron文档转为Skill（适合SynScale）

**场景**：SynScale使用Electron构建桌面应用。

**步骤**：

```bash
# 方法1：从GitHub分析
skill-seekers github --repo electron/electron --name electron

# 方法2：从官方文档抓取
skill-seekers scrape --url https://www.electronjs.org/docs/latest/ --name electron

# 方法3：组合（推荐）
skill-seekers unified \
  --repo electron/electron \
  --docs-url https://www.electronjs.org/docs/latest/ \
  --name electron
```

**使用场景**：
```
"用Electron创建一个带系统托盘的桌面应用"
"如何在Electron中实现进程间通信（IPC）"
```

---

## 高级功能

### 1. 批量处理

创建一个shell脚本 `batch-convert.sh`（在Windows上使用Git Bash）：

```bash
#!/bin/bash

# 为SynScale项目批量创建Skills

repos=(
  "prisma/prisma"
  "electron/electron"
  "expressjs/express"
  "gin-gonic/gin"
  "fastapi/fastapi"
  "tailwindlabs/tailwindcss"
  "framer/motion"
)

for repo in "${repos[@]}"; do
  name=$(echo $repo | cut -d'/' -f2)
  echo "Converting $repo to skill: $name"
  skill-seekers install --repo $repo --name $name
done

echo "All skills created!"
```

运行：
```bash
bash batch-convert.sh
```

---

### 2. 从PDF创建Skill

**场景**：你有一本技术书的PDF。

```bash
skill-seekers pdf \
  --file "path/to/technical-book.pdf" \
  --name "book-skill" \
  --enable-ocr  # 如果是扫描版PDF
```

---

### 3. 多语言模型增强

默认使用Anthropic的Claude，但你也可以用其他模型：

**使用Gemini**：
```bash
# 设置环境变量
export GOOGLE_API_KEY="your-gemini-key"

# 增强
skill-seekers enhance output/react/ --model gemini-2.0-flash
```

**使用GPT-4**：
```bash
export OPENAI_API_KEY="your-openai-key"

skill-seekers enhance output/react/ --model gpt-4o
```

---

### 4. 断点续传

如果抓取过程中断（网络问题、超时等），可以恢复：

```bash
skill-seekers resume output/react/
```

---

### 5. 估算抓取时间

在开始抓取前，先估算需要多久：

```bash
skill-seekers estimate --url https://docs.example.com
```

输出示例：
```
Estimated pages: ~350
Estimated time: 25-35 minutes
Recommended: --max-pages 500
```

---

## 最佳实践

### 1. 选择高质量的源

✅ **好的源**：
- 官方文档网站
- 活跃的GitHub仓库（1000+ stars）
- 完整的README和示例

❌ **避免**：
- 过时的项目（2年+未更新）
- 缺少文档的仓库
- 测试覆盖率低的项目

---

### 2. 为SynScale创建定制Skills

**推荐为SynScale创建的Skills**：

| Skill名称 | 源 | 用途 |
|-----------|-----|------|
| `prisma-orm` | github.com/prisma/prisma | 数据库ORM |
| `electron` | github.com/electron/electron | 桌面应用 |
| `express-api` | github.com/expressjs/express | API网关 |
| `gin-framework` | github.com/gin-gonic/gin | Go Rights Engine |
| `fastapi` | github.com/fastapi/fastapi | Python AI Proxy |
| `tailwindcss` | github.com/tailwindlabs/tailwindcss | UI样式 |
| `framer-motion` | github.com/framer/motion | UI动画 |
| `react-query` | github.com/tanstack/query | 数据获取 |
| `timescaledb` | docs.timescale.com | 时序数据库 |
| `polygon-sdk` | docs.polygon.technology | 区块链集成 |

**创建命令**（复制粘贴即可）：
```bash
skill-seekers install --repo prisma/prisma --name prisma-orm &
skill-seekers install --repo electron/electron --name electron &
skill-seekers install --repo expressjs/express --name express-api &
skill-seekers install --repo gin-gonic/gin --name gin-framework &
skill-seekers install --repo fastapi/fastapi --name fastapi &
skill-seekers install --repo tailwindlabs/tailwindcss --name tailwindcss &
skill-seekers install --repo framer/motion --name framer-motion &
skill-seekers install --repo TanStack/query --name react-query &
wait
echo "All SynScale skills created!"
```

---

### 3. 组织你的Skills

推荐目录结构：

```
.claude/
└── skills/
    ├── synscale-init-project/      # 你创建的
    ├── synscale-database-design/   # 你创建的
    ├── synscale-api-generator/     # 你创建的
    ├── synscale-ui-generator/      # 你创建的
    ├── synscale-rights-rules/      # 你创建的
    ├── synscale-testing/           # 你创建的
    ├── prisma-orm/                 # Skill Seekers创建
    ├── electron/                   # Skill Seekers创建
    ├── express-api/                # Skill Seekers创建
    └── ...
```

---

### 4. Skill命名约定

- **项目特定**：`synscale-*`（你手动创建的6个Skills）
- **通用技术**：`technology-name`（Skill Seekers创建的）
- **避免冲突**：确保名称唯一

---

### 5. 定期更新Skills

开源项目经常更新，定期重新生成Skills：

```bash
# 每月更新一次
skill-seekers install --repo facebook/react --name react --force
```

---

## 与自定义Skills对比

### 你手动创建的6个Skills (SynScale专属)

| Skill | 类型 | 优势 |
|-------|------|------|
| synscale-init-project | 自定义 | 完全按SynScale架构定制 |
| synscale-database-design | 自定义 | 包含SynScale特定的表设计 |
| synscale-api-generator | 自定义 | 遵循SynScale API规范 |
| synscale-ui-generator | 自定义 | 工业科幻设计风格 |
| synscale-rights-rules | 自定义 | 5种智能权益规则实现 |
| synscale-testing | 自定义 | 针对SynScale的测试策略 |

### Skill Seekers创建的Skills (通用技术)

| Skill | 类型 | 优势 |
|-------|------|------|
| prisma-orm | Skill Seekers | 通用Prisma知识，保持最新 |
| electron | Skill Seekers | Electron官方最佳实践 |
| fastapi | Skill Seekers | FastAPI完整API参考 |

**组合使用才是最强的**：

```
"用synscale-database-design Skill创建数据库schema，
 然后用prisma-orm Skill生成Prisma迁移文件"
```

Claude会智能组合两个Skills的知识！

---

## 故障排除

### 问题1：GitHub API速率限制

**错误**：
```
Error: GitHub API rate limit exceeded
```

**解决方案**：
1. 确保已配置GitHub token（未配置时限制60请求/小时，配置后5000请求/小时）
2. 配置多个GitHub账户轮换：
```bash
skill-seekers config --github
# 添加第二个token
```

---

### 问题2：编码错误

**错误**：
```
'gbk' codec can't encode character
```

**解决方案**：
在PowerShell中运行前设置编码：
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001
```

或者在Git Bash中运行命令（推荐）。

---

### 问题3：网络超时

**错误**：
```
Timeout while scraping https://...
```

**解决方案**：
1. 降低速率限制：
```bash
skill-seekers scrape --url https://example.com --rate-limit 5
```

2. 使用断点续传：
```bash
skill-seekers resume output/project-name/
```

---

### 问题4：内存不足

**错误**：
```
MemoryError: Unable to allocate array
```

**解决方案**：
1. 限制页面数量：
```bash
skill-seekers scrape --url https://example.com --max-pages 300
```

2. 分批处理：
```bash
# 先处理文档
skill-seekers scrape --url https://example.com --name project

# 再处理代码
skill-seekers github --repo org/project --name project
```

---

### 问题5：Skill没有被Claude识别

**原因**：Skill未正确安装到`.claude/skills/`目录。

**解决方案**：
```bash
# 手动安装
skill-seekers install-agent output/project-name/

# 或者重新上传
skill-seekers upload output/project-name.zip
```

验证安装：
```bash
ls ~/.claude/skills/
# 或在Windows上
dir %USERPROFILE%\.claude\skills\
```

---

## 命令速查表

### 常用命令

```bash
# 配置
skill-seekers config --github          # 配置GitHub token
skill-seekers config --show            # 查看当前配置
skill-seekers config --test            # 测试连接

# 单一源创建Skill
skill-seekers github --repo org/repo --name skill-name
skill-seekers scrape --url https://docs.example.com --name skill-name
skill-seekers pdf --file document.pdf --name skill-name

# 多源组合
skill-seekers unified --config config.json

# 增强和打包
skill-seekers enhance output/skill-name/
skill-seekers package output/skill-name/
skill-seekers upload output/skill-name.zip

# 一键完成
skill-seekers install --repo org/repo --name skill-name

# 恢复中断
skill-seekers resume output/skill-name/
```

---

## 高级配置

### 创建配置文件模板

创建 `configs/template.json`：

```json
{
  "name": "project-name",
  "base_url": "https://docs.example.com",
  "output_dir": "output/project-name",

  "max_pages": 500,
  "rate_limit": 10,
  "timeout": 30,

  "github_repo": "org/repo",
  "github_branch": "main",

  "exclude_patterns": [
    "*/changelog/*",
    "*/blog/*",
    "*/legacy/*"
  ],

  "include_patterns": [
    "*/api/*",
    "*/guide/*",
    "*/tutorial/*"
  ],

  "enhancement": {
    "enabled": true,
    "model": "claude-sonnet-4-5",
    "focus_areas": [
      "api_reference",
      "code_examples",
      "best_practices"
    ]
  },

  "package": {
    "auto_upload": true,
    "create_backup": true
  }
}
```

使用：
```bash
skill-seekers unified --config configs/template.json
```

---

## 社区资源

### 官方资源

- **GitHub**: https://github.com/yusufkaraaslan/Skill_Seekers
- **文档**: https://skillseekersweb.com/
- **示例配置**: https://github.com/yusufkaraaslan/Skill_Seekers/tree/main/configs

### 社区Skills市场

- **SkillsMP**: https://skillsmp.com/
- **Awesome Claude Skills**: https://github.com/ComposioHQ/awesome-claude-skills

### 其他Repo2Skill工具

- **repo-to-claude-skill** (GUI版本): https://github.com/Adjusted-left636/repo-to-claude-skill
  - 适合不熟悉命令行的用户
  - 提供Streamlit界面
  - 支持批量处理

---

## 总结

### 为什么Skill Seekers很重要？

1. **节省时间**：20分钟 vs 3-6小时
2. **保持更新**：轻松跟踪开源项目的更新
3. **扩展能力**：将任何技术栈转化为Claude Skills
4. **提升质量**：AI自动优化Skill结构

### 下一步行动

#### 立即开始（推荐）：

**为SynScale创建核心技术Skills**：

```bash
# 1. 配置GitHub访问（首次）
skill-seekers config --github

# 2. 批量创建SynScale需要的Skills
skill-seekers install --repo prisma/prisma --name prisma-orm
skill-seekers install --repo electron/electron --name electron
skill-seekers install --repo expressjs/express --name express-api
skill-seekers install --repo gin-gonic/gin --name gin-framework
skill-seekers install --repo fastapi/fastapi --name fastapi

# 3. 创建前端相关Skills
skill-seekers install --repo tailwindlabs/tailwindcss --name tailwindcss
skill-seekers install --repo framer/motion --name framer-motion

# 完成后，在Claude Code中测试：
# "用Prisma创建一个User模型"
# "用Electron创建主窗口"
```

#### 探索更多：

- 浏览 SkillsMP.com 发现社区优秀Skills
- 为你喜欢的开源项目创建Skills
- 分享你的Skills到社区

---

## 常见问题（FAQ）

### Q1: Skill Seekers和手动创建Skills哪个更好？

**A**: 各有优势，组合使用最佳：

- **手动创建**：适合项目特定逻辑（如SynScale的6个Skills）
- **Skill Seekers**：适合通用技术栈（如Prisma, React, FastAPI）

### Q2: 生成的Skills质量如何？

**A**: 非常高！Skill Seekers使用：
- AST解析器（准确理解代码）
- 三流架构（代码+文档+社区知识）
- AI增强（优化结构和内容）

建议开启AI增强以获得最佳质量。

### Q3: 需要付费API吗？

**A**: 不一定：
- **基础功能**：无需API密钥（本地分析）
- **AI增强**：需要Anthropic/OpenAI/Google API密钥

### Q4: 支持私有仓库吗？

**A**: 支持！只要配置的GitHub token有权限访问。

### Q5: 可以创建多语言Skill吗？

**A**: 可以！Skill Seekers支持：
- TypeScript/JavaScript
- Python
- Go
- Java
- Rust
- C++
- 更多...

### Q6: Skills会冲突吗？

**A**: 不会。Claude智能地选择合适的Skills，也可以组合多个Skills的知识。

---

## 支持

遇到问题？

1. 查看本指南的"故障排除"章节
2. 访问官方文档：https://skillseekersweb.com/
3. GitHub Issues：https://github.com/yusufkaraaslan/Skill_Seekers/issues
4. 或在Claude Code中直接问我！

---

**准备好将整个开源世界转化为你的Skills了吗？** 🚀

```bash
# 开始你的第一个Skill转换
skill-seekers install --repo facebook/react --name react
```

**享受无代码开发的乐趣！** 🎉
