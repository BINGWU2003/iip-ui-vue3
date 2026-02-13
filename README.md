# IIP UI Vue3

[![npm version](https://badge.fury.io/js/@bingwu%2Fiip-ui-components.svg)](https://badge.fury.io/js/@bingwu%2Fiip-ui-components)
[![license](https://img.shields.io/npm/l/@bingwu/iip-ui-components.svg)](https://github.com/BINGWU2003/iip-ui-vue3/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dm/@bingwu/iip-ui-components.svg)](https://www.npmjs.com/package/@bingwu/iip-ui-components)

基于 Element Plus、Vue 3 和 TypeScript 的企业级组件库

## ✨ 特性

- 🚀 **现代化技术栈** - 基于 Vue 3 + TypeScript + Vite
- 📦 **Monorepo 架构** - 使用 pnpm workspace 管理多包
- 🌍 **TypeScript** - 完整的类型定义支持
- ⚡ **按需引入** - 支持 Tree Shaking
- 🧪 **测试覆盖** - 基于 Vitest 的单元测试
- 📚 **开发友好** - 完整的开发工具链和自动化脚本

## 📦 项目架构

本项目采用 Monorepo 架构，包含以下包：

### Packages（核心包）

- **@bingwu/iip-ui-components** - 核心组件库
- **@bingwu/iip-ui-utils** - 通用工具函数库
- **@bingwu/iip-ui-uniapp-utils** - UniApp 小程序工具函数库
- **@bingwu/iip-ui-theme** - 主题样式库

### Apps（应用）

- **@bingwu/iip-ui-docs** - 文档站点
- **@bingwu/vue-project-demo** - Demo 应用（用于测试和演示组件库）

## 📋 环境要求

- **Node.js** >= 20.19.5
- **pnpm** >= 8.10.5

## 🛠️ 开发指南

### 开发环境启动

```bash
# 安装依赖
pnpm install

# 打包构建（必须先打包构建再运行项目）
pnpm build

# 启动所有包的开发服务器
pnpm dev:packages

# 启动组件库UI页面
pnpm dev:ui

# 启动所有应用的开发服务器
pnpm dev:apps

# 启动 Demo 应用
pnpm dev:demo

# 启动 Demo 应用（包含依赖包的监听）
pnpm dev:demo:watch

# 启动文档站点
pnpm dev:docs
```

### 构建命令

```bash
# 构建所有包和应用
pnpm build

# 构建所有包（packages）
pnpm build:packages

# 构建所有应用（apps）
pnpm build:apps

# 单独构建组件库
pnpm build:components

# 单独构建工具库
pnpm build:utils

# 单独构建 UniApp 工具库
pnpm build:uniapp-utils

# 单独构建主题库
pnpm build:theme

# 构建文档站点
pnpm build:docs

# 预览文档站点
pnpm preview:docs
```

### 测试命令

```bash
# 运行所有测试
pnpm test

# 运行组件库测试
pnpm test:components
```

### 代码质量

```bash
# 代码格式化
pnpm format
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
pnpm release

# 生成Git Tag
pnpm tag
```

### 发布前检查

在发布前，请确保：

- ✅ 所有测试通过
- ✅ 代码已格式化且无 lint 错误
- ✅ 更新了 CHANGELOG.md
- ✅ 文档已同步更新
- ✅ 工作区干净（无未提交的更改）
- ✅ NPM 认证已正确配置（见下方说明）

### NPM 认证配置

如果发布时遇到 `403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required` 错误，说明需要使用细粒度访问令牌（Granular Access Token）。

#### 解决方案

1. **创建细粒度访问令牌**
   - 访问 [npm 访问令牌页面](https://www.npmjs.com/settings/bingwu/tokens)
   - 点击 "Generate New Token" → "Granular Access Token"
   - 配置权限：
     - **Package Access**: 选择 `@bingwu/iip-ui-components`、`@bingwu/iip-ui-utils`、`@bingwu/iip-ui-uniapp-utils`、`@bingwu/iip-ui-theme`
     - **Permissions**: 选择 `Read and Publish`
     - **Expiration**: 根据需要设置（建议至少 1 年）
   - **重要**: 确保启用 "Automatically revoke this token when 2FA is disabled" 选项（这相当于 bypass 2FA）

2. **配置认证方式（三种方式任选其一）**

   **方式一：使用 npm login（推荐）**

   ```bash
   # 使用创建的令牌登录 npm
   npm login --auth-type=legacy
   # 输入用户名、密码和邮箱，然后输入令牌作为密码
   ```

   **方式二：配置 .npmrc 文件（项目级别）**

   ```bash
   # 在项目根目录的 .npmrc 文件中添加（已预配置，取消注释即可）
   # //registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE
   ```

   **方式三：使用环境变量（CI/CD 推荐）**

   ```bash
   # Windows PowerShell
   $env:NPM_TOKEN="YOUR_TOKEN_HERE"

   # Windows CMD
   set NPM_TOKEN=YOUR_TOKEN_HERE

   # Linux/Mac
   export NPM_TOKEN=YOUR_TOKEN_HERE

   # 然后在 .npmrc 中使用（已预配置）
   # //registry.npmjs.org/:_authToken=${NPM_TOKEN}
   ```

   **方式四：使用 npm config（用户级别）**

   ```bash
   # 配置到用户级别的 .npmrc（~/.npmrc）
   npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE
   ```

3. **验证登录状态**

   ```bash
   npm whoami
   # 应该显示：bingwu
   ```

4. **重新发布**
   ```bash
   pnpm release
   ```

#### 注意事项

- 细粒度访问令牌比传统令牌更安全，建议使用
- 令牌创建后请妥善保管，不要泄露
- 如果令牌泄露，请立即在 npm 网站上撤销并重新创建
- **重要**：不要将包含真实 token 的 `.npmrc` 文件提交到 Git 仓库
- 项目根目录的 `.npmrc` 已预配置，包含注释说明，可根据需要取消注释
- 推荐使用 `npm login` 或环境变量的方式，token 会自动保存到用户目录的 `.npmrc`

### 手动发布

如需手动发布单个包：

```bash
# 构建所有包
pnpm build:packages

# 发布组件库
cd packages/components
npm publish

# 发布工具库
cd packages/utils
npm publish

# 发布 UniApp 工具库
cd packages/uniapp-utils
npm publish

# 发布主题库
cd packages/theme
npm publish
```

## 📖 文档

- **在线文档**: [https://iip-ui-docs.netlify.app/](https://iip-ui-docs.netlify.app/)
- **组件文档**: [./apps/docs](./apps/docs) - 组件使用文档和示例
- **更新日志**: [CHANGELOG.md](./CHANGELOG.md) - 版本更新记录

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

| 包名                                                                                     | 版本                                                             | 描述                    |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------- |
| [@bingwu/iip-ui-components](https://www.npmjs.com/package/@bingwu/iip-ui-components)     | ![npm](https://img.shields.io/npm/v/@bingwu/iip-ui-components)   | 核心组件库              |
| [@bingwu/iip-ui-utils](https://www.npmjs.com/package/@bingwu/iip-ui-utils)               | ![npm](https://img.shields.io/npm/v/@bingwu/iip-ui-utils)        | 通用工具函数库          |
| [@bingwu/iip-ui-uniapp-utils](https://www.npmjs.com/package/@bingwu/iip-ui-uniapp-utils) | ![npm](https://img.shields.io/npm/v/@bingwu/iip-ui-uniapp-utils) | UniApp 小程序工具函数库 |
| [@bingwu/iip-ui-theme](https://www.npmjs.com/package/@bingwu/iip-ui-theme)               | ![npm](https://img.shields.io/npm/v/@bingwu/iip-ui-theme)        | 主题样式库              |

## 📄 许可证

[MIT](./LICENSE) © 2025 IIP UI Vue3 Team

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [VXE Table](https://vxetable.cn/) - Vue 表格解决方案
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vitest](https://vitest.dev/) - 基于 Vite 的单元测试框架
