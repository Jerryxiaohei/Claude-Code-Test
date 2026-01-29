# Claude Code MCP 服务器配置指南

> MCP (Model Context Protocol) 让Claude Code能够访问本地资源、数据库和外部服务,极大增强开发效率

---

## 什么是MCP?

**MCP (Model Context Protocol)** 是Anthropic开发的协议,允许AI助手(如Claude Code)通过标准化接口访问:
- 本地文件系统
- 数据库(PostgreSQL, Redis等)
- 外部API
- 自定义工具

对于SynScale项目,MCP可以帮助:
- 直接查询数据库结构和数据
- 读取配置文件和日志
- 调用本地开发服务器
- 访问区块链节点

---

## 一、推荐的MCP服务器

### 1.1 核心MCP服务器(强烈推荐)

#### 1. Filesystem MCP
**用途**: 访问项目文件和目录

**安装**:
```bash
npx @modelcontextprotocol/server-filesystem
```

**配置** (在Claude Code设置中):
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\abc\\Claude-Code-Test"
      ]
    }
  }
}
```

**能力**:
- 读取源代码
- 搜索文件
- 分析项目结构

---

#### 2. PostgreSQL MCP
**用途**: 直接查询和管理PostgreSQL数据库

**安装**:
```bash
npm install -g @modelcontextprotocol/server-postgres
```

**配置**:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "mcp-server-postgres",
      "args": ["postgresql://synscale:dev_password@localhost:5432/synscale_dev"]
    }
  }
}
```

**使用场景**:
- 查看Ark账本数据结构
- 调试权益规则查询
- 生成SQL迁移脚本

**示例提示词**:
```
"Claude,查询arks表中所有parent_ark_id不为空的记录"
"帮我设计asset_ledger表的索引优化方案"
```

---

#### 3. Git MCP
**用途**: 管理Git仓库操作

**安装**:
```bash
npm install -g @modelcontextprotocol/server-git
```

**配置**:
```json
{
  "mcpServers": {
    "git": {
      "command": "mcp-server-git",
      "args": ["--repository", "C:\\Users\\abc\\Claude-Code-Test"]
    }
  }
}
```

**能力**:
- 查看提交历史
- 创建分支
- 管理Pull Request

---

### 1.2 可选但有用的MCP服务器

#### 4. Docker MCP
**用途**: 管理Docker容器和镜像

```bash
npm install -g @modelcontextprotocol/server-docker
```

**配置**:
```json
{
  "mcpServers": {
    "docker": {
      "command": "mcp-server-docker"
    }
  }
}
```

**使用场景**:
- 查看运行中的服务状态
- 查看容器日志
- 重启开发环境

---

#### 5. Web Search MCP (可选)
**用途**: 搜索最新技术文档和资料

**注意**: Claude Code已内置Web搜索,此MCP可选

---

## 二、为SynScale定制MCP服务器

### 2.1 SynScale API MCP (自定义)

为本地开发服务器创建MCP,方便测试API。

**创建文件**: `tools/mcp-server-synscale-api.js`

```javascript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "http://localhost:3000";

const server = new Server({
  name: "synscale-api",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

// 定义工具: 查询Ark余额
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_ark_balance",
      description: "查询指定Ark的资产余额",
      inputSchema: {
        type: "object",
        properties: {
          ark_id: {
            type: "string",
            description: "Ark的UUID"
          }
        },
        required: ["ark_id"]
      }
    },
    {
      name: "test_rights_rule",
      description: "测试权益规则执行结果",
      inputSchema: {
        type: "object",
        properties: {
          rule_id: {
            type: "string",
            description: "权益规则ID"
          },
          ark_id: {
            type: "string",
            description: "Ark ID"
          },
          asset_amount: {
            type: "number",
            description: "资产数量"
          }
        },
        required: ["rule_id", "ark_id", "asset_amount"]
      }
    }
  ]
}));

// 实现工具调用
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_ark_balance") {
    const response = await axios.get(`${API_BASE}/api/arks/${args.ark_id}/balance`);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(response.data, null, 2)
      }]
    };
  }

  if (name === "test_rights_rule") {
    const response = await axios.post(`${API_BASE}/api/rights/test`, {
      rule_id: args.rule_id,
      ark_id: args.ark_id,
      asset_amount: args.asset_amount
    });
    return {
      content: [{
        type: "text",
        text: JSON.stringify(response.data, null, 2)
      }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**安装依赖**:
```bash
cd tools
npm init -y
npm install @modelcontextprotocol/sdk axios
```

**配置到Claude Code**:
```json
{
  "mcpServers": {
    "synscale-api": {
      "command": "node",
      "args": ["C:\\Users\\abc\\Claude-Code-Test\\tools\\mcp-server-synscale-api.js"]
    }
  }
}
```

**使用示例**:
```
"Claude,测试一下时效熔断权益规则对Ark 123的影响"
```

---

### 2.2 区块链MCP (轻度集成)

如果需要频繁查询链上数据:

**创建文件**: `tools/mcp-server-blockchain.js`

```javascript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ethers } from "ethers";

const POLYGON_RPC = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com/";
const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

const server = new Server({
  name: "blockchain",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_transaction",
      description: "查询交易详情",
      inputSchema: {
        type: "object",
        properties: {
          tx_hash: {
            type: "string",
            description: "交易哈希"
          }
        },
        required: ["tx_hash"]
      }
    },
    {
      name: "get_block",
      description: "查询区块信息",
      inputSchema: {
        type: "object",
        properties: {
          block_number: {
            type: "number",
            description: "区块高度"
          }
        },
        required: ["block_number"]
      }
    }
  ]
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_transaction") {
    const tx = await provider.getTransaction(args.tx_hash);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(tx, null, 2)
      }]
    };
  }

  if (name === "get_block") {
    const block = await provider.getBlock(args.block_number);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(block, null, 2)
      }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**配置**:
```json
{
  "mcpServers": {
    "blockchain": {
      "command": "node",
      "args": ["C:\\Users\\abc\\Claude-Code-Test\\tools\\mcp-server-blockchain.js"],
      "env": {
        "POLYGON_RPC_URL": "https://polygon-rpc.com/"
      }
    }
  }
}
```

---

## 三、完整的MCP配置示例

将以下内容添加到Claude Code的配置文件:

**Windows路径**: `%APPDATA%\Claude\claude_desktop_config.json`

**完整配置**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\abc\\Claude-Code-Test"
      ]
    },
    "postgres": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-postgres",
        "postgresql://synscale:dev_password@localhost:5432/synscale_dev"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-git",
        "--repository",
        "C:\\Users\\abc\\Claude-Code-Test"
      ]
    },
    "synscale-api": {
      "command": "node",
      "args": [
        "C:\\Users\\abc\\Claude-Code-Test\\tools\\mcp-server-synscale-api.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3000"
      }
    },
    "blockchain": {
      "command": "node",
      "args": [
        "C:\\Users\\abc\\Claude-Code-Test\\tools\\mcp-server-blockchain.js"
      ],
      "env": {
        "POLYGON_RPC_URL": "https://polygon-rpc.com/"
      }
    }
  }
}
```

---

## 四、验证MCP配置

### 4.1 重启Claude Code

配置完成后,重启Claude Code以加载MCP服务器。

### 4.2 测试MCP连接

与Claude对话测试:

```
"Claude,列出项目根目录下的所有文件"
```

```
"Claude,查询数据库中arks表的结构"
```

```
"Claude,查看最近5条Git提交记录"
```

如果MCP正常工作,Claude会使用相应的工具返回结果。

---

## 五、高级用法

### 5.1 多环境配置

为开发/测试/生产环境配置不同的MCP:

```json
{
  "mcpServers": {
    "postgres-dev": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost:5432/synscale_dev"
      ]
    },
    "postgres-staging": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-postgres",
        "postgresql://staging-server:5432/synscale_staging"
      ]
    }
  }
}
```

### 5.2 MCP调试

如果MCP无法连接,检查:

1. **命令路径**: 确保MCP服务器可执行文件存在
2. **权限**: Windows可能需要管理员权限
3. **网络**: 确保数据库服务正在运行
4. **日志**: 查看Claude Code的日志文件

启用调试模式:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres", "..."],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

---

## 六、最佳实践

### 6.1 安全建议

- ✅ 不要在MCP配置中硬编码生产环境密码
- ✅ 使用环境变量存储敏感信息
- ✅ 为MCP服务器设置只读权限(如果可能)
- ❌ 不要将Claude Code配置文件提交到Git

### 6.2 性能优化

- 为频繁查询的数据库创建专门的MCP
- 使用缓存减少重复查询
- 限制MCP返回的数据量

### 6.3 开发工作流

**典型对话流程**:
```
开发者: "Claude,我要实现时效熔断权益规则"

Claude: [通过filesystem MCP读取现有代码]
        [通过postgres MCP查看rights_templates表结构]
        "我看到你已经有了基础的权益表结构,让我帮你实现..."

开发者: "实现完成后,帮我测试一下"

Claude: [通过synscale-api MCP调用测试接口]
        "测试结果显示,过期资产已正确归零"
```

---

## 七、故障排除

### 问题1: MCP服务器无法启动

**可能原因**:
- Node.js版本不匹配
- 依赖包未安装

**解决方案**:
```bash
# 全局安装MCP包
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-git
```

### 问题2: 数据库MCP连接失败

**检查清单**:
- ✅ PostgreSQL服务是否运行?
- ✅ 连接字符串格式是否正确?
- ✅ 用户名密码是否正确?
- ✅ 防火墙是否阻止连接?

**测试连接**:
```bash
psql -h localhost -U synscale -d synscale_dev
```

### 问题3: 自定义MCP无响应

**调试步骤**:
1. 单独运行MCP脚本测试
2. 检查stdio输入输出格式
3. 查看Claude Code错误日志

---

## 八、下一步

1. ✅ 安装核心MCP服务器
2. ✅ 配置数据库MCP
3. ✅ 测试MCP连接
4. 📖 查看 `PROJECT-INIT.md` 开始项目初始化
5. 🚀 开始使用Claude Code进行开发!

---

## 参考资源

- **MCP官方文档**: https://modelcontextprotocol.io/
- **MCP服务器列表**: https://github.com/modelcontextprotocol/servers
- **Claude Code文档**: https://docs.claude.com/claude-code

---

**提示**: MCP是强大的工具,但记住它只是辅助。最终的架构决策和代码质量仍然取决于开发者的判断!
