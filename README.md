# IIP UI Vue3

[![npm version](https://badge.fury.io/js/@bingwu%2Fiip-ui-components.svg)](https://badge.fury.io/js/@bingwu%2Fiip-ui-components)
[![license](https://img.shields.io/npm/l/@bingwu/iip-ui-components.svg)](https://github.com/BINGWU2003/iip-ui-vue3/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dm/@bingwu/iip-ui-components.svg)](https://www.npmjs.com/package/@bingwu/iip-ui-components)

基于 Element Plus、Vue 3 和 TypeScript 的企业级组件库

## ✨ 特性

- 🚀 **现代化技术栈** - 基于 Vue 3 + TypeScript + Vite
- 📦 **Monorepo 架构** - 使用 pnpm workspace 管理多包
- 🎨 **主题定制** - 支持亮色/暗色主题，动态切换
- 🌍 **TypeScript** - 完整的类型定义支持
- ⚡ **按需引入** - 支持 Tree Shaking
- 🧪 **测试覆盖** - 基于 Vitest 的单元测试
- 📚 **开发友好** - 完整的开发工具链和自动化脚本

## 📦 项目架构

本项目采用 Monorepo 架构，包含以下包：

- **@bingwu/iip-ui-components** - 核心组件库
- **@bingwu/iip-ui-utils** - 工具函数库
- **@bingwu/iip-ui-theme** - 主题样式库
- **@bingwu/iip-ui-docs** - 文档站点
- **@bingwu/vue-project-demo** - vue-demo（用于测试开发环境的包使用能正常使用）

## 📋 环境要求

- **Node.js** >= 20.19.5
- **pnpm** >= 8.10.5

## 🛠️ 开发指南

### 开发环境启动

```bash
# 安装依赖
pnpm install

# 打包构建（必须先打包构建再运行项目）
pnpm build:all

# 启动组件库开发服务器
pnpm dev

# 启动文档站点
pnpm docs:dev

# 启动主题开发监听
pnpm --filter @bingwu/iip-ui-theme dev
```

### 构建命令

```bash
# 构建所有包（不包括文档）
pnpm build:all

# 单独构建组件库
pnpm build:components

# 单独构建工具库
pnpm build:utils

# 构建文档站点
pnpm docs:build
```

### 测试命令

```bash
# 运行所有测试（待完善）
pnpm test:all

# 运行组件库测试（待完善）
pnpm test:components

# 运行单元测试（待完善）
pnpm test:unit
```

### 代码质量

```bash
# 代码格式化
pnpm format

# ESLint 检查并修复
pnpm lint:components

# 样式检查
pnpm lint:style
```

## 🚀 发布指南

### 自动化发布

使用changesets/cli发布：

```bash
# 创建版本变更记录
pnpm changeset

# 更新版本
pnpm changeset version

# 发布版本
pnpm changeset publish
```

### 发布流程

发布脚本会自动执行以下步骤：

1. **版本检查** - 检查当前版本和工作区状态
2. **依赖安装** - 确保所有依赖已正确安装
3. **代码检查** - 运行 ESLint 和格式化检查
4. **测试验证** - 执行所有单元测试
5. **构建打包** - 构建所有包的生产版本
6. **版本更新** - 自动更新所有包的版本号
7. **Git 操作** - 提交更改并创建版本标签
8. **NPM 发布** - 发布到 NPM 仓库
9. **推送远程** - 推送代码和标签到远程仓库

### 发布前检查

在发布前，请确保：

- ✅ 所有测试通过
- ✅ 代码已格式化且无 lint 错误
- ✅ 更新了 CHANGELOG.md
- ✅ 文档已同步更新
- ✅ 工作区干净（无未提交的更改）

### 手动发布

如需手动发布单个包：

```bash
# 构建包
pnpm build:all

# 发布组件库
cd packages/components
npm publish

# 发布工具库
cd packages/utils
npm publish

# 发布主题库
cd packages/theme
npm publish
```

## 📖 文档

- [组件文档](./packages/docs) - 组件使用文档
- [更新日志](./CHANGELOG.md) - 版本更新记录

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 安装依赖 (`pnpm install`)
4. 进行开发并确保测试通过
5. 提交更改 (`git commit -m 'feat: add amazing feature'`)
6. 推送到分支 (`git push origin feature/amazing-feature`)
7. 打开 Pull Request

### Git 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，并通过 Husky + Commitlint 自动校验提交信息格式。

#### 提交信息格式

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### 支持的提交类型

- `feat:` 新功能 (feature)
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式调整（不影响代码运行的变动）
- `refactor:` 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `perf:` 性能优化
- `test:` 增加测试
- `chore:` 构建过程或辅助工具的变动
- `revert:` 撤销之前的提交
- `build:` 影响构建系统或外部依赖的更改
- `ci:` 对 CI 配置文件和脚本的更改

#### 提交示例

```bash
# 新功能
git commit -m "feat: 新增表格组件导出功能"

# Bug 修复
git commit -m "fix: 修复输入框在 Safari 下的样式问题"

# 文档更新
git commit -m "docs: 更新组件使用文档"

# 带作用域的提交
git commit -m "feat(table): 新增行选择功能"
git commit -m "fix(input): 修复验证规则问题"
```

#### 自动化校验

项目配置了 Git hooks 进行自动化校验：

- **pre-commit**: 提交前自动运行代码格式化和 lint 检查
- **commit-msg**: 校验提交信息是否符合规范

配置文件：

- `.husky/pre-commit` - 提交前钩子，运行 lint-staged
- `.husky/commit-msg` - 提交信息校验钩子，运行 commitlint
- `.commitlintrc.json` - commitlint 配置文件

#### 规则说明

- 提交信息不能为空
- type 必须是小写
- 标题最大长度为 100 字符
- 标题结尾不能有句号
- 必须包含有效的 type 类型

## 📦 包版本

| 包名                                                                                 | 版本                                                           | 描述       |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ---------- |
| [@bingwu/iip-ui-components](https://www.npmjs.com/package/@bingwu/iip-ui-components) | ![npm](https://img.shields.io/npm/v/@bingwu/iip-ui-components) | 核心组件库 |
| [@bingwu/iip-ui-utils](https://www.npmjs.com/package/@bingwu/iip-ui-utils)           | ![npm](https://img.shields.io/npm/v/@bingwu/iip-ui-utils)      | 工具函数库 |
| [@bingwu/iip-ui-theme](https://www.npmjs.com/package/@bingwu/iip-ui-theme)           | ![npm](https://img.shields.io/npm/v/@bingwu/iip-ui-theme)      | 主题样式库 |

## 📄 许可证

[MIT](./LICENSE) © 2024 IIP UI Vue3 Team

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [VXE Table](https://vxetable.cn/) - Vue 表格解决方案
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vitest](https://vitest.dev/) - 基于 Vite 的单元测试框架

## 账号

163邮箱：

```
npmzjkNPMZJK123
npmzjk@163.com
```

npm账号：

```
bingwu
npmzjkNPMZJK123
npmzjk@163.com
```

## 文档

地址：https://iip-ui-docs.netlify.app/
