---
name: synscale-init-project
description: Initialize SynScale project structure with all necessary directories, dependencies, and configuration files. Use when user wants to set up the project from scratch or initialize a new service.
invocation: Use this skill when user mentions "initialize project", "setup project", "create project structure", "init synscale"
fork: subagent
---

# SynScale Project Initialization Skill

## Purpose
Automatically create the complete SynScale project structure, initialize all services, install dependencies, and configure the development environment.

## What This Skill Does

1. **Creates Directory Structure**
   - Creates apps/, services/, packages/, infra/ directories
   - Sets up service-specific subdirectories
   - Creates docs/, scripts/, tools/ folders

2. **Initializes Services**
   - API Gateway (Node.js + Express)
   - Rights Engine (Go)
   - AI Proxy (Python + FastAPI)
   - Desktop App (Electron + React)

3. **Installs Dependencies**
   - npm/pnpm dependencies for Node.js services
   - Python requirements for AI Proxy
   - Go modules for Rights Engine

4. **Creates Configuration Files**
   - package.json for monorepo
   - pnpm-workspace.yaml
   - tsconfig.json for TypeScript services
   - requirements.txt for Python
   - go.mod for Go

## Instructions

When user asks to initialize the project:

1. **Check Current State**
   - Verify we're in the project root (Claude-Code-Test)
   - Check if directories already exist (ask before overwriting)

2. **Create Directory Structure**
   ```bash
   mkdir -p apps/desktop/src/{main,renderer/src}
   mkdir -p services/{api-gateway,rights-engine,ai-proxy,blockchain-adapter}/src
   mkdir -p packages/{shared-types,rights-sdk,ui-components}/src
   mkdir -p infra/{docker,k8s}
   mkdir -p scripts/{setup,dev,deploy}
   ```

3. **Initialize API Gateway**
   ```bash
   cd services/api-gateway
   pnpm init
   pnpm add express cors helmet jsonwebtoken bcrypt
   pnpm add -D @types/express @types/cors typescript ts-node nodemon
   ```

4. **Initialize Rights Engine**
   ```bash
   cd services/rights-engine
   go mod init github.com/synscale/rights-engine
   go get github.com/gin-gonic/gin
   go get gorm.io/gorm gorm.io/driver/postgres
   ```

5. **Initialize AI Proxy**
   ```bash
   cd services/ai-proxy
   cat > requirements.txt <<EOF
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

6. **Initialize Desktop App**
   ```bash
   cd apps/desktop
   pnpm create vite . --template react-ts
   pnpm add -D electron electron-builder vite-plugin-electron
   pnpm add electron-store
   ```

7. **Create Monorepo Configuration**
   Create `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - 'apps/*'
     - 'services/*'
     - 'packages/*'
   ```

   Create root `package.json`:
   ```json
   {
     "name": "synscale-monorepo",
     "private": true,
     "scripts": {
       "dev": "concurrently \"pnpm run dev:desktop\" \"pnpm run dev:api\" \"pnpm run dev:ai\"",
       "build": "pnpm -r build",
       "test": "pnpm -r test"
     }
   }
   ```

8. **Confirm Completion**
   - List created directories
   - Show installed dependencies
   - Provide next steps

## Example Usage

**User**: "Initialize the SynScale project structure"

**Expected Actions**:
1. Create all directories
2. Initialize each service
3. Install all dependencies
4. Create configuration files
5. Report completion with directory tree

## Safety Checks

- Always check if directories exist before creating
- Ask user confirmation if files would be overwritten
- Create backups of important files
- Log all actions for troubleshooting

## Success Criteria

- All directories created
- All package.json files exist
- Dependencies installed (check for node_modules, venv, etc.)
- Configuration files in place
- No error messages during installation

## Follow-up Suggestions

After successful initialization, suggest:
1. "Would you like me to create the database schema?"
2. "Should I generate the API endpoints?"
3. "Ready to create the Dashboard UI components?"
