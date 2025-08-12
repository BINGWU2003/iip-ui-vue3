# 快速开始

本节将介绍如何在项目中使用 IIP UI Vue3。

## 安装

### 使用包管理器

我们建议您使用包管理器（如 NPM、Yarn 或 pnpm）安装 IIP UI Vue3。

::: code-group

```bash [npm]
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

```bash [yarn]
yarn add @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

```bash [pnpm]
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

:::

## 完整引入

如果你对打包后的文件大小不是很在乎，那么使用完整导入会更方便。

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

## 按需引入

如果您使用 Vite，我们推荐您使用按需引入的方式。

### 安装插件

首先安装 `unplugin-vue-components` 和 `unplugin-auto-import` 这两款插件。

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

### 配置插件

然后把下列代码插入到你的 `Vite` 配置文件中。

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // IIP UI 组件解析器
        componentName => {
          if (componentName.startsWith('Iip')) {
            return {
              name: componentName,
              from: '@bingwu/iip-ui-components'
            }
          }
        }
      ]
    })
  ]
})
```

### 使用组件

现在你可以在模板中直接使用组件了，插件会自动为你按需引入。

```vue
<template>
  <div>
    <iip-input v-model="value" placeholder="请输入内容" />
    <iip-select v-model="selected" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const selected = ref('')
const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' }
]
</script>
```

## 手动引入

如果您不想使用自动导入，也可以手动引入组件。

```vue
<template>
  <div>
    <iip-input v-model="value" placeholder="请输入内容" />
    <iip-select v-model="selected" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipInput, IipSelect } from '@bingwu/iip-ui-components'

const value = ref('')
const selected = ref('')
const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' }
]
</script>
```

## 全局配置

在引入 IIP UI Vue3 时，可以传入一个包含 `size` 和 `zIndex` 属性的全局配置对象。

```typescript
import { createApp } from 'vue'
import IipUI from '@bingwu/iip-ui-components'

const app = createApp(App)
app.use(IipUI, {
  // 全局组件大小
  size: 'default',
  // 全局 z-index
  zIndex: 3000
})
```

## 开始使用

现在你可以启动你的项目了。对于每个组件的用法，请参考对应的文档。

## Volar 支持

如果您使用 Volar，请在 `tsconfig.json` 中通过 `compilerOptions.type` 指定全局组件类型。

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["@bingwu/iip-ui-components/global"]
  }
}
```

## 开发环境

如果您想在本地开发和调试，可以克隆仓库并安装依赖：

```bash
git clone https://github.com/your-org/iip-ui-vue3.git
cd iip-ui-vue3
pnpm install
pnpm dev
```
