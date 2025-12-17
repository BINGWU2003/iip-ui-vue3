# PaginationSelect 分页选择器

基于 Element Plus 的 `el-select` 组件二次封装，支持下拉分页搜索功能。

## 特性

- 🔍 支持远程搜索
- 📄 内置分页功能
- ⚡ 搜索防抖
- 🎯 TypeScript 支持
- 🛠️ 灵活的数据获取接口
- 🚀 性能优化，避免重复请求
- 🔄 自动数据回显，支持跨页选择
- 📋 虚拟选项机制，确保选中项正确显示
- ✅ 支持单选和多选模式

## 基础用法

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

    <div v-if="selectedUser">已选择：{{ selectedUser.name }} (ID: {{ selectedUser.id }})</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'
import type { FetchDataParams, FetchDataResult } from '@bingwu/iip-ui-components'

// modelValue 是对象形式：{ id: 1, name: '张三' }
const selectedUser = ref<{ id: number; name: string } | null>(null)

// 处理选择变化
const handleChange = value => {
  console.log('选中的用户：', value) // { id: 1, name: '张三' } 或 null
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

// 真实 API 调用示例
const fetchUserDataFromAPI = async (params: FetchDataParams): Promise<FetchDataResult> => {
  const { page, pageSize, keyword } = params

  const response = await fetch(`/api/users?page=${page}&size=${pageSize}&search=${keyword}`)
  const data = await response.json()

  return {
    data: data.list, // 数据列表，格式：[{ id: 1, name: '张三' }, ...]
    total: data.total // 总数
  }
}
</script>
```

## 多选用法

通过设置 `multiple` 属性启用多选模式，多选模式下 `modelValue` 为对象数组。

```vue
<template>
  <div>
    <IipPaginationSelect
      v-model="selectedUsers"
      :fetch-data="fetchUserData"
      placeholder="请选择用户（可多选）"
      value-key="id"
      label-key="name"
      multiple
      @change="handleChange"
    />

    <div v-if="selectedUsers.length > 0">
      已选择 {{ selectedUsers.length }} 个用户：
      <el-tag v-for="user in selectedUsers" :key="user.id" style="margin-right: 8px">
        {{ user.name }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'
import type { FetchDataParams, FetchDataResult } from '@bingwu/iip-ui-components'

// 多选模式下 modelValue 是对象数组
const selectedUsers = ref<{ id: number; name: string }[]>([])

// 处理选择变化
const handleChange = (value, options) => {
  console.log('选中的用户：', value) // [{ id: 1, name: '用户1' }, { id: 2, name: '用户2' }]
  console.log('完整选项：', options) // 包含所有字段的完整选项数组
}

// 模拟用户数据
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`
}))

// 模拟数据获取函数
const fetchUserData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, keyword } = params

  let filteredUsers = mockUsers
  if (keyword) {
    filteredUsers = mockUsers.filter(
      user => user.name.includes(keyword) || user.email.includes(keyword)
    )
  }

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

### 多选模式初始值

多选模式下可以设置初始选中值，组件会自动回显：

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 设置初始选中值
const selectedUsers = ref([
  { id: 16, name: '用户16' },
  { id: 17, name: '用户17' }
])
</script>
```

## 核心特性说明

### 1. modelValue 对象形式

组件的 `modelValue` 包含 `valueKey` 和 `labelKey` 对应的属性：

**单选模式**：对象形式

```typescript
// 默认情况下 (valueKey="value", labelKey="label")
const selected = ref<{ value: any; label: string } | null>(null)

// 自定义属性名 (valueKey="id", labelKey="name")
const selected = ref<{ id: number; name: string } | null>(null)
```

**多选模式**：对象数组形式

```typescript
// 默认情况下 (valueKey="value", labelKey="label")
const selectedList = ref<{ value: any; label: string }[]>([])

// 自定义属性名 (valueKey="id", labelKey="name")
const selectedList = ref<{ id: number; name: string }[]>([])

// 设置初始值
const selectedList = ref([
  { id: 1, name: '用户1' },
  { id: 2, name: '用户2' }
])
```

**优势：**

- ✅ 同时保存 value 和 label，无需额外管理
- ✅ 自动处理跨页选择的回显问题
- ✅ 不需要手动维护 displayLabel
- ✅ 单选/多选模式统一的数据结构

### 2. 自动数据回显

当选中的数据不在当前页时（例如选择了第二页的某个选项），组件会自动创建虚拟选项进行回显：

**单选模式**

```vue
<template>
  <!-- 即使当前显示第一页，选中的第二页数据也能正确显示 -->
  <IipPaginationSelect
    v-model="selectedItem"
    :fetch-data="fetchItems"
    value-key="id"
    label-key="name"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 假设这是从后端获取的已选中数据（来自第二页）
const selectedItem = ref({
  id: 25,
  name: '用户 25'
})
// 组件会自动创建虚拟选项显示"用户 25"，而不是只显示数字 25
</script>
```

**多选模式**

```vue
<template>
  <!-- 多选模式同样支持跨页回显 -->
  <IipPaginationSelect
    v-model="selectedItems"
    :fetch-data="fetchItems"
    value-key="id"
    label-key="name"
    multiple
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 假设这些是从后端获取的已选中数据（分别来自不同页）
const selectedItems = ref([
  { id: 5, name: '用户 5' }, // 第一页
  { id: 25, name: '用户 25' }, // 第三页
  { id: 50, name: '用户 50' } // 第五页
])
// 组件会为每个选中项创建虚拟选项，确保正确回显
</script>
```

### 3. 自定义属性名

通过 `valueKey` 和 `labelKey` 自定义对象的属性名：

```vue
<template>
  <div>
    <!-- 使用默认属性名 value 和 label -->
    <IipPaginationSelect v-model="selection1" :fetch-data="fetchData1" />

    <!-- 自定义属性名为 id 和 name -->
    <IipPaginationSelect
      v-model="selection2"
      value-key="id"
      label-key="name"
      :fetch-data="fetchData2"
    />

    <!-- 自定义属性名为 code 和 title -->
    <IipPaginationSelect
      v-model="selection3"
      value-key="code"
      label-key="title"
      :fetch-data="fetchData3"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// selection1: { value: 1, label: '选项一' } 或 null
const selection1 = ref(null)

// selection2: { id: 1, name: '张三' } 或 null
const selection2 = ref(null)

// selection3: { code: 'A001', title: '商品A' } 或 null
const selection3 = ref(null)
</script>
```

## 表单应用场景

### 1. 新建表单

```vue
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="用户">
      <IipPaginationSelect
        v-model="form.user"
        :fetch-data="fetchUsers"
        value-key="id"
        label-key="name"
        placeholder="请选择用户"
      />
    </el-form-item>

    <el-form-item label="分类">
      <IipPaginationSelect
        v-model="form.category"
        :fetch-data="fetchCategories"
        value-key="id"
        label-key="name"
        placeholder="请选择分类"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

const form = ref({
  user: null as { id: number; name: string } | null,
  category: null as { id: number; name: string } | null
})

const handleSubmit = () => {
  console.log('提交数据：', {
    userId: form.value.user?.id,
    userName: form.value.user?.name,
    categoryId: form.value.category?.id,
    categoryName: form.value.category?.name
  })

  // 发送到后端
  // await axios.post('/api/form', { ... })
}

// 模拟用户数据
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`
}))

const fetchUsers = async params => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const { page, pageSize, keyword } = params

  let filtered = mockUsers
  if (keyword) {
    filtered = mockUsers.filter(user => user.name.includes(keyword) || user.email.includes(keyword))
  }

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total: filtered.length }
}

// 模拟分类数据
const mockCategories = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `分类${i + 1}`
}))

const fetchCategories = async params => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const { page, pageSize, keyword } = params

  let filtered = mockCategories
  if (keyword) {
    filtered = mockCategories.filter(cat => cat.name.includes(keyword))
  }

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total: filtered.length }
}
</script>
```

### 2. 编辑表单（自动回显）

```vue
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="用户">
      <IipPaginationSelect
        v-model="form.user"
        :fetch-data="fetchUsers"
        value-key="id"
        label-key="name"
        placeholder="请选择用户"
      />
    </el-form-item>

    <el-form-item label="分类">
      <IipPaginationSelect
        v-model="form.category"
        :fetch-data="fetchCategories"
        value-key="id"
        label-key="name"
        placeholder="请选择分类"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleUpdate">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

const form = ref({
  user: null as { id: number; name: string } | null,
  category: null as { id: number; name: string } | null
})

// 加载表单数据
onMounted(async () => {
  // 从后端获取表单数据
  const response = await fetch('/api/form/123')
  const data = await response.json()

  // 直接设置对象形式的值，组件会自动回显
  form.value = {
    user: {
      id: data.userId, // 123
      name: data.userName // '张三'
    },
    category: {
      id: data.categoryId, // 456
      name: data.categoryName // '电子产品'
    }
  }

  // 即使选中的用户在第 13 页，也能正确显示"张三"
  // 而不是只显示 ID "123"
})

const handleUpdate = async () => {
  console.log('更新数据：', {
    userId: form.value.user?.id,
    userName: form.value.user?.name,
    categoryId: form.value.category?.id,
    categoryName: form.value.category?.name
  })

  // 发送到后端
  // await axios.put('/api/form/123', { ... })
}

// 模拟用户数据
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`
}))

const fetchUsers = async params => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const { page, pageSize, keyword } = params

  let filtered = mockUsers
  if (keyword) {
    filtered = mockUsers.filter(user => user.name.includes(keyword) || user.email.includes(keyword))
  }

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total: filtered.length }
}

// 模拟分类数据
const mockCategories = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `分类${i + 1}`
}))

const fetchCategories = async params => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const { page, pageSize, keyword } = params

  let filtered = mockCategories
  if (keyword) {
    filtered = mockCategories.filter(cat => cat.name.includes(keyword))
  }

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total: filtered.length }
}
</script>
```

### 3. 查看模式（只读）

```vue
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="用户">
      <!-- 方式1: 使用 disabled 禁用 -->
      <IipPaginationSelect
        v-model="form.user"
        :fetch-data="fetchUsers"
        value-key="id"
        label-key="name"
        disabled
      />
    </el-form-item>

    <el-form-item label="分类">
      <!-- 方式2: 直接显示文本 -->
      <span>{{ form.category?.name }}</span>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

const form = ref({
  user: null as { id: number; name: string } | null,
  category: null as { id: number; name: string } | null
})

onMounted(async () => {
  const response = await fetch('/api/form/123')
  const data = await response.json()

  form.value = {
    user: {
      id: data.userId,
      name: data.userName
    },
    category: {
      id: data.categoryId,
      name: data.categoryName
    }
  }
})

// 模拟用户数据
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`
}))

const fetchUsers = async params => {
  // 查看模式下，用户无法打开下拉框，所以不会触发请求
  await new Promise(resolve => setTimeout(resolve, 300))
  const { page, pageSize, keyword } = params

  let filtered = mockUsers
  if (keyword) {
    filtered = mockUsers.filter(user => user.name.includes(keyword))
  }

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total: filtered.length }
}
</script>
```

## 高级用法

### 1. 使用组件方法

```vue
<template>
  <div>
    <IipPaginationSelect
      ref="selectRef"
      v-model="selectedValue"
      :fetch-data="fetchData"
      placeholder="搜索并选择"
      value-key="id"
      label-key="title"
      :page-size="15"
      :debounce-time="500"
      clearable
      @change="handleChange"
      @data-loaded="handleDataLoaded"
      @error="handleError"
    />

    <el-button @click="refresh">刷新数据</el-button>
    <el-button @click="search">搜索特定内容</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDataParams,
  FetchDataResult,
  PaginationSelectInstance
} from '@bingwu/iip-ui-components'

const selectedValue = ref<{ id: number; title: string } | null>(null)
const selectRef = ref<PaginationSelectInstance>()

// 模拟数据
const mockItems = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `项目${i + 1}`,
  description: `描述${i + 1}`
}))

const fetchData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  console.log('获取数据参数:', params)

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, keyword } = params

  // 根据关键词过滤
  let filtered = mockItems
  if (keyword) {
    filtered = mockItems.filter(
      item => item.title.includes(keyword) || item.description.includes(keyword)
    )
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return {
    data,
    total: filtered.length
  }
}

const handleChange = value => {
  console.log('选择变化:', value) // { id: 1, title: '标题' } 或 null
}

const handleDataLoaded = (result: FetchDataResult) => {
  console.log('数据加载完成:', result)
}

const handleError = (error: any) => {
  console.error('数据加载错误:', error)
}

const refresh = () => {
  selectRef.value?.refresh()
}

const search = () => {
  selectRef.value?.search('特定关键词')
}
</script>
```

### 2. 自定义选项内容

```vue
<template>
  <div>
    <!-- 自定义选项显示 -->
    <IipPaginationSelect
      v-model="selectedUser"
      :fetch-data="fetchUsers"
      value-key="id"
      label-key="name"
    >
      <template #default="{ item }">
        <div class="custom-option">
          <el-avatar :size="24" :src="item.avatar" />
          <span class="user-name">{{ item.name }}</span>
          <el-tag v-if="item.isVip" type="warning" size="small">VIP</el-tag>
        </div>
      </template>
    </IipPaginationSelect>

    <!-- 自定义前缀图标 -->
    <IipPaginationSelect
      v-model="selectedUser"
      :fetch-data="fetchUsers"
      value-key="id"
      label-key="name"
    >
      <template #prefix>
        <el-icon><User /></el-icon>
      </template>
    </IipPaginationSelect>

    <!-- 自定义空状态 -->
    <IipPaginationSelect
      v-model="selectedUser"
      :fetch-data="fetchUsers"
      value-key="id"
      label-key="name"
    >
      <template #empty>
        <div class="custom-empty">
          <el-icon><Search /></el-icon>
          <p>没有找到相关用户</p>
        </div>
      </template>
    </IipPaginationSelect>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Search } from '@element-plus/icons-vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

const selectedUser = ref<{ id: string; name: string } | null>(null)

// 模拟用户数据（包含额外字段）
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `用户${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  isVip: i % 5 === 0
}))

const fetchUsers = async params => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const { page, pageSize, keyword } = params

  let filtered = mockUsers
  if (keyword) {
    filtered = mockUsers.filter(user => user.name.includes(keyword))
  }

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total: filtered.length }
}
</script>

<style scoped>
.custom-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  flex: 1;
}

.custom-empty {
  text-align: center;
  padding: 20px;
  color: var(--el-text-color-secondary);
}
</style>
```

### 3. 样式自定义

```vue
<template>
  <div>
    <!-- 通过 style 属性 -->
    <IipPaginationSelect
      v-model="selectedValue"
      :fetch-data="fetchData"
      :style="{ width: '300px', marginBottom: '16px' }"
    />

    <!-- 通过 popperClass -->
    <IipPaginationSelect
      v-model="selectedValue"
      :fetch-data="fetchData"
      popper-class="custom-pagination-select"
    />
  </div>
</template>

<style>
/* 自定义下拉框样式 */
.custom-pagination-select {
  max-width: 400px;
}

.custom-pagination-select .pagination-select-footer {
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
}

.custom-pagination-select .pagination-info {
  color: #909399;
  font-weight: 500;
}

/* 使用 CSS 变量 */
.pagination-select-popper {
  --el-border-color-light: #e4e7ed;
  --el-bg-color: #ffffff;
  --el-text-color-regular: #606266;
  --el-pagination-font-size: 12px;
}
</style>
```

## API

### Props

| 属性名         | 类型                                                   | 默认值     | 说明                                                                   |
| -------------- | ------------------------------------------------------ | ---------- | ---------------------------------------------------------------------- |
| modelValue     | `Record<string, any> \| Record<string, any>[] \| null` | `null`     | 绑定值，单选为对象，多选为对象数组，属性名由 valueKey 和 labelKey 决定 |
| placeholder    | `string`                                               | `'请选择'` | 占位符                                                                 |
| valueKey       | `string`                                               | `'value'`  | 选项值的键名                                                           |
| labelKey       | `string`                                               | `'label'`  | 选项标签的键名                                                         |
| pageSize       | `number`                                               | `10`       | 每页显示条数                                                           |
| clearable      | `boolean`                                              | `true`     | 是否可清空                                                             |
| showPagination | `boolean`                                              | `true`     | 是否显示分页器                                                         |
| popperClass    | `string`                                               | `''`       | 下拉框类名                                                             |
| debounceTime   | `number`                                               | `300`      | 搜索防抖时间(ms)                                                       |
| fetchData      | `Function`                                             | **必需**   | 获取数据的方法                                                         |
| style          | `CSSProperties`                                        | `{}`       | 组件样式对象                                                           |
| multiple       | `boolean`                                              | `false`    | 是否多选                                                               |

### Events

| 事件名            | 参数                                                                                                 | 说明                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| update:modelValue | `(value: Record<string, any> \| Record<string, any>[] \| null)`                                      | 绑定值更新，单选返回对象或 null，多选返回对象数组或空数组 |
| change            | `(value: Record<string, any> \| Record<string, any>[] \| null, option?: OptionItem \| OptionItem[])` | 选择变化，多选模式下 value 和 option 均为数组             |
| clear             | `()`                                                                                                 | 清空选择                                                  |
| visible-change    | `(visible: boolean)`                                                                                 | 下拉框显示/隐藏                                           |
| data-loaded       | `(result: FetchDataResult)`                                                                          | 数据加载完成                                              |
| error             | `(error: any)`                                                                                       | 数据加载错误                                              |

### Methods

组件实例继承了 Element Plus ElSelect 的所有方法和属性，可以直接调用原生方法。

**自定义方法**

| 方法名  | 参数                | 返回值 | 说明                           |
| ------- | ------------------- | ------ | ------------------------------ |
| refresh | `()`                | `void` | 重置搜索关键词和页码并刷新数据 |
| search  | `(keyword: string)` | `void` | 搜索指定关键词，重置页码为1    |

**自定义属性**

| 属性名      | 类型                          | 说明             |
| ----------- | ----------------------------- | ---------------- |
| loading     | `Readonly<Ref<boolean>>`      | 数据加载状态     |
| options     | `Readonly<Ref<OptionItem[]>>` | 当前页的选项列表 |
| total       | `Readonly<Ref<number>>`       | 数据总条数       |
| currentPage | `Readonly<Ref<number>>`       | 当前页码         |

**继承的 ElSelect 方法**

| 方法名 | 参数 | 说明                   |
| ------ | ---- | ---------------------- |
| focus  | `()` | 使选择器获取焦点       |
| blur   | `()` | 使选择器失去焦点       |
| ...    | -    | 支持 ElSelect 所有方法 |

**使用示例**

```typescript
const selectRef = ref<PaginationSelectInstance>()

// 调用自定义方法
selectRef.value?.refresh()
selectRef.value?.search('关键词')

// 访问自定义属性
console.log(selectRef.value?.loading) // 是否正在加载
console.log(selectRef.value?.options) // 当前选项列表
console.log(selectRef.value?.total) // 数据总数
console.log(selectRef.value?.currentPage) // 当前页码

// 直接调用 ElSelect 的原生方法
selectRef.value?.focus()
selectRef.value?.blur()
```

### Slots

组件支持 Element Plus Select 的所有插槽：

| 插槽名  | 参数                                  | 说明                                                 |
| ------- | ------------------------------------- | ---------------------------------------------------- |
| default | `{ item: OptionItem, index: number }` | 自定义选项内容，替代默认的 el-option                 |
| prefix  | -                                     | Select 组件头部内容                                  |
| suffix  | -                                     | Select 组件尾部内容                                  |
| empty   | -                                     | 无选项时的列表                                       |
| footer  | -                                     | 下拉列表底部内容（注意：组件已使用此插槽显示分页器） |

**注意**：`footer` 插槽已被组件内部使用来显示分页器。

### Types

```typescript
// 选项项接口
interface OptionItem {
  [key: string]: any
  disabled?: boolean
}

// 获取数据参数接口
interface FetchDataParams {
  page: number
  pageSize: number
  keyword: string
}

// 获取数据结果接口
interface FetchDataResult {
  data: OptionItem[]
  total: number
  [key: string]: any
}

// Props 接口
interface PaginationSelectProps {
  /** 绑定值，单选为对象，多选为对象数组 */
  modelValue?: Record<string, any> | Record<string, any>[] | null
  /** 占位符 */
  placeholder?: string
  /** 选项值的键名 */
  valueKey?: string
  /** 选项标签的键名 */
  labelKey?: string
  /** 每页显示条数 */
  pageSize?: number
  /** 是否可清空 */
  clearable?: boolean
  /** 是否显示分页器 */
  showPagination?: boolean
  /** 下拉框类名 */
  popperClass?: string
  /** 搜索防抖时间(ms) */
  debounceTime?: number
  /** 获取数据的方法 */
  fetchData: (params: FetchDataParams) => Promise<FetchDataResult>
  /** Style样式 */
  style?: CSSProperties
  /** 是否多选 */
  multiple?: boolean
}

// Emits 接口
interface PaginationSelectEmits {
  /** 更新绑定值，单选返回对象或 null，多选返回对象数组 */
  'update:modelValue': [value: Record<string, any> | Record<string, any>[] | null]
  /** 选择变化，多选模式下 value 和 option 均为数组 */
  change: [
    value: Record<string, any> | Record<string, any>[] | null,
    option?: OptionItem | OptionItem[]
  ]
  /** 清空 */
  clear: []
  /** 下拉框显示/隐藏 */
  'visible-change': [visible: boolean]
  /** 数据加载完成 */
  'data-loaded': [result: FetchDataResult]
  /** 错误 */
  error: [error: any]
}

// ElSelect 实例类型
type ElSelectInstanceType = InstanceType<typeof ElSelect>

// 组件实例接口（继承 ElSelect 的所有方法和属性）
type PaginationSelectInstance = ElSelectInstanceType & {
  /** 刷新数据 */
  refresh: () => void
  /** 搜索 */
  search: (keyword: string) => void
  /** 加载状态 */
  loading: Readonly<Ref<boolean>>
  /** 选项列表 */
  options: Readonly<Ref<OptionItem[]>>
  /** 总数 */
  total: Readonly<Ref<number>>
  /** 当前页 */
  currentPage: Readonly<Ref<number>>
}
```

## 最佳实践

### 1. 后端数据格式

推荐后端同时返回 value 和 label：

```json
{
  "userId": 123,
  "userName": "张三",
  "categoryId": 456,
  "categoryName": "电子产品"
}
```

前端直接映射为对象形式：

```typescript
form.value = {
  user: {
    id: data.userId,
    name: data.userName
  },
  category: {
    id: data.categoryId,
    name: data.categoryName
  }
}
```

### 2. 错误处理

```vue
<template>
  <IipPaginationSelect v-model="selectedValue" :fetch-data="fetchData" @error="handleError" />
</template>

<script setup>
import { ElMessage } from 'element-plus'

const handleError = error => {
  console.error('数据加载失败:', error)
  ElMessage.error('数据加载失败，请重试')
}
</script>
```

### 3. 性能优化

```vue
<template>
  <IipPaginationSelect
    v-model="selectedValue"
    :fetch-data="fetchData"
    :debounce-time="500"
    :page-size="20"
  />
</template>

<script setup>
// 使用适当的防抖时间，避免频繁请求
// 合理设置每页大小，平衡性能和用户体验
</script>
```

## 注意事项

1. **modelValue 格式**：单选模式必须是对象形式，多选模式必须是对象数组形式，均包含 valueKey 和 labelKey 对应的属性
2. **fetchData 必需**：必须提供数据获取方法
3. **数据格式**：返回的数据格式必须符合 `FetchDataResult` 接口
4. **自动回显**：组件会自动处理跨页选择的回显，无需手动维护 displayLabel
5. **虚拟选项**：虚拟选项仅用于回显，不会在下拉列表中显示
6. **状态管理**：组件自动处理加载状态和错误状态
7. **防抖处理**：搜索功能内置防抖处理，避免频繁请求
8. **分页显示**：分页器只在数据总数大于每页显示条数时显示
9. **插槽支持**：支持 Element Plus Select 的大部分插槽，但 `footer` 插槽已被分页器占用
10. **样式定制**：支持通过 `style`、`popperClass` 和 CSS 变量多种方式自定义样式
11. **多选模式**：多选模式下 modelValue 必须初始化为数组（可以是空数组 `[]`），清空后返回空数组而非 `null`

## 常见问题

### Q: modelValue 的格式是什么？

A: modelValue 的格式取决于是否为多选模式：

**单选模式**：对象形式，包含 valueKey 和 labelKey 对应的属性

- 默认情况：`{ value: 1, label: '选项一' }`
- 自定义属性：`{ id: 1, name: '张三' }`

**多选模式**：对象数组形式

- 默认情况：`[{ value: 1, label: '选项一' }, { value: 2, label: '选项二' }]`
- 自定义属性：`[{ id: 1, name: '张三' }, { id: 2, name: '李四' }]`

### Q: 如何处理跨页选择的回显？

A: 组件会自动处理。当你设置 `v-model` 为一个包含 value 和 label 的对象时，即使该选项不在当前页，组件也会创建虚拟选项进行回显。

### Q: 为什么要使用对象形式的 modelValue？

A: 对象形式的好处：

1. 同时保存 value 和 label，无需额外管理
2. 自动处理跨页选择的回显问题
3. 简化表单数据处理逻辑

### Q: 如何在表单编辑时回显数据？

A: 直接设置对象形式的值即可：

```typescript
// 从后端获取数据
const data = await fetchFormData()

// 直接设置，组件会自动回显
form.value = {
  user: {
    id: data.userId,
    name: data.userName
  }
}
```

### Q: 每次打开下拉框都会发送请求吗？

A: 是的，这是远程搜索组件的正常行为。如果需要缓存数据，可以在 fetchData 函数中自行实现缓存逻辑。

### Q: 如何自定义分页器的样式？

A: 可以通过 CSS 变量或者 `popper-class` 属性来自定义样式。参考"样式自定义"章节。

### Q: 组件支持哪些 Element Plus Select 的原生属性？

A: 组件通过 `v-bind="$attrs"` 支持大部分 Element Plus Select 的原生属性，例如 `disabled`、`multiple`、`size` 等。

### Q: 虚拟选项是什么？

A: 虚拟选项是组件内部用于数据回显的机制。当选中的选项不在当前页时，组件会创建一个虚拟选项用于显示，但该虚拟选项不会在下拉列表中显示。

### Q: 如何获取选中项的完整信息？

A: 通过 `change` 事件的第一个参数即可获取完整信息：

```typescript
// 单选模式
const handleChange = (value, option) => {
  console.log(value) // { id: 1, name: '张三' }
  console.log(option) // 完整的选项对象，包含所有字段
}

// 多选模式
const handleMultipleChange = (value, options) => {
  console.log(value) // [{ id: 1, name: '张三' }, { id: 2, name: '李四' }]
  console.log(options) // 完整的选项对象数组
}
```

### Q: 如何启用多选模式？

A: 通过设置 `multiple` 属性为 `true` 即可启用多选模式：

```vue
<IipPaginationSelect v-model="selectedUsers" :fetch-data="fetchUserData" multiple />

<script setup>
// 多选模式下 modelValue 必须是数组
const selectedUsers = ref([])
</script>
```

### Q: 多选模式下如何设置初始值？

A: 直接设置对象数组即可：

```typescript
// 设置初始选中值
const selectedUsers = ref([
  { id: 16, name: '用户16' },
  { id: 17, name: '用户17' }
])
```

组件会自动回显这些值，即使它们不在当前页。

### Q: 多选模式下清空后 modelValue 是什么？

A: 多选模式下清空后 modelValue 是空数组 `[]`，单选模式下是 `null`。

```typescript
// 多选模式
watch(selectedUsers, val => {
  console.log(val) // [] 或 [{ id: 1, name: '用户1' }, ...]
})

// 单选模式
watch(selectedUser, val => {
  console.log(val) // null 或 { id: 1, name: '用户1' }
})
```
