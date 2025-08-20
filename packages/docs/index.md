---
layout: home

hero:
  name: 'IIP UI Vue3'
  text: '企业级组件库'
  tagline: '基于 vxe-table、Element Plus、Vue 3 和 TypeScript 构建的现代化组件库'
  image:
    src: /logo.svg
    alt: IIP UI Vue3
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 组件文档
      link: /components/table
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/BINGWU2003/iip-ui-vue3

features:
  - icon: 🚀
    title: 高性能表格
    details: 基于 vxe-table 4.15+ 构建的企业级表格组件，支持虚拟滚动、编辑、筛选等功能
  - icon: 📝
    title: 配置化表单
    details: 通过 JSON 配置快速生成表单，支持 20+ 种表单项类型，内置验证规则和动态显示
  - icon: ⚡️
    title: 智能插槽渲染
    details: v1.2.0+ 版本实现插槽性能优化，只渲染实际使用的插槽，避免不必要的性能开销
  - icon: 🛠️
    title: TypeScript 支持
    details: 完整的 TypeScript 类型定义，提供更好的开发体验和代码提示
  - icon: 🎨
    title: 主题定制
    details: 支持动态主题切换，提供亮色和暗色主题，支持自定义主题变量
  - icon: 📦
    title: 按需引入
    details: 支持 Tree Shaking，可以按需引入组件，减小打包体积
  - icon: 🔧
    title: 企业级
    details: 专为企业级中后台管理系统设计，提供统一的视觉与交互风格
---

## 特性

### 🚀 现代化技术栈

- **Vue 3** - 使用最新的 Vue 3 Composition API
- **TypeScript** - 完整的类型支持
- **Element Plus** - 基于成熟的组件库二次封装
- **Vite** - 快速的构建工具

### 🎯 企业级特性

- **统一设计** - 提供统一的视觉与交互风格
- **高度可定制** - 支持主题定制和组件配置
- **完善的文档** - 详细的使用文档和示例
- **测试覆盖** - 完整的单元测试和端到端测试

### 📈 开发体验

- **开箱即用** - 简单的安装和配置
- **智能提示** - 完整的 TypeScript 类型定义
- **热更新** - 开发时的快速反馈
- **按需引入** - 减小打包体积

## 快速开始

::: code-group

```bash [npm]
# 安装组件库
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme

# 安装必要依赖（Table 组件需要）
npm install vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8
```

```bash [pnpm]
# 安装组件库
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-theme

# 安装必要依赖（Table 组件需要）
pnpm add vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8
```

:::

```ts
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 必须：vxe-table 相关
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// IIP UI 组件库
import IipUI from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'

import App from './App.vue'

const app = createApp(App)

// 注册插件（顺序很重要）
app.use(VxeUITable) // 必须在 IipUI 之前注册
app.use(VxePCUI) // 必须在 IipUI 之前注册
app.use(ElementPlus) // 可选
app.use(IipUI) // 最后注册 IIP UI

app.mount('#app')
```

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

[MIT](https://opensource.org/licenses/MIT)
