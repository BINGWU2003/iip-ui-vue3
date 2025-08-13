@echo off
setlocal enabledelayedexpansion

REM 快速发布脚本 (Windows 版本)
REM 用法: scripts\quick-release.bat [patch|minor|major]

set VERSION_TYPE=%1

if "%VERSION_TYPE%"=="" (
    echo 用法: %0 [patch^|minor^|major]
    echo.
    echo 版本类型说明:
    echo   patch  - 补丁版本 ^(1.0.0 -^> 1.0.1^) - bug 修复
    echo   minor  - 次版本 ^(1.0.0 -^> 1.1.0^) - 新功能
    echo   major  - 主版本 ^(1.0.0 -^> 2.0.0^) - 破坏性变更
    exit /b 1
)

if not "%VERSION_TYPE%"=="patch" if not "%VERSION_TYPE%"=="minor" if not "%VERSION_TYPE%"=="major" (
    echo 错误: 无效的版本类型 "%VERSION_TYPE%"
    echo 请使用: patch, minor, 或 major
    exit /b 1
)

echo 🚀 开始快速发布流程...
echo 版本类型: %VERSION_TYPE%
echo ==================================================

REM 1. 检查工作目录
echo [INFO] 检查工作目录状态...
git status --porcelain > temp_status.txt
for /f %%i in (temp_status.txt) do (
    echo [ERROR] 工作目录不干净，请先提交或暂存更改
    del temp_status.txt
    exit /b 1
)
del temp_status.txt
echo [SUCCESS] 工作目录干净

REM 2. 检查当前分支
echo [INFO] 检查当前分支...
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" (
    echo [WARNING] 当前不在 main 分支 ^(当前: %CURRENT_BRANCH%^)
    set /p CONTINUE="是否继续？(y/N): "
    if /i not "!CONTINUE!"=="y" (
        echo [ERROR] 已取消发布
        exit /b 1
    )
)

REM 3. 拉取最新代码
echo [INFO] 拉取最新代码...
git pull origin main
if errorlevel 1 (
    echo [ERROR] 拉取代码失败
    exit /b 1
)
echo [SUCCESS] 代码已更新

REM 4. 安装依赖
echo [INFO] 安装依赖...
pnpm install
if errorlevel 1 (
    echo [ERROR] 依赖安装失败
    exit /b 1
)
echo [SUCCESS] 依赖安装完成

REM 5. 运行测试
echo [INFO] 运行测试...
pnpm test:all
if errorlevel 1 (
    echo [ERROR] 测试失败，请修复后重试
    exit /b 1
)
echo [SUCCESS] 测试通过

REM 6. 构建项目
echo [INFO] 构建项目...
pnpm build:all
if errorlevel 1 (
    echo [ERROR] 构建失败，请检查错误
    exit /b 1
)
echo [SUCCESS] 构建完成

REM 7. 获取当前版本
echo [INFO] 更新版本号...
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set OLD_VERSION=%%i

REM 更新版本号
npm version %VERSION_TYPE% --no-git-tag-version
if errorlevel 1 (
    echo [ERROR] 版本更新失败
    exit /b 1
)

REM 获取新版本号
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set NEW_VERSION=%%i

REM 更新 components 包版本
cd packages\components
npm version %NEW_VERSION% --no-git-tag-version
cd ..\..

echo [SUCCESS] 版本已从 v%OLD_VERSION% 更新到 v%NEW_VERSION%

REM 8. 提交更改
echo [INFO] 提交更改...
git add .
git commit -m "chore: release v%NEW_VERSION%"
git tag "v%NEW_VERSION%"
echo [SUCCESS] 更改已提交并创建标签

REM 9. 推送到远程
echo [INFO] 推送到远程...
git push origin main --tags
if errorlevel 1 (
    echo [ERROR] 推送失败
    exit /b 1
)
echo [SUCCESS] 已推送到远程

REM 10. 检查 npm 登录状态
echo [INFO] 检查 npm 登录状态...
npm whoami >nul 2>&1
if errorlevel 1 (
    echo [ERROR] 未登录 npm，请先运行 npm login
    exit /b 1
)

for /f "tokens=*" %%i in ('npm whoami') do set NPM_USER=%%i
echo [INFO] 当前 npm 用户: %NPM_USER%

REM 11. 发布到 npm
echo [INFO] 发布到 npm...
pnpm -r publish
if errorlevel 1 (
    echo [ERROR] 发布失败
    exit /b 1
)
echo [SUCCESS] 发布完成

REM 12. 验证发布
echo [INFO] 验证发布结果...
timeout /t 5 /nobreak >nul

echo [INFO] 检查包发布状态...
npm view @bingwu/iip-ui-components@%NEW_VERSION% version >nul 2>&1
if not errorlevel 1 (
    echo [SUCCESS] @bingwu/iip-ui-components@%NEW_VERSION% 发布成功
) else (
    echo [WARNING] @bingwu/iip-ui-components@%NEW_VERSION% 可能还在同步中
)

npm view @bingwu/iip-ui-utils@%NEW_VERSION% version >nul 2>&1
if not errorlevel 1 (
    echo [SUCCESS] @bingwu/iip-ui-utils@%NEW_VERSION% 发布成功
) else (
    echo [WARNING] @bingwu/iip-ui-utils@%NEW_VERSION% 可能还在同步中
)

npm view @bingwu/iip-ui-theme@%NEW_VERSION% version >nul 2>&1
if not errorlevel 1 (
    echo [SUCCESS] @bingwu/iip-ui-theme@%NEW_VERSION% 发布成功
) else (
    echo [WARNING] @bingwu/iip-ui-theme@%NEW_VERSION% 可能还在同步中
)

echo ==================================================
echo 🎉 发布完成！
echo 版本: v%NEW_VERSION%
echo 标签: v%NEW_VERSION%
echo.
echo 📦 已发布的包:
echo   - @bingwu/iip-ui-components@%NEW_VERSION%
echo   - @bingwu/iip-ui-utils@%NEW_VERSION%
echo   - @bingwu/iip-ui-theme@%NEW_VERSION%
echo.
echo 🔗 相关链接:
echo   - npm: https://www.npmjs.com/package/@bingwu/iip-ui-components
echo   - GitHub: https://github.com/BINGWU2003/iip-ui-vue3/releases/tag/v%NEW_VERSION%
echo.
echo 📝 下一步:
echo   1. 更新 CHANGELOG.md ^(如果还没有^)
echo   2. 发布 GitHub Release
echo   3. 通知团队成员
echo ==================================================

endlocal
