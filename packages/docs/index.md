---
layout: home

hero:
  name: 'IIP UI Vue3'
  text: '企业级组件库'
  tagline: '基于 Element Plus、Vue 3 和 TypeScript 构建'
  image:
    src: /logo.svg
    alt: IIP UI Vue3
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 组件文档
      link: /components/input
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/your-org/iip-ui-vue3

features:
  - icon: ⚡️
    title: 开箱即用
    details: 基于 Element Plus 二次封装，提供更丰富的功能和更好的开发体验
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
  - icon: 📚
    title: 完善文档
    details: 详细的组件文档和示例，帮助开发者快速上手和使用
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

```bash
# 安装
npm install @iip-ui/components

# 使用
import { createApp } from 'vue'
import IipUI from '@iip-ui/components'
import '@iip-ui/theme/dist/index.css'

const app = createApp(App)
app.use(IipUI)
```

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

[MIT](https://opensource.org/licenses/MIT)
