# 快速开始

本节将介绍如何在项目中快速上手 IIP UI Vue3 组件库。

## 环境准备

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js** >= 20.19.5
- **Vue**: 3.3.0+
- **TypeScript**: 4.7.0+

## 包结构说明

IIP UI Vue3 采用 Monorepo 架构，包含以下核心包：

- **@bingwu/iip-ui-components**: 核心组件库 (Input, Select, Table, Form, DateRange)
- **@bingwu/iip-ui-theme**: 主题样式包 (CSS 变量、全局样式)
- **@bingwu/iip-ui-utils**: 工具函数库 (类型检查、验证、Vue 工具等)

## 安装

### 基础安装

::: code-group

```bash [pnpm (推荐)]
# 安装组件库和主题
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-theme @bingwu/iip-ui-utils

# 安装必要的第三方依赖
pnpm add vxe-table@^4.15.6 vxe-pc-ui@^4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (提供基础 UI 组件)
pnpm add element-plus@^2.4.4 @element-plus/icons-vue@^2.1.0
```

```bash [npm]
# 安装组件库和主题
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme @bingwu/iip-ui-utils

# 安装必要的第三方依赖
npm install vxe-table@^4.15.6 vxe-pc-ui@^4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (提供基础 UI 组件)
npm install element-plus@^2.11.2 @element-plus/icons-vue@^2.1.0
```

```bash [yarn]
# 安装组件库和主题
yarn add @bingwu/iip-ui-components @bingwu/iip-ui-theme @bingwu/iip-ui-utils

# 安装必要的第三方依赖
yarn add vxe-table@^4.15.6 vxe-pc-ui@^4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (提供基础 UI 组件)
yarn add element-plus@^2.11.2 @element-plus/icons-vue@^2.1.0
```

:::

### 依赖说明

| 包名                        | 必需性   | 说明              |
| --------------------------- | -------- | ----------------- |
| `@bingwu/iip-ui-components` | **必需** | 核心组件库        |
| `@bingwu/iip-ui-theme`      | **必需** | 主题样式          |
| `@bingwu/iip-ui-utils`      | **必须** | 工具函数库        |
| `vxe-table`                 | **必需** | Table 组件依赖    |
| `vxe-pc-ui`                 | **必需** | Table 组件依赖    |
| `xe-utils`                  | **必需** | Table 组件依赖    |
| `element-plus`              | **必须** | 基础 UI 组件      |
| `@element-plus/icons-vue`   | 推荐     | Element Plus 图标 |

## 完整引入 (推荐)

如果你的项目不是特别在意打包体积，完整引入是最简单的方式：

```typescript
// main.ts
import { createApp } from 'vue'

// Element Plus (基础 UI 组件)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// vxe-table 相关插件 (Table 组件依赖)
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// IIP UI 组件库
import IipUI from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'

import App from './App.vue'

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册插件
app.use(VxeUITable)
app.use(VxePCUI)
app.use(ElementPlus)
app.use(IipUI)

app.mount('#app')
```

## 按需引入（暂不支持）

如果您使用 Vite 并希望减小打包体积，推荐使用按需引入的方式。

### 1. 安装自动导入插件

```bash
# 安装自动导入插件
pnpm add -D unplugin-vue-components unplugin-auto-import
```

### 2. 配置 Vite

在你的 `vite.config.ts` 中配置自动导入：

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
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        // 自动导入 IIP UI 工具函数
        {
          '@bingwu/iip-ui-utils': [
            'isString',
            'isNumber',
            'isBoolean',
            'isFunction',
            'isObject',
            'isArray',
            'isNull',
            'isUndefined',
            'isNullOrUndefined',
            'debounce',
            'throttle',
            'deepClone',
            'generateId',
            'isEmail',
            'isPhone',
            'isIdCard',
            'isUrl',
            'isIP',
            'getPasswordStrength',
            'withInstall',
            'withInstallFunction',
            'createNamespace',
            'eovaConverter',
            'EovaToAvueConverter'
          ]
        }
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // IIP UI 组件自动导入解析器
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

### 3. 初始化依赖

在你的 `main.ts` 中只需要注册必要的插件：

```typescript
// main.ts
import { createApp } from 'vue'

// 必须：vxe-table 相关插件
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// 样式文件
import 'element-plus/dist/index.css'
import '@bingwu/iip-ui-theme/dist/index.css'

import App from './App.vue'

const app = createApp(App)

// 注册必要插件
app.use(VxeUITable)
app.use(VxePCUI)

app.mount('#app')
```

### 4. 使用组件

现在你可以在模板中直接使用组件和工具函数，插件会自动按需引入：

```vue
<template>
  <div>
    <!-- 组件会自动导入 -->
    <iip-input v-model="value" placeholder="请输入内容" />
    <iip-select v-model="selected" :options="options" />
    <iip-date-range v-model="dateRange" :gap="16" />

    <!-- Element Plus 组件也会自动导入 -->
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>

<script setup lang="ts">
// Vue API 会自动导入
// import { ref } from 'vue' // 不需要手动导入

// 工具函数会自动导入
// import { debounce, isEmail } from '@bingwu/iip-ui-utils' // 不需要手动导入

const value = ref('')
const selected = ref('')
const dateRange = ref({ startTime: '', endTime: '' })

const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' }
]

// 使用防抖函数 (自动导入)
const handleSubmit = debounce(() => {
  if (isEmail(value.value)) {
    console.log('邮箱格式正确')
  }
}, 300)
</script>
```

## 手动引入

如果您不想使用自动导入，也可以手动引入组件和工具函数：

```vue
<template>
  <div>
    <iip-input v-model="value" placeholder="请输入内容" />
    <iip-select v-model="selected" :options="options" />
    <iip-date-range v-model="dateRange" :gap="16" />
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import { IipInput, IipSelect, IipDateRange } from '@bingwu/iip-ui-components'
import { debounce, isEmail } from '@bingwu/iip-ui-utils'

const value = ref('')
const selected = ref('')
const dateRange = ref({ startTime: '', endTime: '' })

const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' }
]

// 使用工具函数
const handleSubmit = debounce(() => {
  if (isEmail(value.value)) {
    console.log('邮箱格式正确')
  }
  console.log('日期范围:', dateRange.value)
}, 300)
</script>
```

## 第一个示例

创建你的第一个 IIP UI Vue3 应用：

```vue
<template>
  <div id="app">
    <h1>我的第一个 IIP UI Vue3 应用</h1>

    <!-- 基础输入组件 -->
    <div class="demo-section">
      <h3>基础输入组件</h3>
      <div class="input-group">
        <iip-input
          v-model="inputValue"
          placeholder="请输入内容"
          clearable
          style="width: 300px; margin-right: 16px;"
        />
        <iip-select
          v-model="selectValue"
          :options="selectOptions"
          placeholder="请选择"
          style="width: 200px; margin-right: 16px;"
        />
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>

    <!-- 高性能表格 -->
    <div class="demo-section">
      <h3>高性能表格</h3>
      <iip-table :data="tableData" :columns="tableColumns" border stripe height="300px">
        <!-- 操作列插槽 -->
        <template #action-slot-column-default="{ row }">
          <el-button type="primary" size="small" @click="editRow(row)"> 编辑 </el-button>
          <el-button type="danger" size="small" @click="deleteRow(row)"> 删除 </el-button>
        </template>
      </iip-table>
    </div>

    <!-- 配置化表单 -->
    <div class="demo-section">
      <h3>配置化表单</h3>
      <iip-form :config="formConfig" @submit="handleFormSubmit" style="max-width: 600px;" />
    </div>

    <!-- 日期范围选择器 -->
    <div class="demo-section">
      <h3>日期范围选择器</h3>
      <iip-date-range v-model="dateRange" :gap="16" />
      <p
        v-if="dateRange && (dateRange.startTime || dateRange.endTime)"
        style="margin-top: 8px; color: var(--iip-color-info);"
      >
        选择的日期范围：{{ formatDateRange(dateRange) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { debounce, isEmail } from '@bingwu/iip-ui-utils'

// 基础输入数据
const inputValue = ref('')
const selectValue = ref('')
const selectOptions = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' }
]

// 日期范围
const dateRange = ref({ startTime: '', endTime: '' })

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 25,
    department: '技术部',
    status: '在职',
    email: 'zhangsan@example.com'
  },
  { id: 2, name: '李四', age: 30, department: '产品部', status: '在职', email: 'lisi@example.com' },
  {
    id: 3,
    name: '王五',
    age: 28,
    department: '设计部',
    status: '离职',
    email: 'wangwu@example.com'
  },
  {
    id: 4,
    name: '赵六',
    age: 32,
    department: '运营部',
    status: '在职',
    email: 'zhaoliu@example.com'
  }
])

// 表格列配置
const tableColumns = ref([
  { tableColumnProps: { field: 'name', title: '姓名', width: 100 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80 } },
  { tableColumnProps: { field: 'department', title: '部门', width: 120 } },
  { tableColumnProps: { field: 'email', title: '邮箱', width: 180 } },
  { tableColumnProps: { field: 'status', title: '状态', width: 100 } },
  {
    slotKey: 'action-slot-column',
    tableColumnProps: { title: '操作', width: 120, fixed: 'right' }
  }
])

// 表单配置
const formConfig = ref({
  model: {
    name: '',
    email: '',
    phone: '',
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
      placeholder: '请输入邮箱地址',
      span: 12
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入手机号码',
      span: 12
    },
    {
      prop: 'type',
      label: '用户类型',
      type: 'select',
      placeholder: '请选择用户类型',
      span: 12,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' }
      ]
    }
  ],
  actions: {
    show: true,
    align: 'center',
    submitText: '提交表单',
    resetText: '重置'
  }
})

// 使用防抖处理提交
const handleSubmit = debounce(() => {
  if (!inputValue.value) {
    ElMessage.warning('请输入内容')
    return
  }

  if (isEmail(inputValue.value)) {
    ElMessage.success(`邮箱格式正确: ${inputValue.value}`)
  } else {
    ElMessage.info(`输入内容: ${inputValue.value}, 选择值: ${selectValue.value}`)
  }
}, 300)

// 表格操作
const editRow = (row: any) => {
  ElMessage.info(`编辑用户: ${row.name}`)
  console.log('编辑行数据:', row)
}

const deleteRow = (row: any) => {
  ElMessage.warning(`删除用户: ${row.name}`)
  console.log('删除行数据:', row)
}

// 表单提交处理
const handleFormSubmit = (formData: any) => {
  console.log('表单数据:', formData)

  // 使用工具函数验证
  if (formData.email && !isEmail(formData.email)) {
    ElMessage.error('邮箱格式不正确')
    return
  }

  ElMessage.success('表单提交成功！')
}

// 格式化日期范围
const formatDateRange = (range: { startTime: string; endTime: string }) => {
  if (!range || (!range.startTime && !range.endTime)) return ''

  const start = range.startTime || '未选择'
  const end = range.endTime || '未选择'

  return `${start} 至 ${end}`
}
</script>

<style scoped>
#app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: var(--iip-color-primary);
  margin-bottom: 30px;
  text-align: center;
}

h3 {
  color: var(--iip-color-info);
  margin-bottom: 16px;
  border-bottom: 2px solid var(--iip-color-primary);
  padding-bottom: 8px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: var(--iip-border-radius-base);
  background-color: #fafafa;
}

.input-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .input-group > * {
    width: 100% !important;
  }
}
</style>
```

## 验证安装

如果以上示例能正常运行且没有控制台错误，说明安装成功！你应该能看到：

- ✅ 基础输入组件正常显示和交互
- ✅ 下拉选择器可以正常选择选项
- ✅ 高性能表格显示数据并支持操作按钮
- ✅ 配置化表单显示各种输入控件
- ✅ 日期范围选择器可以选择日期范围
- ✅ 工具函数（防抖、邮箱验证）正常工作
- ✅ 主题 CSS 变量生效，组件样式正确

## TypeScript 支持

IIP UI Vue3 提供完整的 TypeScript 类型支持，包括组件类型、工具函数类型等。

### 1. 组件类型导入

```typescript
// 导入组件相关类型
import type {
  // 表格相关类型
  TableColumn,
  TableColumnProps,

  // 表单相关类型
  FormConfig,
  FormItemConfig,
  FormItemType,

  // 输入组件类型
  InputProps,
  SelectProps,
  SelectOption,

  // 日期组件类型
  DateRangeProps,
  DateRangeEmits
} from '@bingwu/iip-ui-components'

// 导入工具函数类型
import type {
  // 通用类型
  Nullable,
  DeepPartial,

  // 防抖函数类型
  DebouncedFunction,

  // Eova 相关类型
  EovaField,
  EovaToAvueConverter
} from '@bingwu/iip-ui-utils'

// 使用类型示例
const tableColumns: TableColumn[] = [
  {
    tableColumnProps: {
      field: 'name',
      title: '姓名',
      width: 120
    }
  }
]

const formConfig: FormConfig = {
  model: {
    name: '',
    email: '',
    type: ''
  },
  items: [
    {
      prop: 'name',
      label: '姓名',
      type: 'input' as FormItemType,
      required: true
    }
  ]
}

const selectOptions: SelectOption[] = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' }
]
```

### 2. 工具函数类型使用

```typescript
import { debounce, type DebouncedFunction } from '@bingwu/iip-ui-utils'

// 创建带类型的防抖函数
const debouncedSave: DebouncedFunction<(data: any) => void> = debounce((data: any) => {
  console.log('保存数据:', data)
}, 500)

// 使用 Eova 转换器类型
import { eovaConverter, type EovaField } from '@bingwu/iip-ui-utils'

const fields: EovaField[] = [
  {
    cn: '姓名',
    en: 'name',
    type: '文本框',
    width: 120,
    is_show: true,
    is_order: true
  }
]

const columns = eovaConverter.convertColumns(fields)
```

### 3. 组合式 API 类型支持

```typescript
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { type FormConfig } from '@bingwu/iip-ui-components'

// 带类型的响应式数据
const formData: Ref<Record<string, any>> = ref({})
const loading: Ref<boolean> = ref(false)

// 带类型的计算属性
const formConfig: ComputedRef<FormConfig> = computed(() => ({
  model: formData.value,
  items: [
    // 表单项配置
  ]
}))
```

## 常见问题

### Q: 为什么 Table 组件不显示或报错？

**A:** Table 组件依赖 vxe-table，请确保正确安装和注册：

```typescript
// ❌ 错误：缺少 vxe-table 插件或注册顺序错误
app.use(IipUI)
app.use(VxeUITable) // 顺序错误

// ✅ 正确：先注册 vxe-table 相关插件
app.use(VxeUITable) // 必须在 IipUI 之前
app.use(VxePCUI) // 必须在 IipUI 之前
app.use(IipUI) // 最后注册
```

### Q: 样式显示异常或组件样式不正确？

**A:** 检查样式文件引入顺序和完整性：

```typescript
// 确保按正确顺序引入所有必要的样式文件
import 'vxe-table/lib/style.css' // vxe-table 样式
import 'vxe-pc-ui/lib/style.css' // vxe-pc-ui 样式
import 'element-plus/dist/index.css' // Element Plus 样式
import '@bingwu/iip-ui-theme/dist/index.css' // IIP UI 主题样式（最后引入）
```

### Q: 如何自定义主题颜色？

**A:** IIP UI 使用 CSS 变量，可以轻松自定义主题：

```css
/* 在你的全局样式文件中覆盖 CSS 变量 */
:root {
  /* 主题色 */
  --iip-color-primary: #1890ff;
  --iip-color-success: #52c41a;
  --iip-color-warning: #faad14;
  --iip-color-danger: #ff4d4f;
  --iip-color-info: #909399;

  /* 字体 */
  --iip-font-size-base: 14px;
  --iip-font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  /* 间距 */
  --iip-spacing-md: 16px;
  --iip-spacing-lg: 24px;

  /* 圆角 */
  --iip-border-radius-base: 6px;
}

/* 暗色主题支持 */
[data-theme='dark'] {
  --iip-color-primary: #409eff;
  /* 其他暗色主题变量 */
}
```

### Q: 工具函数如何使用？

**A:** 可以手动导入或配置自动导入：

```typescript
// 手动导入
import { debounce, isEmail, deepClone } from '@bingwu/iip-ui-utils'

// 或者配置自动导入（推荐）
// 在 vite.config.ts 中配置后直接使用
const debouncedFn = debounce(() => {}, 300)
const isValid = isEmail('test@example.com')
```

### Q: 按需引入时组件未自动导入？

**A:** 检查 Vite 配置中的组件解析器：

```typescript
// vite.config.ts
Components({
  resolvers: [
    ElementPlusResolver(),
    // 确保 IIP UI 组件解析器配置正确
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
```

### Q: 打包后样式丢失？

**A:** 确保构建工具正确处理了 CSS 文件：

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    // 确保 CSS 文件被正确处理
    preprocessorOptions: {
      scss: {
        // SCSS 配置
      }
    }
  },
  build: {
    // 确保 CSS 被提取
    cssCodeSplit: true
  }
})
```

-

## 更新日志

关注我们的更新：

- 📋 **[CHANGELOG](/guide/changelog)** - 查看版本更新记录
- 🔔 **Watch Repository** - 在 GitHub 上关注项目获取最新动态

---

**感谢使用 IIP UI Vue3！** 🎉
