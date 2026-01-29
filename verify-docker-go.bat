@echo off
chcp 65001 >nul
echo ================================
echo Docker Desktop 和 Go 安装验证
echo ================================
echo.

echo [1/6] 检查Docker Desktop...
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo [√] Docker Desktop已安装
    docker --version
    docker compose version
) else (
    echo [×] Docker Desktop未安装或未启动
    echo     请安装Docker Desktop: https://docs.docker.com/desktop/setup/install/windows-install/
)
echo.

echo [2/6] 检查Docker运行状态...
docker info >nul 2>&1
if %errorlevel% == 0 (
    echo [√] Docker Desktop运行正常
) else (
    echo [×] Docker Desktop未运行
    echo     请启动Docker Desktop应用
)
echo.

echo [3/6] 检查Go语言...
go version >nul 2>&1
if %errorlevel% == 0 (
    echo [√] Go语言已安装
    go version
) else (
    echo [×] Go语言未安装
    echo     请安装Go: https://go.dev/dl/
)
echo.

echo [4/6] 检查Go环境配置...
go env GOROOT >nul 2>&1
if %errorlevel% == 0 (
    echo [√] Go环境配置正常
    echo     GOROOT:
    go env GOROOT
    echo     GOPATH:
    go env GOPATH
) else (
    echo [×] Go环境配置异常
)
echo.

echo [5/6] 测试Docker运行hello-world...
docker run --rm hello-world >nul 2>&1
if %errorlevel% == 0 (
    echo [√] Docker可以正常运行容器
) else (
    echo [×] Docker运行容器失败
    echo     请检查Docker Desktop是否正常运行
)
echo.

echo [6/6] 创建Go测试程序...
echo package main > test_go.go
echo import "fmt" >> test_go.go
echo func main() { >> test_go.go
echo     fmt.Println("Hello, SynScale!") >> test_go.go
echo     fmt.Println("Go is ready!") >> test_go.go
echo } >> test_go.go

go run test_go.go >nul 2>&1
if %errorlevel% == 0 (
    echo [√] Go可以正常运行程序
    go run test_go.go
    del test_go.go
) else (
    echo [×] Go运行程序失败
    del test_go.go
)
echo.

echo ================================
echo 环境检查完成！
echo ================================
echo.
echo 详细安装指南: docs\INSTALL-DOCKER-GO.md
echo.
pause
