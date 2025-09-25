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
- 🔄 编辑模式数据回显优化
- 📋 虚拟选项机制，支持预设值显示

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
      display-label="用户 25"
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

// 模拟后端返回的表单数据
const formData = {
  userId: 'user-25',
  userName: '用户 25'
}

// 设置查看模式的数据
selectedValue.value = formData.userId

const fetchUserData = async params => {
  // 查看模式下不会调用此函数
  // 只在编辑模式下才会调用
  const response = await fetch(
    `/api/users?page=${params.page}&size=${params.pageSize}&search=${params.keyword}`
  )
  return await response.json()
}
</script>
```

## 编辑模式数据回显

组件支持在编辑模式下进行数据回显，即使当前选项列表中没有对应的数据项，组件也能正确显示已选中的值。

### 基础回显（使用 displayLabel）

当你已经有选中项的标签文本时，可以直接使用 `displayLabel` 属性：

```vue
<template>
  <div>
    <IipPaginationSelect
      v-model="selectedUserId"
      :fetch-data="fetchUsers"
      display-label="张三"
      placeholder="请选择用户"
      value-key="id"
      label-key="name"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

// 从后端获取的表单数据
const selectedUserId = ref('user-123') // 已选中的用户ID

const fetchUsers = async params => {
  const response = await fetch(
    `/api/users?page=${params.page}&size=${params.pageSize}&search=${params.keyword}`
  )
  return await response.json()
}
</script>
```

### 动态回显（表单编辑场景）

在表单编辑场景中，通常需要根据后端返回的数据动态设置回显：

```vue
<template>
  <div>
    <IipPaginationSelect
      v-model="form.userId"
      :fetch-data="fetchUsers"
      :display-label="form.userName"
      placeholder="请选择用户"
      value-key="id"
      label-key="name"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

const form = ref({
  userId: '',
  userName: ''
})

// 模拟获取表单数据
onMounted(async () => {
  // 从后端获取表单数据
  const response = await fetch('/api/form/123')
  const formData = await response.json()

  form.value = {
    userId: formData.userId, // 'user-123'
    userName: formData.userName // '张三'
  }
})

const fetchUsers = async params => {
  const response = await fetch(
    `/api/users?page=${params.page}&size=${params.pageSize}&search=${params.keyword}`
  )
  return await response.json()
}
</script>
```

### 虚拟选项机制

组件内部使用虚拟选项机制来实现数据回显：

1. **检测回显需求**：当 `modelValue` 有值但在当前选项列表中找不到对应项时
2. **创建虚拟选项**：自动创建一个虚拟选项用于显示
3. **优先级处理**：虚拟选项会被添加到选项列表的最前面
4. **事件支持**：虚拟选项同样支持 `change` 事件

```javascript
// 组件内部逻辑示例
const displayOptions = computed(() => {
  const baseOptions = [...options.value]

  // 如果有选中值但找不到对应选项，创建虚拟选项
  if (props.modelValue && !baseOptions.find(item => item[props.valueKey] === props.modelValue)) {
    const virtualOption = {
      [props.valueKey]: props.modelValue,
      [props.labelKey]: props.displayLabel || String(props.modelValue),
      _isVirtual: true // 标记为虚拟选项
    }
    return [virtualOption, ...baseOptions]
  }

  return baseOptions
})
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

| 属性名         | 类型            | 默认值     | 说明                                             |
| -------------- | --------------- | ---------- | ------------------------------------------------ |
| modelValue     | `any`           | -          | 绑定值                                           |
| placeholder    | `string`        | `'请选择'` | 占位符                                           |
| valueKey       | `string`        | `'value'`  | 选项值的键名                                     |
| labelKey       | `string`        | `'label'`  | 选项标签的键名                                   |
| pageSize       | `number`        | `10`       | 每页显示条数                                     |
| clearable      | `boolean`       | `true`     | 是否可清空                                       |
| showPagination | `boolean`       | `true`     | 是否显示分页器                                   |
| popperClass    | `string`        | `''`       | 下拉框类名                                       |
| debounceTime   | `number`        | `300`      | 搜索防抖时间(ms)                                 |
| fetchData      | `Function`      | -          | 获取数据的方法（编辑模式下必需，查看模式下可选） |
| viewMode       | `boolean`       | `false`    | 是否为查看模式（禁用交互，不发起请求）           |
| displayLabel   | `string`        | `''`       | 查看模式或编辑模式回显时直接显示的标签文本       |
| style          | `CSSProperties` | `{}`       | 组件样式对象                                     |

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

### 4. 编辑模式数据回显

当编辑已有数据时，组件会自动处理数据回显：

```vue
<template>
  <div>
    <IipPaginationSelect
      v-model="form.categoryId"
      :fetch-data="fetchCategories"
      :display-label="form.categoryName"
      placeholder="请选择分类"
      value-key="id"
      label-key="name"
      :page-size="20"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IipPaginationSelect } from '@bingwu/iip-ui-components'

const form = ref({
  categoryId: '',
  categoryName: ''
})

// 加载表单数据
onMounted(async () => {
  const response = await fetch('/api/product/123')
  const data = await response.json()

  form.value = {
    categoryId: data.categoryId, // 'cat-456'
    categoryName: data.categoryName // '电子产品'
  }
})

const fetchCategories = async params => {
  const response = await fetch(
    `/api/categories?page=${params.page}&size=${params.pageSize}&search=${params.keyword}`
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
<!-- 查看模式下组件会自动跳过数据请求 -->
<IipPaginationSelect
  v-model="selectedValue"
  :view-mode="true"
  :display-label="displayLabel"
  :fetch-data="fetchData"
/>

<!-- 编辑模式数据回显优化 -->
<IipPaginationSelect
  v-model="form.userId"
  :fetch-data="fetchUsers"
  :display-label="form.userName"
  placeholder="请选择用户"
/>
```

## 注意事项

1. **必需属性**：`fetchData` 属性在编辑模式下是必需的，查看模式下可选
2. **数据格式**：返回的数据格式必须符合 `FetchDataResult` 接口
3. **查看模式**：启用 `viewMode` 时，建议同时提供 `displayLabel` 以获得最佳显示效果
4. **性能考虑**：查看模式下不会发起数据请求，提升页面加载性能
5. **状态管理**：组件会自动处理加载状态和错误状态
6. **防抖处理**：搜索功能内置防抖处理，避免频繁请求
7. **分页显示**：分页器只在数据总数大于每页显示条数时显示
8. **数据回显**：组件支持编辑模式下的数据回显，通过虚拟选项机制实现
9. **兼容性**：所有新功能都向下兼容，不影响现有代码
10. **样式定制**：支持通过 `style`、`popperClass` 和 CSS 变量多种方式自定义样式
11. **实例方法**：可通过 `getSelectInstance` 方法获取内部 ElSelect 实例，进行更深层次的操作
12. **虚拟选项**：编辑模式下的虚拟选项不会在下拉列表中显示，仅用于回显

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

### Q: 编辑模式下如何实现数据回显？

A: 组件会自动处理数据回显。当 `modelValue` 有值但在当前选项列表中找不到对应项时，会创建虚拟选项来显示。建议配合 `displayLabel` 属性使用以获得最佳显示效果。

### Q: 虚拟选项是什么？会影响用户选择吗？

A: 虚拟选项是组件内部用于数据回显的机制，它们不会在下拉列表中显示（通过 `v-show="!item._isVirtual"` 控制），仅用于在输入框中显示已选中的值，不会影响用户的正常选择操作。

### Q: 如何获取选中项的完整信息？

A: 可以通过 `change` 事件的第二个参数获取选中项的完整信息，或者使用 `getSelectInstance` 方法获取内部 Select 实例。

### Q: 组件的样式如何自定义？

A: 支持三种方式：1) 通过 `style` 属性设置组件本身样式；2) 通过 `popperClass` 设置下拉框样式；3) 通过 CSS 变量自定义主题色彩。
