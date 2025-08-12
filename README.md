# iip-ui-vue3

基于 Element Plus、Vue 3 和 TypeScript 的企业级组件库

## 项目简介

iip-ui-vue3 是一个基于 `Element Plus`、`Vue 3` 和 `TypeScript` 技术栈构建的二次封装组件库，旨在为企业级中后台管理系统提供统一的视觉与交互风格。

## 技术栈

- **前端框架：** Vue 3
- **编程语言：** TypeScript
- **基础组件库：** Element Plus
- **构建工具：** Vite + Rollup
- **项目管理：** Monorepo + pnpm
- **文档工具：** VitePress
- **测试框架：** Vitest + Cypress

## 项目结构

```
iip-ui-vue3/
├── packages/
│   ├── components/          # 核心组件库
│   ├── docs/               # 文档站点
│   ├── utils/              # 工具函数库
│   └── theme/              # 主题样式
├── pnpm-workspace.yaml     # pnpm 工作空间配置
├── package.json            # 根目录依赖配置
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 启动组件开发
pnpm dev

# 启动文档站点
pnpm docs:dev
```

### 构建

```bash
# 构建所有包
pnpm build:all

# 构建组件库
pnpm build

# 构建文档
pnpm docs:build
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit
```

### 代码规范

```bash
# 代码检查
pnpm lint

# 样式检查
pnpm lint:style

# 代码格式化
pnpm format
```

## 开发规范

### Git 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档变更
- `style`: 代码格式变更
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

### 代码风格

项目使用 ESLint + Prettier + Stylelint 进行代码规范检查，并通过 Husky 在提交前自动执行检查。

## 许可证

MIT License

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 联系我们

如有问题或建议，请通过以下方式联系我们：

- 提交 Issue
- 发送邮件至项目维护者
