# IipPaginationSelect 分页选择器

基于 Element Plus 的 `el-select` 组件二次封装，支持下拉分页搜索功能。

## 特性

- 🔍 支持远程搜索
- 📄 内置分页功能
- ⚡ 搜索防抖
- 👁️ 查看模式支持（表单只读状态）
- 🎯 TypeScript 支持
- 🛠️ 灵活的数据获取接口
- 🚀 性能优化，避免重复请求

## 基础用法

```vue
<template>
  <div>
    <IipPaginationSelect
      v-model="selectedValue"
      :fetch-data="fetchUserData"
      placeholder="请选择用户"
      value-key="id"
      label-key="name"
      :page-size="20"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'
import type { FetchDataParams, FetchDataResult } from '@bingwu/iip-ui-components'

const selectedValue = ref()

// 模拟数据获取函数
const fetchUserData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  const { page, pageSize, keyword } = params

  // 这里调用你的 API
  const response = await fetch(`/api/users?page=${page}&size=${pageSize}&search=${keyword}`)
  const data = await response.json()

  return {
    data: data.list, // 数据列表
    total: data.total // 总数
  }
}
</script>
```

## 查看模式用法

当组件用于表单查看状态时，可以启用查看模式，避免不必要的数据请求：

```vue
<template>
  <div>
    <!-- 编辑模式 -->
    <IipPaginationSelect
      v-if="!isViewMode"
      v-model="selectedValue"
      :fetch-data="fetchUserData"
      placeholder="请选择用户"
      value-key="id"
      label-key="name"
    />

    <!-- 查看模式 -->
    <IipPaginationSelect
      v-else
      v-model="selectedValue"
      :view-mode="true"
      :display-label="selectedUserLabel"
      :fetch-data="fetchUserData"
      value-key="id"
      label-key="name"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

const isViewMode = ref(true)
const selectedValue = ref('user-25') // 后端返回的值
const selectedUserLabel = ref('用户 25') // 后端返回的标签

// 模拟后端返回的表单数据
const formData = {
  userId: 'user-25',
  userName: '用户 25'
}

// 设置查看模式的数据
selectedValue.value = formData.userId
selectedUserLabel.value = formData.userName

const fetchUserData = async params => {
  // 查看模式下不会调用此函数
  // 只在编辑模式下才会调用
}
</script>
```

## 高级用法

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
      :immediate="true"
      :clear-options-on-close="true"
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
  PaginationSelectInstance,
  OptionItem
} from '@bingwu/iip-ui-components'

const selectedValue = ref()
const selectRef = ref<PaginationSelectInstance>()

const fetchData = async (params: FetchDataParams): Promise<FetchDataResult> => {
  // 实现你的数据获取逻辑
  console.log('获取数据参数:', params)

  return {
    data: [],
    total: 0
  }
}

const handleChange = (value: any, option?: OptionItem) => {
  console.log('选择变化:', value, option)
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

## API

### Props

| 属性名              | 类型            | 默认值     | 说明                                   |
| ------------------- | --------------- | ---------- | -------------------------------------- |
| modelValue          | `any`           | -          | 绑定值                                 |
| placeholder         | `string`        | `'请选择'` | 占位符                                 |
| valueKey            | `string`        | `'value'`  | 选项值的键名                           |
| labelKey            | `string`        | `'label'`  | 选项标签的键名                         |
| pageSize            | `number`        | `10`       | 每页显示条数                           |
| clearable           | `boolean`       | `true`     | 是否可清空                             |
| showPagination      | `boolean`       | `true`     | 是否显示分页器                         |
| popperClass         | `string`        | `''`       | 下拉框类名                             |
| debounceTime        | `number`        | `300`      | 搜索防抖时间(ms)                       |
| immediate           | `boolean`       | `false`    | 是否立即加载数据                       |
| fetchData           | `Function`      | -          | **必需**，获取数据的方法               |
| viewMode            | `boolean`       | `false`    | 是否为查看模式（禁用交互，不发起请求） |
| displayLabel        | `string`        | `''`       | 查看模式下直接显示的标签文本           |
| style               | `CSSProperties` | `{}`       | 组件样式对象                           |
| clearOptionsOnClose | `boolean`       | `false`    | 关闭下拉框时是否清空选项列表           |

### Events

| 事件名            | 参数                                | 说明            |
| ----------------- | ----------------------------------- | --------------- |
| update:modelValue | `(value: any)`                      | 绑定值更新      |
| change            | `(value: any, option?: OptionItem)` | 选择变化        |
| clear             | `()`                                | 清空选择        |
| visible-change    | `(visible: boolean)`                | 下拉框显示/隐藏 |
| data-loaded       | `(result: FetchDataResult)`         | 数据加载完成    |
| error             | `(error: any)`                      | 数据加载错误    |

### Methods

| 方法名            | 参数                | 说明                   |
| ----------------- | ------------------- | ---------------------- |
| refresh           | `()`                | 刷新数据               |
| search            | `(keyword: string)` | 搜索指定关键词         |
| getSelectInstance | `()`                | 获取内部 ElSelect 实例 |

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

// 组件实例接口
interface PaginationSelectInstance {
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
  /** 获取Select组件实例 */
  getSelectInstance: () => InstanceType<typeof ElSelect>
}
```

## 样式自定义

组件支持通过多种方式自定义样式：

### 1. CSS 变量自定义

```css
.pagination-select-popper {
  --el-border-color-light: #e4e7ed;
  --el-bg-color: #ffffff;
  --el-text-color-regular: #606266;
  --el-pagination-font-size: 12px;
}
```

### 2. 通过 popperClass 自定义

```vue
<template>
  <IipPaginationSelect
    v-model="selectedValue"
    :fetch-data="fetchData"
    popper-class="custom-pagination-select"
  />
</template>

<style>
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
</style>
```

### 3. 通过 style 属性自定义组件本身

```vue
<IipPaginationSelect
  v-model="selectedValue"
  :fetch-data="fetchData"
  :style="{ width: '300px', marginBottom: '16px' }"
/>
```

## 使用场景

### 1. 表单编辑模式

```vue
<IipPaginationSelect
  v-model="form.userId"
  :fetch-data="fetchUsers"
  placeholder="请选择用户"
  value-key="id"
  label-key="name"
/>
```

### 2. 表单查看模式

```vue
<IipPaginationSelect
  v-model="form.userId"
  :view-mode="true"
  :display-label="form.userName"
  :fetch-data="fetchUsers"
  value-key="id"
  label-key="name"
/>
```

### 3. 动态切换模式

```vue
<IipPaginationSelect
  v-model="form.userId"
  :view-mode="isReadonly"
  :display-label="isReadonly ? form.userName : ''"
  :fetch-data="fetchUsers"
  value-key="id"
  label-key="name"
/>
```

### 4. 性能优化 - 关闭时清空选项

当数据量较大时，可以启用 `clearOptionsOnClose` 来优化内存使用：

```vue
<template>
  <div>
    <IipPaginationSelect
      v-model="selectedValue"
      :fetch-data="fetchLargeDataSet"
      :clear-options-on-close="true"
      placeholder="搜索大数据集"
      value-key="id"
      label-key="name"
      :page-size="50"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

const selectedValue = ref()

// 模拟大数据集获取
const fetchLargeDataSet = async params => {
  // 获取大量数据的API调用
  const response = await fetch(
    `/api/large-dataset?page=${params.page}&size=${params.pageSize}&search=${params.keyword}`
  )
  return await response.json()
}
</script>
```

## 最佳实践

### 1. 查看模式的数据处理

```javascript
// 后端返回表单数据时，同时返回 value 和 label
const formData = {
  userId: 'user-123',
  userName: '张三'
  // 其他字段...
}

// 设置到组件
const selectedUserId = ref(formData.userId)
const selectedUserName = ref(formData.userName)
```

### 2. 错误处理

```vue
<IipPaginationSelect v-model="selectedValue" :fetch-data="fetchData" @error="handleError" />

<script setup>
const handleError = error => {
  console.error('数据加载失败:', error)
  // 显示错误提示
  ElMessage.error('数据加载失败，请重试')
}
</script>
```

### 3. 性能优化

```vue
<!-- 避免在查看模式下传入 fetchData -->
<IipPaginationSelect
  v-model="selectedValue"
  :view-mode="true"
  :display-label="displayLabel"
  :fetch-data="isViewMode ? undefined : fetchData"
/>
```

## 注意事项

1. **必需属性**：`fetchData` 属性在编辑模式下是必需的
2. **数据格式**：返回的数据格式必须符合 `FetchDataResult` 接口
3. **查看模式**：启用 `viewMode` 时，必须同时提供 `displayLabel`
4. **性能考虑**：查看模式下不会发起数据请求，提升页面加载性能
5. **状态管理**：组件会自动处理加载状态和错误状态
6. **防抖处理**：搜索功能内置防抖处理，避免频繁请求
7. **分页显示**：分页器只在数据总数大于每页显示条数时显示
8. **兼容性**：查看模式功能向下兼容，不影响现有代码
9. **内存优化**：启用 `clearOptionsOnClose` 可在关闭下拉框时清空选项列表，适用于大数据集场景
10. **样式定制**：支持通过 `style`、`popperClass` 和 CSS 变量多种方式自定义样式
11. **实例方法**：可通过 `getSelectInstance` 方法获取内部 ElSelect 实例，进行更深层次的操作

## 常见问题

### Q: 为什么每次打开下拉框都会发送请求？

A: 这是 Element Plus Select 组件的正常行为。当设置了 `remote="true"` 时，组件会自动调用 `remote-method` 来获取数据。我们已经优化了重复请求的问题。

### Q: 查看模式下还会发送数据请求吗？

A: 不会。查看模式下组件会禁用所有交互功能，包括数据请求，从而提升性能。

### Q: 如何在查看模式下显示选中的值？

A: 需要同时设置 `view-mode="true"` 和 `display-label`，组件会创建虚拟选项来显示标签。

### Q: 选中第二页的数据后，重新打开为什么显示第一页？

A: 这是设计如此。组件会重置到第一页以提供一致的用户体验，但选中的值会保持不变。

### Q: 如何自定义分页器的样式？

A: 可以通过 CSS 变量或者 `popper-class` 属性来自定义样式。

### Q: 组件支持哪些 Element Plus Select 的原生属性？

A: 组件通过 `v-bind="$attrs"` 支持大部分 Element Plus Select 的原生属性，但某些属性可能会被覆盖以保证分页功能正常工作。

### Q: clearOptionsOnClose 什么时候使用？

A: 当处理大数据集时，启用此选项可以在关闭下拉框时清空选项列表，释放内存。但注意这会导致重新打开时需要重新加载数据。

### Q: 如何获取选中项的完整信息？

A: 可以通过 `change` 事件的第二个参数获取选中项的完整信息，或者使用 `getSelectInstance` 方法获取内部 Select 实例。

### Q: 组件的样式如何自定义？

A: 支持三种方式：1) 通过 `style` 属性设置组件本身样式；2) 通过 `popperClass` 设置下拉框样式；3) 通过 CSS 变量自定义主题色彩。
