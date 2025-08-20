# 安装指南

本节将详细介绍如何安装和配置 IIP UI Vue3 组件库。

## 环境要求

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**: 16.0+ (推荐使用最新的 LTS 版本)
- **Vue**: 3.3.0+
- **TypeScript**: 4.7.0+ (如果使用 TypeScript)

## 包管理器

我们推荐使用以下包管理器之一：

- [pnpm](https://pnpm.io/) (推荐)
- [npm](https://www.npmjs.com/)
- [yarn](https://yarnpkg.com/)

## 安装步骤

### 1. 安装核心包

首先安装 IIP UI Vue3 的核心包：

::: code-group

```bash [pnpm]
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

```bash [npm]
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

```bash [yarn]
yarn add @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

:::

### 2. 安装必要依赖

IIP UI Vue3 基于以下库构建，需要安装相应依赖：

::: code-group

```bash [pnpm]
# vxe-table 相关 (Table 组件必需)
pnpm add vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8

# Element Plus (推荐)
pnpm add element-plus@^2.4.4 @element-plus/icons-vue@^2.1.0
```

```bash [npm]
# vxe-table 相关 (Table 组件必需)
npm install vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8

# Element Plus (推荐)
npm install element-plus@^2.4.4 @element-plus/icons-vue@^2.1.0
```

```bash [yarn]
# vxe-table 相关 (Table 组件必需)
yarn add vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8

# Element Plus (推荐)
yarn add element-plus@^2.4.4 @element-plus/icons-vue@^2.1.0
```

:::

### 3. 可选依赖

根据项目需要，你可能还需要安装以下依赖：

```bash
# 如果使用工具函数
pnpm add @bingwu/iip-ui-utils

# 如果需要图标库
pnpm add @element-plus/icons-vue

# 如果使用 TypeScript
pnpm add -D typescript @types/node
```

## 完整引入

在你的 `main.ts` 文件中引入并注册所有组件：

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 必须：vxe-table 相关插件
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// IIP UI 组件库
import IipUI from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'

import App from './App.vue'

const app = createApp(App)

// 注册插件（顺序很重要！）
app.use(VxeUITable) // 必须在 IipUI 之前注册
app.use(VxePCUI) // 必须在 IipUI 之前注册
app.use(ElementPlus) // 可选，但推荐
app.use(IipUI) // 最后注册 IIP UI

app.mount('#app')
```

## 按需引入

### 使用自动导入插件

如果你使用 Vite，推荐使用自动导入插件：

1. 安装插件：

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

2. 配置 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', '@vueuse/core']
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // IIP UI 组件解析器
        (componentName: string) => {
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

3. 在 `main.ts` 中仍需要注册必要插件：

```typescript
// main.ts
import { createApp } from 'vue'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import '@bingwu/iip-ui-theme/dist/index.css'

import App from './App.vue'

const app = createApp(App)

// 必须注册的插件
app.use(VxeUITable)
app.use(VxePCUI)

app.mount('#app')
```

### 手动按需引入

如果不使用自动导入，也可以手动引入需要的组件：

```vue
<template>
  <div>
    <iip-table :data="tableData" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipTable } from '@bingwu/iip-ui-components'

const tableData = ref([])
const columns = ref([])
</script>
```

## 样式配置

### CSS 变量定制

IIP UI Vue3 使用 CSS 变量来支持主题定制。你可以在全局样式中覆盖这些变量：

```css
/* style.css */
:root {
  /* 主色调 */
  --iip-color-primary: #409eff;
  --iip-color-success: #67c23a;
  --iip-color-warning: #e6a23c;
  --iip-color-danger: #f56c6c;

  /* 字体大小 */
  --iip-font-size-base: 14px;
  --iip-font-size-small: 12px;
  --iip-font-size-large: 16px;

  /* 边距 */
  --iip-spacing-xs: 4px;
  --iip-spacing-sm: 8px;
  --iip-spacing-md: 16px;
  --iip-spacing-lg: 24px;
  --iip-spacing-xl: 32px;
}
```

### Sass 变量（可选）

如果你的项目使用 Sass，可以通过变量文件进行深度定制：

```scss
// variables.scss
$primary-color: #409eff;
$border-radius: 4px;
$box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);

// 导入 IIP UI 主题
@import '@bingwu/iip-ui-theme/src/index.scss';
```

## TypeScript 配置

如果你的项目使用 TypeScript，建议添加类型声明：

### 1. 在 `tsconfig.json` 中添加类型：

```json
{
  "compilerOptions": {
    "types": ["@bingwu/iip-ui-components/global", "element-plus/global"]
  }
}
```

### 2. 创建类型声明文件（可选）：

```typescript
// types/components.d.ts
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IipTable: (typeof import('@bingwu/iip-ui-components'))['IipTable']
    IipInput: (typeof import('@bingwu/iip-ui-components'))['IipInput']
    IipSelect: (typeof import('@bingwu/iip-ui-components'))['IipSelect']
  }
}

export {}
```

## 验证安装

创建一个简单的页面来验证安装是否成功：

```vue
<template>
  <div style="padding: 20px;">
    <h1>IIP UI Vue3 安装验证</h1>

    <!-- Element Plus 测试 -->
    <el-button type="primary" @click="showMessage"> Element Plus 按钮 </el-button>

    <!-- IIP UI 组件测试 -->
    <div style="margin-top: 20px;">
      <iip-table :data="testData" :columns="testColumns" border stripe />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const showMessage = () => {
  ElMessage.success('Element Plus 工作正常！')
}

const testData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 }
])

const testColumns = ref([
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80 } }
])
</script>
```

如果页面正常显示且没有控制台错误，说明安装成功！

## 常见问题

### 插件注册顺序错误

**错误**：`[Vue warn]: injection "Symbol(VxeUITable)" not found`

**解决**：确保 `VxeUITable` 和 `VxePCUI` 在 `IipUI` 之前注册。

### 样式不生效

**错误**：组件显示异常或样式缺失

**解决**：确保正确引入了所有样式文件：

- `element-plus/dist/index.css`
- `vxe-table/lib/style.css`
- `vxe-pc-ui/lib/style.css`
- `@bingwu/iip-ui-theme/dist/index.css`

### TypeScript 类型错误

**错误**：组件类型未识别

**解决**：检查 `tsconfig.json` 中的 `types` 配置，确保包含组件库的类型声明。

### 版本兼容性问题

**错误**：组件功能异常

**解决**：检查依赖版本是否符合要求：

- Vue 3.3.0+
- vxe-table 4.15.6+
- Element Plus 2.4.4+
