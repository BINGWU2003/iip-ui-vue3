# 发布前检查清单

在发布新版本之前，请确保完成以下所有检查项。

## 📋 发布前检查清单

### 🔍 代码质量检查

- [ ] **代码审查**: 所有代码变更已经过审查
- [ ] **测试覆盖**: 新功能有对应的单元测试
- [ ] **测试通过**: 运行 `pnpm test:all` 确保所有测试通过
- [ ] **构建成功**: 运行 `pnpm build:all` 确保构建无错误
- [ ] **代码规范**: 运行 `pnpm lint` 确保代码符合规范
- [ ] **类型检查**: TypeScript 类型检查通过

### 📝 文档更新

- [ ] **API 文档**: 新增或修改的 API 已更新文档
- [ ] **使用示例**: 提供了完整的使用示例
- [ ] **CHANGELOG**: 更新了 `CHANGELOG.md` 文件
- [ ] **README**: 如有必要，更新了 `README.md`
- [ ] **版本号**: 确认版本号符合语义化版本规范

### 🔧 功能验证

- [ ] **组件功能**: 所有组件功能正常工作
- [ ] **主题切换**: 亮色/暗色主题切换正常
- [ ] **响应式**: 在不同屏幕尺寸下显示正常
- [ ] **浏览器兼容**: 在主流浏览器中测试通过
- [ ] **性能测试**: 组件性能符合预期

### 🚀 发布准备

- [ ] **Git 状态**: 工作目录干净，无未提交的更改
- [ ] **分支状态**: 当前在 `main` 分支且与远程同步
- [ ] **npm 登录**: 已登录 npm 账户 (`npm whoami`)
- [ ] **权限确认**: 确认有发布权限
- [ ] **依赖检查**: 所有依赖版本正确且兼容

### 📦 包配置检查

- [ ] **package.json**: 版本号、依赖、脚本配置正确
- [ ] **构建产物**: `dist` 目录包含正确的文件
- [ ] **文件包含**: `files` 字段包含所有必要文件
- [ ] **入口文件**: `main`、`module`、`types` 字段正确
- [ ] **导出配置**: `exports` 字段配置正确

## 🎯 版本类型选择

根据变更内容选择合适的版本类型：

### Patch 版本 (1.0.0 → 1.0.1)

- [ ] 仅包含 bug 修复
- [ ] 向下兼容
- [ ] 无新功能添加
- [ ] 无 API 变更

### Minor 版本 (1.0.0 → 1.1.0)

- [ ] 添加了新功能
- [ ] 向下兼容
- [ ] 可能有新的 API
- [ ] 无破坏性变更

### Major 版本 (1.0.0 → 2.0.0)

- [ ] 包含破坏性变更
- [ ] API 有不兼容的修改
- [ ] 需要用户更新代码
- [ ] 重大架构调整

## 🔄 发布流程

### 自动化发布（推荐）

```bash
# 使用自动化脚本发布
pnpm release:patch   # 发布补丁版本
pnpm release:minor   # 发布次版本
pnpm release:major   # 发布主版本

# 或者交互式选择版本类型
pnpm release
```

### 手动发布

```bash
# 1. 检查状态
git status
pnpm test:all
pnpm build:all

# 2. 更新版本
npm version patch  # 或 minor/major

# 3. 更新 CHANGELOG
# 手动编辑 CHANGELOG.md

# 4. 提交更改
git add .
git commit -m "chore: release v1.x.x"
git tag v1.x.x

# 5. 推送
git push origin main --tags

# 6. 发布
pnpm publish:npm
```

## ✅ 发布后验证

### 立即验证

- [ ] **npm 包**: 检查包是否在 npm 上可见
- [ ] **版本正确**: 确认版本号正确
- [ ] **文件完整**: 检查包内容是否完整
- [ ] **安装测试**: 在新项目中测试安装

### 验证命令

```bash
# 检查包信息
npm view @bingwu/iip-ui-components
npm view @bingwu/iip-ui-utils
npm view @bingwu/iip-ui-theme

# 测试安装
mkdir test-install && cd test-install
npm init -y
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

### 后续监控

- [ ] **下载统计**: 监控包的下载量
- [ ] **用户反馈**: 关注 GitHub Issues 和社区反馈
- [ ] **错误报告**: 监控错误报告和崩溃日志
- [ ] **性能监控**: 关注性能指标

## 🚨 回滚计划

如果发布后发现问题，准备回滚方案：

### 快速回滚

```bash
# 发布上一个稳定版本
npm publish --tag latest

# 或者撤销发布（24小时内）
npm unpublish @bingwu/iip-ui-components@1.x.x
```

### 修复发布

```bash
# 快速修复并发布补丁版本
git checkout -b hotfix/fix-issue
# 修复代码
git commit -m "fix: critical issue"
pnpm release:patch
```

## 📞 联系信息

如果在发布过程中遇到问题，请联系：

- **技术负责人**: [联系方式]
- **项目维护者**: [联系方式]
- **紧急联系**: [联系方式]

## 📚 相关文档

- [构建与发布指南](./BUILD_AND_PUBLISH.md)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [项目 CHANGELOG](../CHANGELOG.md)
- [贡献指南](../CONTRIBUTING.md)
