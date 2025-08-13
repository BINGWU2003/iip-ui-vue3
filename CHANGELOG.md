# 更新日志

所有重要的项目变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.1.2] - 2024-12-16

### 回退

#### 🔄 版本回退

- 回退 vxe-table 版本从 4.7.0 到 4.15.6
- 恢复使用 `resizable` 属性而非 `column-config`
- 确保与现有项目的兼容性

#### 📝 说明

- 此版本是对 v1.1.1 的回退，恢复到 v1.1.0 的功能状态
- 如果你已经使用了 v1.1.1，建议升级到此版本以获得更好的稳定性

## [1.1.0] - 2024-12-16

### 新增

#### 📋 Table 组件

- 新增 `IipTable` 基于 vxe-table 的表格组件
- 支持基础数据展示、边框、斑马纹
- 支持复选框选择、全选、序号显示
- 集成完整的分页功能
- 支持自定义列内容（插槽）
- 支持加载状态显示
- 支持列排序、筛选、固定列
- 支持不同尺寸和自适应布局
- 完整的 TypeScript 类型支持
- 详细的使用文档和示例

#### 🎨 主题适配

- 为 Table 组件添加完整的主题样式
- 支持亮色/暗色主题切换
- 响应式设计适配

## [1.0.1] - 2024-12-16

### 修复

#### 📦 包发布修复

- 修复 components 包依赖引用问题
- 将 workspace 依赖更新为实际的 npm 版本号
- 确保包可以正常安装和使用

#### 📝 文档更新

- 更新所有文档中的包名引用
- 修正安装和使用示例
- 更新快速开始指南

### 包名变更

由于 npm 组织限制，包名已更改为：

- `@iip-ui/components` → `@bingwu/iip-ui-components`
- `@iip-ui/theme` → `@bingwu/iip-ui-theme`
- `@iip-ui/utils` → `@bingwu/iip-ui-utils`

## [1.0.0] - 2024-12-16

### 新增

#### 🎨 主题系统

- 完整的主题系统，支持亮色/暗色/自动模式
- 动态主题切换功能
- 自定义主题变量和命名空间支持
- `IipThemeProvider` 主题提供者组件
- `IipThemeSwitcher` 主题切换器组件（支持按钮/开关/下拉三种类型）

#### 🧩 基础组件

- `IipInput` 增强的输入框组件
  - 自动清空功能
  - 字符计数显示
  - 内置验证规则（邮箱、手机号、身份证、URL、数字等）
  - 防抖输入支持
  - 复制粘贴增强处理
  - 失焦自动去空格
- `IipSelect` 增强的选择器组件
  - 全选功能（多选模式）
  - 搜索过滤支持
  - 远程加载数据
  - 选项分组显示
  - 选项数量统计
  - 防抖搜索

#### 🛠️ 工具函数

- 主题管理工具 (`createThemeManager`, `setTheme`, `toggleTheme`)
- Vue 工具函数 (`withInstall`, `createNamespace`)
- 验证工具函数 (`isEmail`, `isPhone`, `isIdCard`, `isUrl`, `getPasswordStrength`)
- 通用工具函数 (`debounce`, `throttle`, `deepClone`, `generateId`)

#### 📚 文档和测试

- VitePress 文档站点
- 完整的组件使用文档和示例
- Vitest 单元测试框架
- 组件测试用例覆盖
- 工具函数测试用例

#### 🏗️ 基础设施

- Monorepo 项目架构 (pnpm workspaces)
- TypeScript 完整支持
- Vite 构建系统
- ESLint + Prettier + Stylelint 代码规范
- Husky + lint-staged Git hooks
- 自动化构建和类型生成

### 技术栈

- **前端框架**: Vue 3.3+
- **编程语言**: TypeScript 5.0+
- **基础组件库**: Element Plus 2.4+
- **构建工具**: Vite 5.0+ + Rollup
- **包管理**: pnpm 8.0+
- **文档工具**: VitePress 1.0+
- **测试框架**: Vitest 0.34+

### 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

### 依赖要求

- Node.js >= 16.0.0
- Vue >= 3.3.0
- Element Plus >= 2.4.0
