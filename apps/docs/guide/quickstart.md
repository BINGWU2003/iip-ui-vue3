# 快速开始

本节将介绍如何在项目中快速上手 IIP UI Vue3 组件库。

## 环境准备

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js** >= 20.19.5
- **Vue**: 3.3.0+
- **TypeScript**: 4.7.0+

## 包结构说明

IIP UI Vue3 采用 Monorepo 架构，包含以下核心包：

- **@bingwu/iip-ui-components**: 核心组件库 (包含组件和样式)
- **@bingwu/iip-ui-utils**: 工具函数库 (类型检查、验证、Vue 工具等)

## 安装

### 基础安装

::: code-group

```bash [pnpm (推荐)]
# 安装组件库
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-utils

# 安装必要的第三方依赖
pnpm add vxe-table@^4.15.6 vxe-pc-ui@^4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (提供基础 UI 组件)
pnpm add element-plus@^2.4.4 @element-plus/icons-vue@^2.1.0
```

```bash [npm]
# 安装组件库
npm install @bingwu/iip-ui-components @bingwu/iip-ui-utils

# 安装必要的第三方依赖
npm install vxe-table@^4.15.6 vxe-pc-ui@^4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (提供基础 UI 组件)
npm install element-plus@^2.11.2 @element-plus/icons-vue@^2.1.0
```

```bash [yarn]
# 安装组件库
yarn add @bingwu/iip-ui-components @bingwu/iip-ui-utils

# 安装必要的第三方依赖
yarn add vxe-table@^4.15.6 vxe-pc-ui@^4.8.15 xe-utils@^3.7.8

# 安装 Element Plus (提供基础 UI 组件)
yarn add element-plus@^2.11.2 @element-plus/icons-vue@^2.1.0
```

:::

### 依赖说明

| 包名                        | 必需性   | 说明                   |
| --------------------------- | -------- | ---------------------- |
| `@bingwu/iip-ui-components` | **必需** | 核心组件库（包含样式） |
| `@bingwu/iip-ui-utils`      | **必须** | 工具函数库             |
| `vxe-table`                 | **必需** | Table 组件依赖         |
| `vxe-pc-ui`                 | **必需** | Table 组件依赖         |
| `xe-utils`                  | **必需** | Table 组件依赖         |
| `element-plus`              | **必须** | 基础 UI 组件           |
| `@element-plus/icons-vue`   | 推荐     | Element Plus 图标      |

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
import '@bingwu/iip-ui-components/dist/style.css'

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

## 手动引入

如果您不想使用完整引入，也可以手动引入组件和工具函数：

```vue
<template>
  <div>
    <IipPaginationSelect
      v-model="selectedUser"
      :fetch-data="fetchUserData"
      placeholder="请选择用户"
      value-key="id"
      label-key="name"
      :page-size="20"
      @change="handleChange"
    />

    <div v-if="selectedUser" style="margin-top: 10px;">
      已选择：{{ selectedUser.name }} (ID: {{ selectedUser.id }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'
import type { FetchDataParams, FetchDataResult } from '@bingwu/iip-ui-components'

// modelValue 是对象形式：{ id: 1, name: '张三' }
const selectedUser = ref<{ id: number; name: string } | null>(null)

// 处理选择变化
const handleChange = (value: { id: number; name: string } | null) => {
  console.log('选中的用户：', value)
}

// 模拟用户数据
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`
}))

// 模拟数据获取函数
const fetchUserData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, keyword } = params

  // 根据关键词过滤
  let filteredUsers = mockUsers
  if (keyword) {
    filteredUsers = mockUsers.filter(
      user => user.name.includes(keyword) || user.email.includes(keyword)
    )
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredUsers.slice(start, end)

  return {
    data,
    total: filteredUsers.length
  }
}
</script>
```

## 第一个示例

创建你的第一个 IIP UI Vue3 应用，使用 PaginationSelect 分页选择器：

```vue
<template>
  <div id="app">
    <h1>我的第一个 IIP UI Vue3 应用</h1>

    <!-- 分页选择器示例 -->
    <div class="demo-section">
      <h3>分页选择器</h3>
      <div class="input-group">
        <IipPaginationSelect
          v-model="selectedUser"
          :fetch-data="fetchUserData"
          placeholder="请选择用户"
          value-key="id"
          label-key="name"
          :page-size="20"
          clearable
          style="width: 300px;"
          @change="handleUserChange"
        />

        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>

      <div
        v-if="selectedUser"
        style="margin-top: 16px; padding: 12px; background-color: #f0f9ff; border-radius: 4px;"
      >
        <p><strong>已选择用户：</strong></p>
        <p>ID: {{ selectedUser.id }}</p>
        <p>姓名: {{ selectedUser.name }}</p>
        <p>邮箱: {{ selectedUser.email }}</p>
      </div>
    </div>

    <!-- 表单应用示例 -->
    <div class="demo-section">
      <h3>表单应用</h3>
      <el-form :model="form" label-width="120px" style="max-width: 600px;">
        <el-form-item label="用户">
          <IipPaginationSelect
            v-model="form.user"
            :fetch-data="fetchUserData"
            value-key="id"
            label-key="name"
            placeholder="请选择用户"
            :page-size="20"
            clearable
          />
        </el-form-item>

        <el-form-item label="部门">
          <IipPaginationSelect
            v-model="form.department"
            :fetch-data="fetchDepartmentData"
            value-key="id"
            label-key="name"
            placeholder="请选择部门"
            :page-size="15"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleFormSubmit">提交表单</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'
import type { FetchDataParams, FetchDataResult } from '@bingwu/iip-ui-components'

// 选中的用户
const selectedUser = ref<{ id: number; name: string; email: string } | null>(null)

// 表单数据
const form = ref({
  user: null as { id: number; name: string } | null,
  department: null as { id: number; name: string } | null
})

// 模拟用户数据
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
  department: ['技术部', '产品部', '设计部', '运营部', '市场部'][i % 5]
}))

// 模拟部门数据
const mockDepartments = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `部门${i + 1}`,
  code: `DEPT-${String(i + 1).padStart(3, '0')}`
}))

// 获取用户数据
const fetchUserData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, keyword } = params

  // 根据关键词过滤
  let filteredUsers = mockUsers
  if (keyword) {
    filteredUsers = mockUsers.filter(
      user => user.name.includes(keyword) || user.email.includes(keyword)
    )
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredUsers.slice(start, end)

  return {
    data,
    total: filteredUsers.length
  }
}

// 获取部门数据
const fetchDepartmentData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, keyword } = params

  // 根据关键词过滤
  let filteredDepartments = mockDepartments
  if (keyword) {
    filteredDepartments = mockDepartments.filter(dept => dept.name.includes(keyword))
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredDepartments.slice(start, end)

  return {
    data,
    total: filteredDepartments.length
  }
}

// 处理用户选择变化
const handleUserChange = (value: { id: number; name: string; email: string } | null) => {
  if (value) {
    ElMessage.success(`已选择用户: ${value.name}`)
  }
}

// 处理提交
const handleSubmit = () => {
  if (!selectedUser.value) {
    ElMessage.warning('请先选择用户')
    return
  }

  ElMessage.success(`提交成功！用户: ${selectedUser.value.name}`)
  console.log('选中的用户:', selectedUser.value)
}

// 处理表单提交
const handleFormSubmit = () => {
  if (!form.value.user || !form.value.department) {
    ElMessage.warning('请完整填写表单')
    return
  }

  const submitData = {
    userId: form.value.user.id,
    userName: form.value.user.name,
    departmentId: form.value.department.id,
    departmentName: form.value.department.name
  }

  ElMessage.success('表单提交成功！')
  console.log('提交数据:', submitData)
}

// 处理重置
const handleReset = () => {
  form.value = {
    user: null,
    department: null
  }
  ElMessage.info('表单已重置')
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

- ✅ 分页选择器正常显示和交互
- ✅ 支持远程搜索和分页加载
- ✅ 可以正常选择用户并显示选中信息
- ✅ 表单中的分页选择器正常工作
- ✅ 数据回显功能正常（支持跨页选择）
- ✅ 主题 CSS 变量生效，组件样式正确

## TypeScript 支持

IIP UI Vue3 提供完整的 TypeScript 类型支持，包括组件类型、工具函数类型等。

### 1. 组件类型导入

```typescript
// 导入组件相关类型
import type {
  // PaginationSelect 分页选择器类型
  PaginationSelectProps,
  PaginationSelectEmits,
  PaginationSelectInstance,
  FetchDataParams,
  FetchDataResult,
  OptionItem,

  // DialogSelect 弹窗选择器类型
  DialogSelectProps,
  DialogSelectEmits,
  DialogSelectInstance,
  DialogSelectOption,
  DialogSelectOptions,
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  TableRowItem,
  FormItemOption,

  // DateRange 日期范围选择器类型
  DateRangeProps,
  DateRangeEmits
} from '@bingwu/iip-ui-components'

// 使用类型示例
// PaginationSelect 示例
const paginationSelectProps: PaginationSelectProps = {
  modelValue: null,
  placeholder: '请选择',
  valueKey: 'id',
  labelKey: 'name',
  pageSize: 20,
  fetchData: async (params: FetchDataParams): Promise<FetchDataResult> => {
    // 数据获取逻辑
    return { data: [], total: 0 }
  }
}

// DialogSelect 示例
const dialogSelectOptions: DialogSelectOptions = [
  {
    field: 'id',
    title: 'ID',
    columnProps: { width: 80 }
  },
  {
    field: 'name',
    title: '姓名',
    columnProps: { width: 120 },
    useForm: true,
    formItemProps: {
      type: 'input',
      placeholder: '请输入姓名'
    }
  }
]

// DateRange 示例
const dateRangeValue: DateRangeProps['modelValue'] = {
  startTime: '',
  endTime: ''
}
```

### 2. 工具函数类型使用

```typescript
import { debounce, type DebouncedFunction } from '@bingwu/iip-ui-utils'

// 创建带类型的防抖函数
const debouncedSave: DebouncedFunction<(data: any) => void> = debounce((data: any) => {
  console.log('保存数据:', data)
}, 500)
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
import '@bingwu/iip-ui-components/dist/style.css' // IIP UI 主题样式（最后引入）
```

### Q: 工具函数如何使用？

**A:** 可以手动导入：

```typescript
// 手动导入
import { debounce, isEmail, deepClone } from '@bingwu/iip-ui-utils'

// 使用示例
const debouncedFn = debounce(() => {}, 300)
const isValid = isEmail('test@example.com')
```

-

## 更新日志

关注我们的更新：

- 📋 **[CHANGELOG](/guide/changelog)** - 查看版本更新记录
- 🔔 **Watch Repository** - 在 GitHub 上关注项目获取最新动态

---

**感谢使用 IIP UI Vue3！** 🎉
