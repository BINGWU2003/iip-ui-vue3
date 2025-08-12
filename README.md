# IIP UI Vue3

[![npm version](https://badge.fury.io/js/@bingwu%2Fiip-ui-components.svg)](https://badge.fury.io/js/@bingwu%2Fiip-ui-components)
[![license](https://img.shields.io/npm/l/@bingwu/iip-ui-components.svg)](https://github.com/BINGWU2003/iip-ui-vue3/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dm/@bingwu/iip-ui-components.svg)](https://www.npmjs.com/package/@bingwu/iip-ui-components)

基于 Element Plus、Vue 3 和 TypeScript 的企业级组件库

## ✨ 特性

- 🚀 **现代化技术栈** - 基于 Vue 3 + TypeScript + Vite
- 📦 **开箱即用** - 丰富的高质量组件
- 🎨 **主题定制** - 支持亮色/暗色主题，动态切换
- 🌍 **TypeScript** - 完整的类型定义支持
- 📱 **响应式设计** - 移动端友好
- ⚡ **按需引入** - 支持 Tree Shaking
- 🧪 **测试覆盖** - 完整的单元测试
- 📚 **文档完善** - 详细的使用文档和示例

## 📦 安装

```bash
# npm
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme

# yarn
yarn add @bingwu/iip-ui-components @bingwu/iip-ui-theme

# pnpm
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

## 🚀 快速开始

### 完整引入

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import IipUI from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(IipUI)
app.mount('#app')
```

### 按需引入

```typescript
// main.ts
import { createApp } from 'vue'
import { IipInput, IipSelect } from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'

const app = createApp(App)
app.component('IipInput', IipInput)
app.component('IipSelect', IipSelect)
app.mount('#app')
```

### 使用示例

```vue
<template>
  <div>
    <!-- 输入框 -->
    <iip-input
      v-model="inputValue"
      placeholder="请输入内容"
      clearable
      show-word-limit
      :maxlength="20"
      validate-rule="email"
    />

    <!-- 选择器 -->
    <iip-select
      v-model="selectValue"
      :options="options"
      multiple
      show-select-all
      filterable
      clearable
    />

    <!-- 主题切换器 -->
    <iip-theme-switcher v-model="themeMode" type="button" show-text />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const selectValue = ref([])
const themeMode = ref('light')
const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' }
]
</script>
```

## 📋 组件列表

### 基础组件

- ✅ **IipInput** - 增强的输入框组件
- ✅ **IipSelect** - 增强的选择器组件

### 主题组件

- ✅ **IipThemeProvider** - 主题提供者
- ✅ **IipThemeSwitcher** - 主题切换器

### 计划中

- 🔄 **IipButton** - 按钮组件
- 🔄 **IipTable** - 表格组件
- 🔄 **IipForm** - 表单组件
- 🔄 **IipDialog** - 对话框组件

## 🎨 主题定制

```typescript
import { setTheme, toggleTheme } from '@bingwu/iip-ui-utils'

// 设置主题
setTheme({
  mode: 'dark',
  primaryColor: '#409eff',
  namespace: 'my-app'
})

// 切换主题
toggleTheme()
```

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/BINGWU2003/iip-ui-vue3.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建所有包
pnpm build:all

# 运行测试
pnpm test

# 启动文档站点
pnpm docs:dev
```

## 📖 文档

- [在线文档](https://your-docs-site.com) (即将上线)
- [组件示例](./packages/components/examples)
- [更新日志](./CHANGELOG.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

[MIT](./LICENSE) © 2024 IIP UI Vue3 Team

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
