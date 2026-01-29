# Docker Desktop 和 Go 安装指南

> 为SynScale项目安装容器化环境和Go语言运行时

---

## 📋 目录

1. [安装Docker Desktop](#安装docker-desktop)
2. [安装Go语言](#安装go语言)
3. [验证安装](#验证安装)
4. [配置和优化](#配置和优化)
5. [故障排除](#故障排除)

---

## 安装Docker Desktop

### 为什么需要Docker Desktop？

Docker Desktop将用于：
- 运行PostgreSQL数据库（主数据存储）
- 运行Redis缓存（Session和热数据）
- 运行TimescaleDB（时序数据扩展）
- 提供一致的开发环境

### 系统要求

✅ **Windows 10/11 64-bit**
- Windows 10: Enterprise, Pro, Education版本 22H2 (build 19045)或更高
- Windows 11: Enterprise, Pro, Education版本 23H2 (build 22631)或更高

✅ **启用虚拟化**
- 在BIOS中启用VT-x/AMD-V
- 启用Hyper-V或WSL 2

### 安装步骤

#### 方法1：从官方网站下载（推荐）

**步骤1：下载安装程序**

访问官方下载页面：
```
https://docs.docker.com/desktop/setup/install/windows-install/
```

或直接下载最新版本：
```
https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
```

**最新版本**: Docker Desktop 4.52.0（2025年1月）

**步骤2：运行安装程序**

1. 双击 `Docker Desktop Installer.exe`
2. 在安装配置界面：
   - ✅ 勾选 "Use WSL 2 instead of Hyper-V"（推荐）
   - ✅ 勾选 "Add shortcut to desktop"
3. 点击 "OK" 开始安装
4. 等待安装完成（大约3-5分钟）
5. 点击 "Close and restart" 重启计算机

**步骤3：首次启动**

1. 重启后，启动Docker Desktop
2. 接受服务条款
3. 跳过或完成快速入门教程
4. 看到Docker图标在系统托盘显示为绿色✅即表示运行正常

#### 方法2：从Microsoft Store安装

1. 打开Microsoft Store
2. 搜索 "Docker Desktop"
3. 点击 "Get" / "获取"
4. 安装完成后启动

### Docker Desktop 初始配置

**打开设置**（点击系统托盘的Docker图标 → Settings）：

#### Resources（资源配置）

针对SynScale开发环境，推荐配置：

```
CPUs: 4
Memory: 6 GB
Swap: 1 GB
Disk image size: 64 GB
```

如果您的电脑配置更高，可以分配更多资源。

#### Docker Engine

保持默认配置即可。如果需要配置镜像加速（国内用户），可以添加：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

#### Features in development

可以启用以下功能（可选）：
- ✅ Use containerd for pulling and storing images
- ✅ Enable host networking

---

## 安装Go语言

### 为什么需要Go？

Go将用于开发SynScale的：
- **Rights Engine（权益引擎）**: 高性能规则判定
- **性能关键模块**: 需要毫秒级响应的组件

### 系统要求

✅ **Windows 7或更新版本**（64-bit）
✅ **至少100MB磁盘空间**

### 安装步骤

**步骤1：下载Go安装程序**

访问官方下载页面：
```
https://go.dev/dl/
```

或直接下载最新稳定版本：
```
https://golang.org/dl/go1.25.6.windows-amd64.msi
```

**最新版本**: Go 1.25.6
**文件大小**: 54MB
**SHA256校验**: `8368bc6e1eeef015bda240a1f47f244be39a3f285c1c6f2a00c155bc3b5c26b3`

**步骤2：运行安装程序**

1. 双击 `go1.25.6.windows-amd64.msi`
2. 点击 "Next" 继续
3. 接受许可协议
4. 选择安装位置（默认：`C:\Program Files\Go`）
5. 点击 "Install" 开始安装
6. 等待安装完成（大约1分钟）
7. 点击 "Finish" 完成

**步骤3：验证环境变量**

安装程序会自动配置以下环境变量：

- `GOROOT`: `C:\Program Files\Go`
- `PATH`: 添加 `C:\Program Files\Go\bin`

**手动检查**（如果需要）：

1. 打开"系统属性" → "高级" → "环境变量"
2. 检查"系统变量"中是否存在上述配置

**步骤4：配置GOPATH（可选但推荐）**

创建Go工作空间目录：

```powershell
# 在PowerShell中运行
mkdir $env:USERPROFILE\go
mkdir $env:USERPROFILE\go\src
mkdir $env:USERPROFILE\go\bin
mkdir $env:USERPROFILE\go\pkg
```

设置GOPATH环境变量：

1. 打开"系统属性" → "高级" → "环境变量"
2. 在"用户变量"中，点击"新建"
3. 变量名：`GOPATH`
4. 变量值：`%USERPROFILE%\go`
5. 将 `%USERPROFILE%\go\bin` 添加到PATH中

---

## 验证安装

### 自动验证脚本

我已经为您创建了验证脚本：`verify-docker-go.bat`

运行验证：

```bash
# 在项目根目录运行
.\verify-docker-go.bat
```

### 手动验证

#### 验证Docker Desktop

**方法1：检查Docker版本**

```bash
docker --version
docker compose version
```

期望输出：
```
Docker version 27.x.x, build xxxxxxx
Docker Compose version v2.x.x
```

**方法2：运行测试容器**

```bash
docker run hello-world
```

期望看到：
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

**方法3：检查Docker Desktop状态**

```bash
docker info
```

期望看到：
```
Server:
 Containers: 0
  Running: 0
  Paused: 0
  Stopped: 0
 Images: 1
 ...
```

#### 验证Go语言

**方法1：检查Go版本**

```bash
go version
```

期望输出：
```
go version go1.25.6 windows/amd64
```

**方法2：检查Go环境**

```bash
go env
```

检查关键变量：
```
GOROOT="C:\Program Files\Go"
GOPATH="C:\Users\abc\go"
GOVERSION="go1.25.6"
```

**方法3：运行测试程序**

创建测试文件 `test.go`：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, SynScale!")
    fmt.Println("Go is ready for Rights Engine development!")
}
```

运行测试：

```bash
go run test.go
```

期望输出：
```
Hello, SynScale!
Go is ready for Rights Engine development!
```

---

## 配置和优化

### Docker配置优化

#### 1. 配置WSL 2内存限制

如果使用WSL 2后端，创建 `%USERPROFILE%\.wslconfig` 文件：

```ini
[wsl2]
memory=6GB
processors=4
swap=2GB
localhostForwarding=true
```

重启WSL：
```powershell
wsl --shutdown
```

#### 2. 启用Docker BuildKit

在 `%USERPROFILE%\.docker\daemon.json` 中添加：

```json
{
  "features": {
    "buildkit": true
  }
}
```

#### 3. 配置日志驱动

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### Go配置优化

#### 1. 启用Go Modules（已默认启用）

```bash
go env -w GO111MODULE=on
```

#### 2. 配置Go代理（国内用户）

```bash
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOSUMDB=sum.golang.google.cn
```

#### 3. 配置私有模块（如果需要）

```bash
go env -w GOPRIVATE=github.com/Jerryxiaohei/*
```

#### 4. 安装常用Go工具

```bash
# 代码格式化
go install golang.org/x/tools/cmd/goimports@latest

# 代码检查
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# 依赖管理
go install github.com/golang/dep/cmd/dep@latest

# 调试工具
go install github.com/go-delve/delve/cmd/dlv@latest
```

---

## 为SynScale准备容器环境

### 创建Docker Compose配置

在项目根目录创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    container_name: synscale-postgres
    environment:
      POSTGRES_USER: synscale
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: synscale_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - synscale-network

  redis:
    image: redis:7-alpine
    container_name: synscale-redis
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - synscale-network

  adminer:
    image: adminer
    container_name: synscale-adminer
    ports:
      - "8080:8080"
    networks:
      - synscale-network
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:

networks:
  synscale-network:
    driver: bridge
```

### 启动数据库环境

```bash
# 启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 停止并删除数据
docker compose down -v
```

### 访问数据库

**PostgreSQL连接信息**：
- Host: `localhost`
- Port: `5432`
- Database: `synscale_dev`
- User: `synscale`
- Password: `dev_password`

**Redis连接信息**：
- Host: `localhost`
- Port: `6379`

**Adminer Web界面**：
- URL: http://localhost:8080
- 用户名: `synscale`
- 密码: `dev_password`
- 数据库: `synscale_dev`

---

## 故障排除

### Docker Desktop问题

#### 问题1: Docker Desktop无法启动

**错误**: "Docker Desktop starting..." 一直转圈

**解决方案**:

1. **检查虚拟化是否启用**
   ```powershell
   # 在PowerShell中运行（管理员）
   Get-ComputerInfo | Select-Object -ExpandProperty HyperVisorPresent
   ```
   应该返回 `True`

2. **重置Docker Desktop**
   - 右键系统托盘Docker图标
   - 选择 "Troubleshoot" → "Reset to factory defaults"

3. **重启Docker服务**
   ```powershell
   # 在PowerShell中运行（管理员）
   Restart-Service docker
   ```

#### 问题2: WSL 2问题

**错误**: "WSL 2 installation is incomplete"

**解决方案**:

1. **安装WSL 2内核更新包**
   下载：https://aka.ms/wsl2kernel

2. **设置WSL 2为默认版本**
   ```powershell
   wsl --set-default-version 2
   ```

3. **检查WSL版本**
   ```powershell
   wsl -l -v
   ```

#### 问题3: 端口冲突

**错误**: "Ports are not available: listen tcp 0.0.0.0:5432"

**解决方案**:

1. **查找占用端口的进程**
   ```powershell
   netstat -ano | findstr :5432
   ```

2. **结束进程**
   ```powershell
   taskkill /PID <进程ID> /F
   ```

3. **或修改docker-compose.yml中的端口映射**
   ```yaml
   ports:
     - "15432:5432"  # 使用不同的主机端口
   ```

#### 问题4: 内存不足

**错误**: 容器频繁重启或卡顿

**解决方案**:

1. 增加Docker Desktop内存配置（Settings → Resources → Memory）
2. 减少运行的容器数量
3. 清理未使用的镜像和容器
   ```bash
   docker system prune -a
   ```

### Go安装问题

#### 问题1: go命令未找到

**错误**: "'go' is not recognized as an internal or external command"

**解决方案**:

1. **检查PATH环境变量**
   ```powershell
   $env:PATH -split ';' | Select-String 'Go'
   ```

2. **手动添加到PATH**
   - 打开"系统属性" → "环境变量"
   - 在PATH中添加: `C:\Program Files\Go\bin`

3. **重启命令行窗口**

#### 问题2: GOPATH未设置

**错误**: "GOPATH not set"

**解决方案**:

```powershell
# 临时设置
$env:GOPATH = "$env:USERPROFILE\go"

# 永久设置：添加到系统环境变量
```

#### 问题3: 网络问题（国内）

**错误**: "dial tcp: i/o timeout" 或下载包失败

**解决方案**:

```bash
# 配置国内代理
go env -w GOPROXY=https://goproxy.cn,https://goproxy.io,direct
go env -w GOSUMDB=sum.golang.google.cn
```

#### 问题4: 权限问题

**错误**: "permission denied" 创建文件失败

**解决方案**:

1. 以管理员身份运行命令行
2. 或修改GOPATH到用户目录：
   ```bash
   go env -w GOPATH=%USERPROFILE%\go
   ```

---

## 验证SynScale完整环境

### 运行完整环境检查

创建并运行测试脚本：

```bash
# 检查所有依赖
node --version
npm --version
pnpm --version
python --version
pip --version
docker --version
go version

# 检查数据库
docker compose ps

# 检查Go工作空间
go env GOPATH
ls $GOPATH
```

### 预期输出

```
Node.js: v22.21.0
npm: 10.8.2
pnpm: 10.28.2
Python: 3.14.0
pip: 24.3.1
Docker: 27.x.x
Go: go1.25.6

PostgreSQL: Running on port 5432
Redis: Running on port 6379

GOPATH: C:\Users\abc\go
```

---

## 下一步

### 1. 启动开发环境

```bash
# 启动数据库
docker compose up -d

# 验证连接
docker compose ps
```

### 2. 开始SynScale开发

现在您已经准备好开始开发了！可以使用之前创建的Agent Skills：

```
"Claude，帮我初始化SynScale项目结构"
```

### 3. 开发Rights Engine

创建Go项目：

```bash
cd services/rights-engine
go mod init github.com/Jerryxiaohei/synscale/rights-engine
```

---

## 快速参考

### Docker常用命令

```bash
# 容器管理
docker ps                    # 查看运行中的容器
docker ps -a                 # 查看所有容器
docker stop <container>      # 停止容器
docker start <container>     # 启动容器
docker restart <container>   # 重启容器
docker logs <container>      # 查看日志
docker exec -it <container> bash  # 进入容器

# 镜像管理
docker images               # 查看镜像
docker pull <image>         # 拉取镜像
docker rmi <image>          # 删除镜像
docker build -t <tag> .     # 构建镜像

# 系统管理
docker system df            # 查看磁盘使用
docker system prune         # 清理未使用资源
docker volume ls            # 查看数据卷
```

### Go常用命令

```bash
# 模块管理
go mod init <module>        # 初始化模块
go mod tidy                 # 整理依赖
go mod download             # 下载依赖
go get <package>            # 安装包

# 编译运行
go run main.go              # 运行程序
go build                    # 编译程序
go build -o app.exe         # 编译并指定输出文件
go install                  # 安装到GOPATH/bin

# 测试
go test                     # 运行测试
go test -v                  # 详细测试输出
go test -cover              # 测试覆盖率

# 代码质量
go fmt ./...                # 格式化代码
go vet ./...                # 代码检查
golangci-lint run           # 完整代码检查
```

---

## 总结

✅ **Docker Desktop**: 容器化数据库和服务
✅ **Go语言**: 高性能Rights Engine开发
✅ **完整工具链**: 全栈开发环境已就绪

您现在拥有SynScale开发所需的所有工具！🚀

---

**遇到问题？**

1. 查看本指南的"故障排除"章节
2. 查看官方文档：
   - Docker: https://docs.docker.com/
   - Go: https://go.dev/doc/
3. 或在Claude Code中直接问我！
