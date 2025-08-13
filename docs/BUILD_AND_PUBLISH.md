# 项目构建与发布指南

本文档详细介绍了如何构建和发布 IIP UI Vue3 组件库到 npm。

## 📋 目录

- [环境准备](#环境准备)
- [项目构建](#项目构建)
- [版本管理](#版本管理)
- [发布到 npm](#发布到-npm)
- [发布流程](#发布流程)
- [常见问题](#常见问题)

## 🛠️ 环境准备

### 1. 确保环境配置正确

```bash
# 检查 Node.js 版本 (推荐 18+)
node --version

# 检查 pnpm 版本
pnpm --version

# 检查 npm 登录状态
npm whoami
```

### 2. 登录 npm 账户

```bash
# 如果未登录，先登录 npm
npm login

# 验证登录状态
npm whoami
```

### 3. 确保依赖安装完整

```bash
# 安装所有依赖
pnpm install

# 清理缓存（如果需要）
pnpm store prune
```

## 🔨 项目构建

### 1. 构建所有包

```bash
# 构建所有包（推荐）
pnpm build:all

# 或者分别构建
pnpm --filter @bingwu/iip-ui-utils build
pnpm --filter @bingwu/iip-ui-theme build
pnpm --filter @bingwu/iip-ui-components build
```

### 2. 验证构建结果

```bash
# 检查构建产物
ls -la packages/utils/dist/
ls -la packages/theme/dist/
ls -la packages/components/dist/

# 运行测试确保质量
pnpm test:all
```

### 3. 构建文档（可选）

```bash
# 构建文档站点
pnpm docs:build

# 预览构建后的文档
pnpm docs:preview
```

## 📦 版本管理

### 1. 版本号规范

遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **主版本号 (MAJOR)**: 不兼容的 API 修改
- **次版本号 (MINOR)**: 向下兼容的功能性新增
- **修订号 (PATCH)**: 向下兼容的问题修正

### 2. 更新版本号

```bash
# 修订版本 (1.0.0 -> 1.0.1)
npm version patch

# 次版本 (1.0.0 -> 1.1.0)
npm version minor

# 主版本 (1.0.0 -> 2.0.0)
npm version major
```

### 3. 手动更新版本

如果需要手动更新，请同时修改以下文件：

```bash
# 主要包版本
packages/components/package.json
packages/utils/package.json
packages/theme/package.json

# 更新日志
CHANGELOG.md
```

## 🚀 发布到 npm

### 1. 发布单个包

```bash
# 发布 utils 包
cd packages/utils
npm publish

# 发布 theme 包
cd packages/theme
npm publish

# 发布 components 包
cd packages/components
npm publish
```

### 2. 批量发布

```bash
# 发布所有包（推荐）
pnpm -r publish

# 或者使用脚本
pnpm publish:all
```

### 3. 发布预发布版本

```bash
# 发布 beta 版本
npm publish --tag beta

# 发布 alpha 版本
npm publish --tag alpha

# 发布 rc 版本
npm publish --tag rc
```

## 📋 发布流程

### 完整发布流程

```bash
# 1. 确保代码最新
git pull origin main

# 2. 安装依赖
pnpm install

# 3. 运行测试
pnpm test:all

# 4. 构建所有包
pnpm build:all

# 5. 更新版本号
npm version patch  # 或 minor/major

# 6. 更新 CHANGELOG.md
# 手动编辑 CHANGELOG.md 文件

# 7. 提交版本更新
git add .
git commit -m "chore: release v1.x.x"

# 8. 创建标签
git tag v1.x.x

# 9. 推送到远程
git push origin main --tags

# 10. 发布到 npm
pnpm -r publish
```

### 自动化发布脚本

创建 `scripts/release.sh`：

```bash
#!/bin/bash

set -e

echo "🚀 开始发布流程..."

# 检查工作目录是否干净
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ 工作目录不干净，请先提交或暂存更改"
  exit 1
fi

# 运行测试
echo "🧪 运行测试..."
pnpm test:all

# 构建项目
echo "🔨 构建项目..."
pnpm build:all

# 更新版本
echo "📦 更新版本..."
read -p "请选择版本类型 (patch/minor/major): " version_type
npm version $version_type

# 获取新版本号
new_version=$(node -p "require('./package.json').version")
echo "📋 新版本: v$new_version"

# 提交更改
git add .
git commit -m "chore: release v$new_version"
git tag "v$new_version"

# 推送到远程
echo "📤 推送到远程..."
git push origin main --tags

# 发布到 npm
echo "🚀 发布到 npm..."
pnpm -r publish

echo "✅ 发布完成！版本: v$new_version"
```

## 🔍 验证发布

### 1. 检查 npm 包

```bash
# 检查包是否发布成功
npm view @bingwu/iip-ui-components
npm view @bingwu/iip-ui-utils
npm view @bingwu/iip-ui-theme

# 检查包的版本历史
npm view @bingwu/iip-ui-components versions --json
```

### 2. 测试安装

```bash
# 在新项目中测试安装
mkdir test-install && cd test-install
npm init -y
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme

# 验证包内容
ls node_modules/@bingwu/
```

## ❗ 常见问题

### 1. 发布权限问题

```bash
# 错误: 403 Forbidden
# 解决: 检查 npm 登录状态和包权限
npm whoami
npm owner ls @bingwu/iip-ui-components
```

### 2. 版本冲突

```bash
# 错误: Cannot publish over previously published version
# 解决: 更新版本号
npm version patch
```

### 3. 构建失败

```bash
# 清理缓存和重新安装
pnpm store prune
rm -rf node_modules
pnpm install
pnpm build:all
```

### 4. 依赖问题

```bash
# 检查依赖关系
pnpm list --depth=0
pnpm audit

# 修复依赖问题
pnpm audit fix
```

## 📚 相关文档

- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [pnpm 工作空间](https://pnpm.io/zh/workspaces)
- [项目 CHANGELOG](../CHANGELOG.md)

## 🎯 最佳实践

1. **发布前检查清单**:
   - [ ] 代码已提交且工作目录干净
   - [ ] 所有测试通过
   - [ ] 构建成功无错误
   - [ ] 版本号已更新
   - [ ] CHANGELOG.md 已更新

2. **版本管理**:
   - 遵循语义化版本规范
   - 及时更新 CHANGELOG.md
   - 为重要版本创建 Git 标签

3. **发布策略**:
   - 使用预发布版本测试
   - 分阶段发布（先 beta，后正式）
   - 监控发布后的反馈

4. **回滚策略**:
   - 保留旧版本的构建产物
   - 准备快速回滚方案
   - 及时响应用户反馈
