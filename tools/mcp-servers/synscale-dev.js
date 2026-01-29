#!/usr/bin/env node
/**
 * SynScale Development Helper MCP Server
 * Provides utilities for SynScale project development
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import path from "path";

const PROJECT_ROOT = process.env.PROJECT_ROOT || "C:\\Users\\abc\\Claude-Code-Test";

const server = new Server(
  {
    name: "synscale-dev",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义开发辅助工具
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_project_structure",
      description: "获取SynScale项目的目录结构概览",
      inputSchema: {
        type: "object",
        properties: {
          depth: {
            type: "number",
            description: "目录深度（默认为2）",
            default: 2,
          },
        },
      },
    },
    {
      name: "get_tech_stack_info",
      description: "获取项目技术栈信息和已安装的工具",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "check_dependencies",
      description: "检查项目依赖是否已安装",
      inputSchema: {
        type: "object",
        properties: {
          service: {
            type: "string",
            description: "要检查的服务（api-gateway, rights-engine, ai-proxy, desktop）",
          },
        },
      },
    },
    {
      name: "read_docs",
      description: "读取项目文档内容",
      inputSchema: {
        type: "object",
        properties: {
          doc_name: {
            type: "string",
            description: "文档名称（TECH-STACK, DEVELOPMENT-TOOLS, MCP-SETUP, PROJECT-INIT）",
          },
        },
        required: ["doc_name"],
      },
    },
  ],
}));

// 实现工具调用
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_project_structure") {
      const depth = args.depth || 2;
      const structure = await getDirectoryTree(PROJECT_ROOT, depth);
      return {
        content: [
          {
            type: "text",
            text: `SynScale项目结构:\n\n${structure}`,
          },
        ],
      };
    }

    if (name === "get_tech_stack_info") {
      const info = await getTechStackInfo();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(info, null, 2),
          },
        ],
      };
    }

    if (name === "check_dependencies") {
      const result = await checkDependencies(args.service);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    }

    if (name === "read_docs") {
      const docPath = path.join(PROJECT_ROOT, "docs", `${args.doc_name}.md`);
      const content = await fs.readFile(docPath, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 辅助函数
async function getDirectoryTree(dir, maxDepth, currentDepth = 0, prefix = "") {
  if (currentDepth >= maxDepth) return "";

  let result = "";
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const filtered = entries.filter(
      (e) => !["node_modules", ".git", "dist", "build", "venv"].includes(e.name)
    );

    for (let i = 0; i < filtered.length; i++) {
      const entry = filtered[i];
      const isLast = i === filtered.length - 1;
      const marker = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");

      result += `${prefix}${marker}${entry.name}${entry.isDirectory() ? "/" : ""}\n`;

      if (entry.isDirectory() && currentDepth < maxDepth - 1) {
        const subDir = path.join(dir, entry.name);
        result += await getDirectoryTree(subDir, maxDepth, currentDepth + 1, nextPrefix);
      }
    }
  } catch (error) {
    result += `${prefix}[Error reading directory]\n`;
  }
  return result;
}

async function getTechStackInfo() {
  const info = {
    installed_tools: {},
    project_info: {},
  };

  // 检查已安装工具
  try {
    const { execSync } = await import("child_process");

    const checks = {
      node: "node --version",
      npm: "npm --version",
      pnpm: "pnpm --version",
      python: "python --version",
      git: "git --version",
      typescript: "tsc --version",
    };

    for (const [tool, cmd] of Object.entries(checks)) {
      try {
        const version = execSync(cmd, { encoding: "utf-8" }).trim();
        info.installed_tools[tool] = version;
      } catch {
        info.installed_tools[tool] = "Not installed";
      }
    }

    // 读取package.json
    try {
      const pkgPath = path.join(PROJECT_ROOT, "package.json");
      const pkg = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
      info.project_info = {
        name: pkg.name,
        version: pkg.version,
        scripts: pkg.scripts,
      };
    } catch {
      info.project_info = "No package.json found";
    }
  } catch (error) {
    info.error = error.message;
  }

  return info;
}

async function checkDependencies(service) {
  if (!service) {
    return "Please specify a service: api-gateway, rights-engine, ai-proxy, or desktop";
  }

  const servicePaths = {
    "api-gateway": "services/api-gateway",
    "rights-engine": "services/rights-engine",
    "ai-proxy": "services/ai-proxy",
    desktop: "apps/desktop",
  };

  const servicePath = path.join(PROJECT_ROOT, servicePaths[service]);

  try {
    await fs.access(servicePath);

    // 检查package.json或go.mod
    if (service === "rights-engine") {
      const goModPath = path.join(servicePath, "go.mod");
      try {
        const content = await fs.readFile(goModPath, "utf-8");
        return `✅ Go module initialized\n\n${content}`;
      } catch {
        return "❌ Go module not initialized. Run: go mod init";
      }
    } else {
      const pkgPath = path.join(servicePath, "package.json");
      try {
        const pkg = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
        return `✅ Dependencies configured\n\nPackage: ${pkg.name}\nVersion: ${pkg.version}`;
      } catch {
        return `❌ package.json not found in ${servicePath}`;
      }
    }
  } catch {
    return `❌ Service directory not found: ${servicePath}\n\nPlease run project initialization first.`;
  }
}

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("SynScale Dev Helper MCP Server running...");
