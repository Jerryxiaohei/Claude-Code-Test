#!/usr/bin/env node
/**
 * Simple Filesystem MCP Server for SynScale
 * Provides read-only access to project files
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import path from "path";

const PROJECT_ROOT = process.argv[2] || process.cwd();

const server = new Server(
  {
    name: "synscale-filesystem",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义工具列表
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "read_file",
      description: "读取项目中的文件内容",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "相对于项目根目录的文件路径",
          },
        },
        required: ["path"],
      },
    },
    {
      name: "list_directory",
      description: "列出目录中的文件和文件夹",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "相对于项目根目录的目录路径（默认为根目录）",
          },
        },
      },
    },
    {
      name: "search_files",
      description: "在项目中搜索文件名",
      inputSchema: {
        type: "object",
        properties: {
          pattern: {
            type: "string",
            description: "文件名搜索模式（支持通配符）",
          },
        },
        required: ["pattern"],
      },
    },
  ],
}));

// 实现工具调用
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "read_file") {
      const filePath = path.join(PROJECT_ROOT, args.path);
      const content = await fs.readFile(filePath, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    }

    if (name === "list_directory") {
      const dirPath = path.join(PROJECT_ROOT, args.path || "");
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const list = entries.map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? "directory" : "file",
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(list, null, 2),
          },
        ],
      };
    }

    if (name === "search_files") {
      const pattern = args.pattern.toLowerCase();
      const results = await searchFiles(PROJECT_ROOT, pattern);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
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

// 辅助函数：递归搜索文件
async function searchFiles(dir, pattern, results = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(PROJECT_ROOT, fullPath);

      if (entry.isDirectory()) {
        // 跳过 node_modules 等大目录
        if (!["node_modules", ".git", "dist", "build"].includes(entry.name)) {
          await searchFiles(fullPath, pattern, results);
        }
      } else {
        if (entry.name.toLowerCase().includes(pattern)) {
          results.push(relativePath);
        }
      }
    }
  } catch (error) {
    // 忽略权限错误等
  }
  return results;
}

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("SynScale Filesystem MCP Server running...");
