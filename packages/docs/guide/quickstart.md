# 快速开始

本节将介绍如何在项目中快速上手 IIP UI Vue3 组件库。

## 环境准备

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**: 16.0+ (推荐 18.0+)
- **Vue**: 3.3.0+
- **TypeScript**: 4.7.0+ (可选但推荐)

## 安装

### 1. 安装核心依赖

::: code-group

```bash [pnpm (推荐)]
# 安装组件库
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-theme

# 安装必要依赖 (Table 组件需要)
pnpm add vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (推荐)
pnpm add element-plus@^2.4.4
```

```bash [npm]
# 安装组件库
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme

# 安装必要依赖 (Table 组件需要)
npm install vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (推荐)
npm install element-plus@^2.4.4
```

```bash [yarn]
# 安装组件库
yarn add @bingwu/iip-ui-components @bingwu/iip-ui-theme

# 安装必要依赖 (Table 组件需要)
yarn add vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (推荐)
yarn add element-plus@^2.4.4
```

:::

## 完整引入 (推荐)

如果你的项目不是特别在意打包体积，完整引入是最简单的方式：

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

::: warning 注意
插件注册顺序很重要！请确保 `VxeUITable` 和 `VxePCUI` 在 `IipUI` 之前注册，否则 Table 组件将无法正常工作。
:::

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

## 第一个示例

创建你的第一个 IIP UI Vue3 应用：

```vue
<template>
  <div id="app">
    <h1>我的第一个 IIP UI Vue3 应用</h1>

    <!-- Element Plus 按钮 -->
    <div style="margin: 20px 0;">
      <el-button type="primary" @click="showMessage"> Element Plus 按钮 </el-button>
    </div>

    <!-- 主题切换器 -->
    <div style="margin: 20px 0;">
      <h3>主题切换</h3>
      <theme-switcher v-model="currentTheme" :show-label="true" />
    </div>

    <!-- 表格组件 -->
    <div style="margin: 20px 0;">
      <h3>高性能表格</h3>
      <iip-table :data="tableData" :columns="tableColumns" border stripe height="300px">
        <!-- 自定义插槽示例 -->
        <template #action-slot-column-default="{ row }">
          <el-button type="text" size="small" @click="editRow(row)"> 编辑 </el-button>
          <el-button type="text" size="small" @click="deleteRow(row)"> 删除 </el-button>
        </template>
      </iip-table>
    </div>

    <!-- 表单组件 -->
    <div style="margin: 20px 0;">
      <h3>配置化表单</h3>
      <iip-form :config="formConfig" @submit="handleFormSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 主题状态
const currentTheme = ref<'light' | 'dark'>('light')

// 表格数据
const tableData = ref([
  { id: 1, name: '张三', age: 25, department: '技术部', status: '在职' },
  { id: 2, name: '李四', age: 30, department: '产品部', status: '在职' },
  { id: 3, name: '王五', age: 28, department: '设计部', status: '离职' },
  { id: 4, name: '赵六', age: 32, department: '运营部', status: '在职' }
])

// 表格列配置
const tableColumns = ref([
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80 } },
  { tableColumnProps: { field: 'department', title: '部门', width: 120 } },
  { tableColumnProps: { field: 'status', title: '状态', width: 100 } },
  {
    slotKey: 'action-slot-column',
    tableColumnProps: { title: '操作', width: 120, fixed: 'right' }
  }
])

// 事件处理
const showMessage = () => {
  ElMessage.success('Hello IIP UI Vue3!')
}

const editRow = (row: any) => {
  ElMessage.info(`编辑用户: ${row.name}`)
}

const deleteRow = (row: any) => {
  ElMessage.warning(`删除用户: ${row.name}`)
}

// 表单配置
const formConfig = {
  model: {
    name: '',
    email: '',
    type: ''
  },
  items: [
    {
      prop: 'name',
      label: '姓名',
      type: 'input',
      required: true,
      placeholder: '请输入姓名',
      span: 12
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'input',
      required: true,
      placeholder: '请输入邮箱',
      span: 12
    },
    {
      prop: 'type',
      label: '类型',
      type: 'select',
      placeholder: '请选择类型',
      span: 24,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' }
      ]
    }
  ],
  actions: {
    show: true,
    align: 'center',
    submitText: '提交表单'
  }
}

const handleFormSubmit = (formData: any) => {
  console.log('表单数据:', formData)
  ElMessage.success('表单提交成功！')
}
</script>

<style scoped>
#app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: var(--iip-text-color-primary);
  margin-bottom: 30px;
}

h3 {
  color: var(--iip-text-color-regular);
  margin-bottom: 16px;
}
</style>
```

## 验证安装

如果以上示例能正常运行且没有控制台错误，说明安装成功！你应该能看到：

- ✅ Element Plus 按钮可以点击并显示消息
- ✅ 主题切换器可以切换亮色/暗色主题
- ✅ 表格显示数据并支持操作按钮
- ✅ 表单显示输入框、下拉选择和提交按钮
- ✅ 主题切换时所有组件样式都会相应变化

## TypeScript 支持

### 1. 全局组件类型

如果使用 Volar，请在 `tsconfig.json` 中添加类型声明：

```json
{
  "compilerOptions": {
    "types": ["@bingwu/iip-ui-components/global", "element-plus/global"]
  }
}
```

### 2. 组件类型导入

```typescript
// 导入组件类型
import type {
  TableColumn,
  TableColumnProps,
  FormConfig,
  FormItemConfig,
  ThemeType
} from '@bingwu/iip-ui-components'

// 使用类型
const columns: TableColumn[] = [{ tableColumnProps: { field: 'name', title: '姓名' } }]

const formConfig: FormConfig = {
  model: { name: '' },
  items: [{ prop: 'name', label: '姓名', type: 'input' }]
}

const theme: ThemeType = 'light'
```

## 常见问题

### Q: 为什么 Table 组件不显示？

**A:** 确保正确安装并注册了 vxe-table 相关插件：

```typescript
// ❌ 错误：缺少 vxe-table 插件
app.use(IipUI)

// ✅ 正确：先注册 vxe-table
app.use(VxeUITable)
app.use(VxePCUI)
app.use(IipUI)
```

### Q: 样式显示异常怎么办？

**A:** 检查是否正确引入了所有样式文件：

```typescript
// 确保引入了这些样式
import 'element-plus/dist/index.css'
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/lib/style.css'
import '@bingwu/iip-ui-theme/dist/index.css'
```

### Q: 如何自定义主题？

**A:** 使用 CSS 变量覆盖默认主题：

```css
:root {
  --iip-color-primary: #1890ff;
  --iip-color-success: #52c41a;
}
```

### Q: 可以只使用部分组件吗？

**A:** 当然可以！参考 [按需引入](#按需引入) 章节。

## 下一步

现在你已经成功安装并运行了 IIP UI Vue3，接下来可以：

1. 📖 阅读详细的 [组件文档](/components/table)
2. 🎨 了解 [主题定制](/guide/theme)
3. 🛠️ 探索 [工具函数](/components/utils)

## 获取帮助

如果遇到问题，可以通过以下方式获取帮助：

- 🐛 提交 [GitHub Issue](https://github.com/BINGWU2003/iip-ui-vue3/issues)
- 💬 参与 [GitHub Discussions](https://github.com/BINGWU2003/iip-ui-vue3/discussions)

欢迎使用 IIP UI Vue3！🎉
