@echo off
echo ===============================================
echo   SynScale 开发环境验证脚本
echo ===============================================
echo.

echo [1/10] 检查 Node.js...
node --version 2>nul && echo     ✓ Node.js 已安装 || echo     ✗ Node.js 未安装
echo.

echo [2/10] 检查 npm...
npm --version 2>nul && echo     ✓ npm 已安装 || echo     ✗ npm 未安装
echo.

echo [3/10] 检查 pnpm...
pnpm --version 2>nul && echo     ✓ pnpm 已安装 || echo     ✗ pnpm 未安装
echo.

echo [4/10] 检查 Git...
git --version 2>nul && echo     ✓ Git 已安装 || echo     ✗ Git 未安装
echo.

echo [5/10] 检查 Python...
python --version 2>nul && echo     ✓ Python 已安装 || echo     ✗ Python 未安装
echo.

echo [6/10] 检查 TypeScript...
tsc --version 2>nul && echo     ✓ TypeScript 已安装 || echo     ✗ TypeScript 未安装
echo.

echo [7/10] 检查 GitHub CLI...
gh --version 2>nul && echo     ✓ GitHub CLI 已安装 || echo     ✗ GitHub CLI 未安装
echo.

echo [8/10] 检查 Docker...
docker --version 2>nul && echo     ✓ Docker 已安装 || echo     ✗ Docker 未安装 (可选)
echo.

echo [9/10] 检查 Go...
go version 2>nul && echo     ✓ Go 已安装 || echo     ✗ Go 未安装 (可选)
echo.

echo [10/10] 检查 MCP 服务器依赖...
if exist "tools\mcp-servers\node_modules" (
    echo     ✓ MCP 服务器依赖已安装
) else (
    echo     ✗ MCP 服务器依赖未安装
    echo       请运行: cd tools\mcp-servers ^&^& npm install
)
echo.

echo ===============================================
echo   Python 包检查
echo ===============================================
echo.

python -c "import fastapi; print('✓ FastAPI 已安装')" 2>nul || echo ✗ FastAPI 未安装
python -c "import openai; print('✓ OpenAI SDK 已安装')" 2>nul || echo ✗ OpenAI SDK 未安装
python -c "import anthropic; print('✓ Anthropic SDK 已安装')" 2>nul || echo ✗ Anthropic SDK 未安装
echo.

echo ===============================================
echo   验证完成
echo ===============================================
echo.
echo 提示：
echo - Docker 和 Go 为可选工具，可以稍后安装
echo - 如果缺少必要工具，请参考 docs/DEVELOPMENT-TOOLS.md
echo.

pause
