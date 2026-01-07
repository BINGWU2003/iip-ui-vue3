# DialogSelect 弹窗选择器

基于 Element Plus 的 `el-dialog` 和 VXE-Table 的 `vxe-grid` 组件二次封装，提供了弹窗形式的表格选择功能，支持单选、多选、表单筛选等功能。

## 特性

- 🎯 **弹窗选择**: 点击输入框打开弹窗，在表格中选择数据
- 📋 **表格展示**: 使用 VXE-Table 高性能表格组件展示数据
- 🔍 **表单筛选**: 支持 input、select、date 三种类型的筛选条件
- ✅ **单选/多选**: 支持单选和多选两种模式
- 🔑 **灵活 Key**: 支持自定义 keyGetter 函数，处理复合 key 场景
- 📄 **分页支持**: 内置分页功能，支持切换每页显示条数
- 🔄 **数据回显**: 自动回显已选中的数据，支持跨页选择
- 🎨 **样式定制**: 支持透传 vxe-grid 的所有配置
- ⚡ **异步选项**: 支持从接口异步获取下拉选项数据
- 🛠️ **TypeScript**: 完整的 TypeScript 类型支持
- 📝 **统一配置**: 通过 `dialogSelectOptions` 统一配置表格列和表单项，提取公共字段 `field` 和 `title`

## 基础用法

基础用法包含多选和表单筛选功能：

<script setup>
import Basic from '../examples/dialog-select/basic.vue'
</script>

<Basic />

::: details 查看代码
<<< @/examples/dialog-select/basic.vue
:::

## 多选模式

设置 `multiple` 属性为 `true` 启用多选模式：

```vue
<template>
  <div>
    <IipDialogSelect
      v-model="selectedEmployees"
      :fetch-data="fetchEmployeeData"
      :dialog-select-options="employeeDialogSelectOptions"
      :multiple="true"
      placeholder="请选择员工（可多选）"
      dialog-title="选择员工（多选）"
      @change="handleChange"
    />

    <div v-if="selectedEmployees && selectedEmployees.length > 0" style="margin-top: 10px;">
      已选择 {{ selectedEmployees.length }} 个员工：
      <ul>
        <li v-for="emp in selectedEmployees" :key="emp.id">
          {{ emp.name }} ({{ emp.department }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions,
  TableRowItem
} from '@bingwu/iip-ui-components'

// 模拟员工数据
const mockEmployees = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

// DialogSelect 选项配置
const employeeDialogSelectOptions: DialogSelectOptions = [
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  { field: 'name', title: '姓名', columnProps: { width: 120 } },
  { field: 'department', title: '部门', columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } }
]

// 获取员工数据
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams
): Promise<FetchDialogSelectDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize } = params

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockEmployees.slice(start, end)

  return {
    data,
    total: mockEmployees.length
  }
}

// 多选时 modelValue 是数组
const selectedEmployees = ref<TableRowItem[] | null>(null)

const handleChange = (value: TableRowItem[] | null, selectedRows: TableRowItem[]) => {
  console.log('选中的员工：', value)
}
</script>
```

## 表单筛选

通过 `dialogSelectOptions` 配置筛选表单，使用 `useForm: true` 标识表单项，支持 input、select、date 三种类型：

```vue
<template>
  <div>
    <IipDialogSelect
      v-model="selectedEmployee"
      :fetch-data="fetchEmployeeData"
      :dialog-select-options="employeeDialogSelectOptions"
      placeholder="请选择员工（带筛选）"
      dialog-title="选择员工（带筛选）"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions,
  TableRowItem
} from '@bingwu/iip-ui-components'

// 模拟员工数据
const mockEmployees = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

// DialogSelect 选项配置（合并 columns 和 formItems）
const employeeDialogSelectOptions: DialogSelectOptions = [
  // 表格列配置（useForm 默认为 false）
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  { field: 'name', title: '姓名', columnProps: { width: 120 } },
  { field: 'department', title: '部门', columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } },
  // 表单配置（用于筛选，useForm 设置为 true）
  {
    field: 'name',
    title: '姓名',
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'department',
    title: '部门',
    useForm: true,
    formItemProps: {
      formType: 'select',
      placeholder: '请选择部门',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '运营部', value: '运营部' },
        { label: '市场部', value: '市场部' },
        { label: '人事部', value: '人事部' }
      ]
    }
  },
  {
    field: 'createDate',
    title: '创建日期',
    useForm: true,
    formItemProps: {
      formType: 'date',
      placeholder: '请选择创建日期'
    }
  }
]

// 获取员工数据（需要处理筛选参数）
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams
): Promise<FetchDialogSelectDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, name, department } = params

  // 根据筛选条件过滤
  let filteredEmployees = mockEmployees
  if (name) {
    filteredEmployees = filteredEmployees.filter(employee => employee.name.includes(name as string))
  }
  if (department) {
    filteredEmployees = filteredEmployees.filter(employee => employee.department === department)
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredEmployees.slice(start, end)

  return {
    data,
    total: filteredEmployees.length
  }
}

const selectedEmployee = ref<TableRowItem | null>(null)

const handleChange = (value: TableRowItem | null, selectedRows: TableRowItem[]) => {
  console.log('选中的员工：', value)
}
</script>
```

## 异步选项数据

`select` 类型的 `options` 支持函数形式，可以从接口异步获取：

```vue
<script setup lang="ts">
import type { DialogSelectOptions } from '@bingwu/iip-ui-components'

// 模拟部门数据
const mockDepartments = [
  { id: 'tech', name: '技术部' },
  { id: 'product', name: '产品部' },
  { id: 'operation', name: '运营部' },
  { id: 'market', name: '市场部' },
  { id: 'hr', name: '人事部' }
]

const employeeDialogSelectOptions: DialogSelectOptions = [
  // ... 其他配置
  {
    field: 'department',
    title: '部门',
    useForm: true,
    formItemProps: {
      formType: 'select',
      placeholder: '请选择部门',
      // 使用函数返回选项，支持从接口获取
      options: async () => {
        // 模拟从接口获取数据（实际使用时替换为真实 API 调用）
        await new Promise(resolve => setTimeout(resolve, 200))
        return mockDepartments.map(item => ({
          label: item.name,
          value: item.id
        }))
      }
    }
  }
]
</script>
```

## 默认值配置

表单项支持通过 `defaultValue` 设置默认值，可以是值或函数：

```vue
<script setup lang="ts">
import type { DialogSelectOptions } from '@bingwu/iip-ui-components'

const productDialogSelectOptions: DialogSelectOptions = [
  // ... 其他配置
  {
    field: 'name',
    title: '产品名称',
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入产品名称',
      // 方式1：直接值
      defaultValue: '产品'
    }
  },
  {
    field: 'category',
    title: '分类',
    useForm: true,
    formItemProps: {
      formType: 'select',
      placeholder: '请选择分类',
      // 方式2：同步函数
      defaultValue: () => '电子产品',
      options: [
        { label: '电子产品', value: '电子产品' },
        { label: '服装', value: '服装' }
      ]
    }
  }
]
</script>
```

## 自定义 valueKey 和 labelKey

当数据结构的键名不是 `id` 和 `name` 时，可以自定义：

```vue
<template>
  <IipDialogSelect
    v-model="selectedProduct"
    :fetch-data="fetchProductData"
    :dialog-select-options="productDialogSelectOptions"
    value-key="productId"
    label-key="productName"
    placeholder="请选择产品"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions,
  TableRowItem
} from '@bingwu/iip-ui-components'

// 模拟产品数据
const mockProducts = Array.from({ length: 50 }, (_, i) => ({
  productId: `PROD-${String(i + 1).padStart(3, '0')}`,
  productName: `产品${i + 1}`,
  price: (Math.random() * 1000).toFixed(2),
  category: ['电子产品', '服装', '食品', '家居'][i % 4]
}))

const productDialogSelectOptions: DialogSelectOptions = [
  { field: 'productId', title: '产品ID', columnProps: { width: 120 } },
  { field: 'productName', title: '产品名称', columnProps: { width: 150 } },
  { field: 'price', title: '价格', columnProps: { width: 100 } },
  { field: 'category', title: '分类', columnProps: { width: 120 } }
]

// 获取产品数据
const fetchProductData = async (
  params: FetchDialogSelectDataParams
): Promise<FetchDialogSelectDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize } = params

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockProducts.slice(start, end)

  return {
    data,
    total: mockProducts.length
  }
}

const selectedProduct = ref<TableRowItem | null>(null)

const handleChange = (value: TableRowItem | null, selectedRows: TableRowItem[]) => {
  console.log('选中的产品：', value)
}
</script>
```

## 自定义 keyGetter

当需要复合 key（多个字段拼接）时，可以使用 `keyGetter` 函数：

```vue
<template>
  <IipDialogSelect
    v-model="selectedProduct"
    :fetch-data="fetchProductData"
    :dialog-select-options="productDialogSelectOptions"
    :key-getter="productKeyGetter"
    value-key="id"
    label-key="name"
    placeholder="请选择产品"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions
} from '@bingwu/iip-ui-components'

// 定义产品数据类型
interface ProductRow {
  id: string
  name: string
  price: string
  category: string
}

// 模拟产品数据
const mockProducts: ProductRow[] = Array.from({ length: 50 }, (_, i) => ({
  id: `PROD-${String(i + 1).padStart(3, '0')}`,
  name: `产品${i + 1}`,
  price: (Math.random() * 1000).toFixed(2),
  category: ['电子产品', '服装', '食品', '家居'][i % 4]
}))

const productDialogSelectOptions: DialogSelectOptions = [
  { field: 'id', title: '产品ID', columnProps: { width: 120 } },
  { field: 'name', title: '产品名称', columnProps: { width: 150 } },
  { field: 'price', title: '价格', columnProps: { width: 100 } },
  { field: 'category', title: '分类', columnProps: { width: 120 } }
]

// 获取产品数据（使用泛型）
const fetchProductData = async (
  params: FetchDialogSelectDataParams<ProductRow>
): Promise<FetchDialogSelectDataResult<ProductRow>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize } = params

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockProducts.slice(start, end)

  return {
    data,
    total: mockProducts.length
  }
}

// 使用 id 和 category 拼接作为 key（类型已推导）
const productKeyGetter = (row: ProductRow) => {
  // ✅ row 类型为 ProductRow
  return `${row.id}-${row.category}`
}

const selectedProduct = ref<ProductRow | null>(null)
</script>
```

## 透传 vxe-grid 配置

通过 `gridConfig` prop 可以透传 vxe-grid 的所有配置：

```vue
<template>
  <IipDialogSelect
    v-model="selectedEmployee"
    :fetch-data="fetchEmployeeData"
    :dialog-select-options="employeeDialogSelectOptions"
    :grid-config="{
      border: false,
      height: '600px',
      stripe: true,
      resizable: true,
      showOverflow: 'tooltip'
    }"
    placeholder="请选择员工"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions,
  TableRowItem
} from '@bingwu/iip-ui-components'

// 模拟员工数据
const mockEmployees = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

const employeeDialogSelectOptions: DialogSelectOptions = [
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  { field: 'name', title: '姓名', columnProps: { width: 120 } },
  { field: 'department', title: '部门', columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } }
]

// 获取员工数据
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams
): Promise<FetchDialogSelectDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize } = params

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockEmployees.slice(start, end)

  return {
    data,
    total: mockEmployees.length
  }
}

const selectedEmployee = ref<TableRowItem | null>(null)
</script>
```

## 组件方法

通过 ref 可以调用组件的方法：

```vue
<template>
  <div>
    <IipDialogSelect
      ref="dialogSelectRef"
      v-model="selectedEmployee"
      :fetch-data="fetchEmployeeData"
      :dialog-select-options="employeeDialogSelectOptions"
      placeholder="请选择员工"
    />

    <el-button @click="handleOpen">打开弹窗</el-button>
    <el-button @click="handleClose">关闭弹窗</el-button>
    <el-button @click="handleRefresh">刷新数据</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IipDialogSelect } from '@bingwu/iip-ui-components'
import type {
  DialogSelectInstance,
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions
} from '@bingwu/iip-ui-components'

// 定义员工数据类型
interface EmployeeRow {
  id: number
  name: string
  department: string
  email: string
  phone: string
  status: string
}

// 模拟员工数据
const mockEmployees: EmployeeRow[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

const employeeDialogSelectOptions: DialogSelectOptions = [
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  { field: 'name', title: '姓名', columnProps: { width: 120 } },
  { field: 'department', title: '部门', columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } }
]

// 获取员工数据（使用泛型）
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams<EmployeeRow>
): Promise<FetchDialogSelectDataResult<EmployeeRow>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize } = params

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockEmployees.slice(start, end)

  return {
    data,
    total: mockEmployees.length
  }
}

const selectedEmployee = ref<EmployeeRow | null>(null)
// ✅ 使用泛型，tableData 类型为 Readonly<Ref<EmployeeRow[]>>
const dialogSelectRef = ref<DialogSelectInstance<EmployeeRow>>()

const handleOpen = () => {
  dialogSelectRef.value?.open()
}

const handleClose = () => {
  dialogSelectRef.value?.close()
}

const handleRefresh = () => {
  dialogSelectRef.value?.refresh()
}
</script>
```

## API

### Props

组件支持泛型参数，传入具体类型后可以获得完整的类型推导：

```typescript
interface EmployeeRow {
  id: number
  name: string
  department: string
}

// 使用泛型
<IipDialogSelect<EmployeeRow> ... />
```

| 参数                | 说明                                                   | 类型                                                                                  | 默认值     |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------- |
| modelValue          | 绑定值，单选时为对象，多选时为对象数组                 | `T \| T[] \| null`（`T` 为泛型参数，默认为 `BaseRecord`）                             | `null`     |
| placeholder         | 占位符                                                 | `string`                                                                              | `'请选择'` |
| multiple            | 是否多选                                               | `boolean`                                                                             | `false`    |
| valueKey            | 选项值的键名                                           | `string`                                                                              | `'id'`     |
| labelKey            | 选项标签的键名（用于显示在输入框中）                   | `string`                                                                              | `'name'`   |
| keyGetter           | 获取行的唯一标识key的函数，如果不提供则使用valueKey    | `(row: T) => string \| number`（`T` 为泛型参数）                                      | -          |
| clearable           | 是否可清空                                             | `boolean`                                                                             | `true`     |
| disabled            | 是否禁用                                               | `boolean`                                                                             | `false`    |
| dialogTitle         | 弹窗标题                                               | `string`                                                                              | `'请选择'` |
| dialogWidth         | 弹窗宽度                                               | `string \| number`                                                                    | `'1100px'` |
| fetchData           | 获取数据的方法                                         | `(params: FetchDialogSelectDataParams<T>) => Promise<FetchDialogSelectDataResult<T>>` | -          |
| dialogSelectOptions | DialogSelect 选项配置数组（合并 columns 和 formItems） | `DialogSelectOptions`                                                                 | -          |
| gridConfig          | vxe-grid 配置，支持透传 vxe-grid 的所有 props          | `VxeGridProps`                                                                        | -          |
| style               | 输入框样式                                             | `CSSProperties`                                                                       | -          |
| scrollToTopLeft     | 数据加载后是否滚动到顶部和左部                         | `boolean`                                                                             | `false`    |

**泛型参数说明：**

- `T`: 表格行数据类型，默认为 `BaseRecord`（即 `Record<string, any>`）
- 传入具体类型后，`modelValue`、`keyGetter`、`fetchData` 等都会自动推导类型

### DialogSelectOption

| 参数          | 说明                                                                        | 类型                                       | 默认值  |
| ------------- | --------------------------------------------------------------------------- | ------------------------------------------ | ------- |
| field         | 字段名（公共字段）                                                          | `string`                                   | -       |
| title         | 标题（公共字段）                                                            | `string`                                   | -       |
| useForm       | 是否是表单项，默认为 false                                                  | `boolean`                                  | `false` |
| columnProps   | 列配置属性（当作为表格列时使用），继承 VxeColumnProps 但剔除 field 和 title | `Omit<VxeColumnProps, 'field' \| 'title'>` | -       |
| formItemProps | 表单项配置属性（当作为表单项时使用）                                        | `FormItemProps`                            | -       |

### FormItemProps

| 参数          | 说明                                                             | 类型                                                                        | 默认值 |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| formType      | 表单项类型：input（输入框）、select（下拉框）或 date（日期选择） | `'input' \| 'select' \| 'date'`                                             | -      |
| placeholder   | 占位符                                                           | `string`                                                                    | -      |
| options       | 下拉选项（当formType为select时使用），可以是数组或返回数组的函数 | `FormItemOption[] \| (() => FormItemOption[] \| Promise<FormItemOption[]>)` | -      |
| defaultValue  | 默认值，可以是值或返回值的同步函数                               | `any \| (() => any)`                                                        | -      |
| [key: string] | 其他属性，会透传给对应的组件                                     | `any`                                                                       | -      |

### Events

| 事件名                | 说明          | 回调参数                                                         |
| --------------------- | ------------- | ---------------------------------------------------------------- |
| update:modelValue     | 更新绑定值    | `(value: T \| T[] \| null)`（`T` 为泛型参数）                    |
| change                | 选择变化      | `(value: T \| T[] \| null, selectedRows: T[])`（`T` 为泛型参数） |
| clear                 | 清空          | -                                                                |
| dialog-visible-change | 弹窗打开/关闭 | `(visible: boolean)`                                             |
| data-loaded           | 数据加载完成  | `(result: FetchDialogSelectDataResult<T>)`（`T` 为泛型参数）     |
| error                 | 错误          | `(error: any)`                                                   |
| form-change           | 表单变化      | `(formData: Record<string, any>)`                                |

### Methods

通过 ref 可以调用以下方法：

| 方法名  | 说明     | 参数 |
| ------- | -------- | ---- |
| open    | 打开弹窗 | -    |
| close   | 关闭弹窗 | -    |
| refresh | 刷新数据 | -    |

### Instance 属性

通过 ref 可以访问以下只读属性：

| 属性名      | 说明     | 类型                                   |
| ----------- | -------- | -------------------------------------- |
| loading     | 加载状态 | `Readonly<Ref<boolean>>`               |
| tableData   | 表格数据 | `Readonly<Ref<T[]>>`（`T` 为泛型参数） |
| total       | 总数     | `Readonly<Ref<number>>`                |
| currentPage | 当前页   | `Readonly<Ref<number>>`                |

**使用示例：**

```typescript
import type { DialogSelectInstance } from '@bingwu/iip-ui-components'

interface EmployeeRow {
  id: number
  name: string
}

const dialogRef = ref<DialogSelectInstance<EmployeeRow>>()

// ✅ dialogRef.value.tableData 类型为 Readonly<Ref<EmployeeRow[]>>
```

## 类型定义

````typescript
import type { VxeGridProps, VxeColumnProps } from 'vxe-table'
import type { CSSProperties, Ref } from 'vue'

/** 基础对象类型，用作泛型约束和默认值 */
export type BaseRecord = Record<string, any>

/** 表格行数据类型（支持泛型，建议传入具体类型） */
export type TableRowItem<T extends BaseRecord = BaseRecord> = T

/** 基础分页参数 */
export type PaginationParams = {
  page: number
  pageSize: number
}

/**
 * 查询参数类型（支持泛型推导）
 * @template T - 表格行数据类型，查询参数会根据此类型推导
 * @description 包含必填的分页参数 + 表格字段的可选查询参数
 * @example
 * ```ts
 * interface UserRow {
 *   id: number
 *   name: string
 *   department: string
 * }
 * // params 类型为 { page: number, pageSize: number, id?: number, name?: string, department?: string }
 * const fetchData = (params: FetchDialogSelectDataParams<UserRow>) => { ... }
 * ```
 */
export type FetchDialogSelectDataParams<T extends BaseRecord = BaseRecord> = PaginationParams &
  Partial<T>

/**
 * 查询结果类型（支持泛型）
 * @template T - 表格行数据类型
 */
export type FetchDialogSelectDataResult<T extends BaseRecord = BaseRecord> = {
  data: T[]
  total: number
  [key: string]: any
}

// 表单项选项
export type FormItemOption = {
  label: string
  value: any
}

// 列配置类型（从 VxeColumnProps 中提取，剔除公共字段）
type VxeColumnItem = Omit<VxeColumnProps, 'field' | 'title'>

// DialogSelect 选项配置（合并 columns 和 formItems）
export type DialogSelectOption = {
  /** 字段名（公共字段） */
  field: string
  /** 标题（公共字段） */
  title: string
  /** 是否是表单项，默认为 false */
  useForm?: boolean
  /** 列配置属性（当作为表格列时使用），继承 VxeColumnProps 但剔除 field 和 title */
  columnProps?: VxeColumnItem
  /** 表单项配置属性（当作为表单项时使用） */
  formItemProps?: {
    /** 表单项类型：input（输入框）、select（下拉框）或 date（日期选择） */
    formType?: 'input' | 'select' | 'date'
    /** 占位符 */
    placeholder?: string
    /** 下拉选项（当formType为select时使用），可以是数组或返回数组的函数 */
    options?: FormItemOption[] | (() => FormItemOption[] | Promise<FormItemOption[]>)
    /** 默认值，可以是值或返回值的同步函数 */
    defaultValue?: any | (() => any)
    /** 其他属性，会透传给对应的组件 */
    [key: string]: any
  }
}

// DialogSelect 选项配置数组
export type DialogSelectOptions = DialogSelectOption[]

/**
 * DialogSelect 组件 Props（支持泛型）
 * @template T - 表格行数据类型，用于类型推导
 */
export type DialogSelectProps<T extends BaseRecord = BaseRecord> = {
  /** 绑定值，单选时为对象，多选时为对象数组 */
  modelValue?: T | T[] | null
  /** 占位符 */
  placeholder?: string
  /** 是否多选 */
  multiple?: boolean
  /** 选项值的键名 */
  valueKey?: string
  /** 选项标签的键名（用于显示在输入框中） */
  labelKey?: string
  /** 获取行的唯一标识key的函数，如果不提供则使用valueKey */
  keyGetter?: (row: T) => string | number
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 弹窗标题 */
  dialogTitle?: string
  /** 弹窗宽度 */
  dialogWidth?: string | number
  /** 获取数据的方法 */
  fetchData: (params: FetchDialogSelectDataParams<T>) => Promise<FetchDialogSelectDataResult<T>>
  /** DialogSelect 选项配置数组（合并 columns 和 formItems） */
  dialogSelectOptions: DialogSelectOptions
  /** vxe-grid 配置，支持透传 vxe-grid 的所有 props */
  gridConfig?: VxeGridProps
  /** 输入框样式 */
  style?: CSSProperties
}

/**
 * DialogSelect 组件实例（支持泛型）
 * @template T - 表格行数据类型
 */
export type DialogSelectInstance<T extends BaseRecord = BaseRecord> = {
  /** 打开弹窗 */
  open: () => void
  /** 关闭弹窗 */
  close: () => void
  /** 刷新数据 */
  refresh: () => void
  /** 加载状态 */
  loading: Readonly<Ref<boolean>>
  /** 表格数据 */
  tableData: Readonly<Ref<T[]>>
  /** 总数 */
  total: Readonly<Ref<number>>
  /** 当前页 */
  currentPage: Readonly<Ref<number>>
}
````

### 泛型使用示例

通过泛型，可以获得更精确的类型推导和代码提示：

```typescript
// 1. 定义表格行数据类型
interface EmployeeRow {
  id: number
  name: string
  department: string
  email: string
  phone: string
  status: string
}

// 2. fetchData 参数会自动推导
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams<EmployeeRow>
): Promise<FetchDialogSelectDataResult<EmployeeRow>> => {
  // ✅ params.page: number (必填)
  // ✅ params.pageSize: number (必填)
  // ✅ params.name?: string (可选)
  // ✅ params.department?: string (可选)
  // ❌ params.foo - 类型错误，不存在的字段

  const { page, pageSize, name, department } = params
  // ... 业务逻辑
  return { data: [], total: 0 }
}

// 3. 组件使用时类型完全推导
const selectedEmployees = ref<EmployeeRow[] | null>(null)

// 4. keyGetter 函数类型推导
const keyGetter = (row: EmployeeRow) => {
  // ✅ row 类型为 EmployeeRow
  return row.id
}

// 5. change 事件类型推导
const handleChange = (value: EmployeeRow[] | null, selectedRows: EmployeeRow[]) => {
  // ✅ value 和 selectedRows 类型已推导
  console.log(value, selectedRows)
}
```

## 最佳实践

### 1. 错误处理

```vue
<template>
  <IipDialogSelect
    v-model="selectedEmployee"
    :fetch-data="fetchEmployeeData"
    :dialog-select-options="employeeDialogSelectOptions"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

const handleError = (error: any) => {
  console.error('数据加载失败:', error)
  ElMessage.error('数据加载失败，请重试')
}
</script>
```

### 2. 表单集成

```vue
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="员工">
      <IipDialogSelect
        v-model="form.employee"
        :fetch-data="fetchEmployeeData"
        :dialog-select-options="employeeDialogSelectOptions"
        placeholder="请选择员工"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { IipDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions
} from '@bingwu/iip-ui-components'

// 定义员工数据类型
interface EmployeeRow {
  id: number
  name: string
  department: string
  email: string
  phone: string
  status: string
}

// 模拟员工数据
const mockEmployees: EmployeeRow[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

// DialogSelect 选项配置（合并 columns 和 formItems）
const employeeDialogSelectOptions: DialogSelectOptions = [
  // 表格列配置
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  { field: 'name', title: '姓名', columnProps: { width: 120 } },
  { field: 'department', title: '部门', columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } },
  // 表单配置（用于筛选）
  {
    field: 'name',
    title: '姓名',
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'department',
    title: '部门',
    useForm: true,
    formItemProps: {
      formType: 'select',
      placeholder: '请选择部门',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '产品部', value: '产品部' },
        { label: '运营部', value: '运营部' },
        { label: '市场部', value: '市场部' },
        { label: '人事部', value: '人事部' }
      ]
    }
  }
]

// 获取员工数据（使用泛型）
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams<EmployeeRow>
): Promise<FetchDialogSelectDataResult<EmployeeRow>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // ✅ params 类型已推导
  const { page, pageSize, name, department } = params

  // 根据筛选条件过滤
  let filteredEmployees = mockEmployees
  if (name) {
    // ✅ name 类型为 string，无需类型断言
    filteredEmployees = filteredEmployees.filter(employee => employee.name.includes(name))
  }
  if (department) {
    // ✅ department 类型为 string，无需类型断言
    filteredEmployees = filteredEmployees.filter(employee => employee.department === department)
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredEmployees.slice(start, end)

  return {
    data,
    total: filteredEmployees.length
  }
}

const form = ref({
  employee: null as EmployeeRow | null
})

const handleSubmit = async () => {
  if (!form.value.employee) {
    ElMessage.warning('请选择员工')
    return
  }

  // ✅ form.value.employee 类型为 EmployeeRow
  const submitData = {
    employeeId: form.value.employee.id,
    employeeName: form.value.employee.name
  }

  // 实际使用时替换为真实 API 调用
  console.log('提交数据：', submitData)
}
</script>
```

### 3. 编辑表单回显

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const form = ref({
  employee: null as TableRowItem | null
})

// 模拟表单数据
const mockFormData = {
  employeeId: 1,
  employeeName: '张三',
  employeeDepartment: '技术部'
  // ... 其他字段
}

// 加载表单数据
onMounted(async () => {
  // 模拟从后端获取表单数据（实际使用时替换为真实 API 调用）
  await new Promise(resolve => setTimeout(resolve, 300))
  const data = mockFormData

  // 直接设置对象形式的值，组件会自动回显
  form.value = {
    employee: {
      id: data.employeeId,
      name: data.employeeName,
      department: data.employeeDepartment
      // ... 其他字段
    }
  }
})
</script>
```

### 4. 性能优化

```vue
<template>
  <IipDialogSelect
    v-model="selectedEmployee"
    :fetch-data="fetchEmployeeData"
    :dialog-select-options="employeeDialogSelectOptions"
    :grid-config="{
      height: '500px',
      // 启用虚拟滚动（如果数据量大）
      scrollY: { enabled: true }
    }"
  />
</template>

<script setup lang="ts">
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions
} from '@bingwu/iip-ui-components'

// 定义员工数据类型
interface EmployeeRow {
  id: number
  name: string
  department: string
  email: string
  phone: string
  status: string
}

// 模拟员工数据
const mockEmployees: EmployeeRow[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `员工${i + 1}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][i % 5],
  email: `employee${i + 1}@example.com`,
  phone: `138${String(i + 1).padStart(8, '0')}`,
  status: i % 3 === 0 ? '在职' : '离职'
}))

const employeeDialogSelectOptions: DialogSelectOptions = [
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  { field: 'name', title: '姓名', columnProps: { width: 120 } },
  { field: 'department', title: '部门', columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } }
]

// 在 fetchData 中实现数据缓存（使用泛型）
const cache = new Map<string, FetchDialogSelectDataResult<EmployeeRow>>()

const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams<EmployeeRow>
): Promise<FetchDialogSelectDataResult<EmployeeRow>> => {
  const cacheKey = JSON.stringify(params)

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // ✅ params 类型已推导
  const { page, pageSize, name, department } = params

  // 根据筛选条件过滤
  let filteredEmployees = mockEmployees
  if (name) {
    // ✅ name 类型为 string，无需类型断言
    filteredEmployees = filteredEmployees.filter(employee => employee.name.includes(name))
  }
  if (department) {
    // ✅ department 类型为 string，无需类型断言
    filteredEmployees = filteredEmployees.filter(employee => employee.department === department)
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredEmployees.slice(start, end)

  const result: FetchDialogSelectDataResult<EmployeeRow> = {
    data,
    total: filteredEmployees.length
  }

  cache.set(cacheKey, result)

  return result
}
</script>
```

## 注意事项

1. **至少选择一个**: 点击确认按钮时，如果没有选择任何项，会提示"请至少选择一项"，不会关闭弹窗。

2. **数据回显**: 组件会自动回显已选中的数据，支持跨页选择。每次拉取表格数据时都会同步选中状态。

3. **分页大小**: 切换分页大小时，会自动重置到第一页并重新获取数据。

4. **表单筛选**: 表单变化时会触发 `form-change` 事件，但不会自动搜索，需要点击"搜索"按钮才会触发数据获取。

5. **keyGetter**: 如果数据需要复合 key（多个字段拼接），建议使用 `keyGetter` 函数，而不是依赖 `valueKey`。

6. **异步选项**: `select` 类型的 `options` 支持异步函数，组件会在打开弹窗时自动加载选项数据。

7. **默认值**: 表单项的 `defaultValue` 支持同步函数，可以在函数中动态计算默认值。

8. **多选全选**: 在多选模式下，取消全选时会移除当前页所有行的选中状态，确保数据一致性。

9. **fetchData 必需**: 必须提供 `fetchData` 方法，该方法接收分页和筛选参数，返回数据和总数。

10. **dialogSelectOptions 必需**: 必须提供 `dialogSelectOptions` 配置数组，用于定义表格列和表单项。

11. **useForm 字段**: 使用 `useForm: true` 标识表单项，`useForm: false` 或不设置表示表格列。同一字段可以同时作为列和表单项使用。

## 常见问题

### Q: modelValue 的格式是什么？

A:

- **单选模式**: `modelValue` 是单个对象，例如：`{ id: 1, name: '张三' }`
- **多选模式**: `modelValue` 是对象数组，例如：`[{ id: 1, name: '张三' }, { id: 2, name: '李四' }]`

### Q: 如何使用泛型获得类型推导？

A: 定义表格行类型，然后在组件使用时传入泛型参数：

```typescript
// 1. 定义类型
interface EmployeeRow {
  id: number
  name: string
  department: string
}

// 2. fetchData 使用泛型
const fetchData = async (
  params: FetchDialogSelectDataParams<EmployeeRow>
): Promise<FetchDialogSelectDataResult<EmployeeRow>> => {
  // params.name 类型为 string | undefined
  // params.department 类型为 string | undefined
  // params.foo 类型错误（不存在）
  return { data: [], total: 0 }
}

// 3. 组件使用时传入泛型（Vue 3.3+）
<IipDialogSelect<EmployeeRow>
  v-model="selectedEmployees"
  :fetch-data="fetchData"
  :dialog-select-options="options"
/>

// 或者使用 defineComponent 的方式
const dialogSelectRef = ref<DialogSelectInstance<EmployeeRow>>()
```

### Q: 如何处理跨页选择的回显？

A: 组件会自动处理。当你设置 `v-model` 为已选中的对象（或对象数组）时，即使该数据不在当前页，组件也会在每次拉取数据时自动回显选中状态。

### Q: 为什么需要使用 keyGetter？

A: 当数据的唯一标识不是单个字段，而是多个字段的组合时（例如：`${id}-${category}`），需要使用 `keyGetter` 函数来生成唯一 key。这样可以确保跨页选择时能正确识别和回显数据。

### Q: 表单筛选如何工作？

A:

1. 用户在表单中输入筛选条件
2. 点击"搜索"按钮触发数据获取
3. `fetchData` 函数会接收到表单数据作为查询参数
4. 后端根据这些参数返回筛选后的数据

### Q: 如何自定义表格样式？

A: 通过 `gridConfig` prop 可以透传 vxe-grid 的所有配置，包括样式相关的配置：

```vue
<IipDialogSelect
  :dialog-select-options="dialogSelectOptions"
  :grid-config="{
    border: false,
    stripe: true,
    height: '600px'
    // ... 其他 vxe-grid 配置
  }"
/>
```

也可以通过 `columnProps` 自定义每列的样式：

```vue
<script setup lang="ts">
import type { DialogSelectOptions } from '@bingwu/iip-ui-components'

const dialogSelectOptions: DialogSelectOptions = [
  {
    field: 'name',
    title: '姓名',
    columnProps: {
      width: 150,
      align: 'center',
      sortable: true
    }
  }
]
</script>
```

### Q: 异步选项数据什么时候加载？

A: 异步选项数据会在打开弹窗时自动加载。组件会等待所有异步选项加载完成后再显示弹窗内容。

### Q: 如何监听表单变化？

A: 可以监听 `form-change` 事件：

```vue
<IipDialogSelect @form-change="handleFormChange" />

<script setup lang="ts">
const handleFormChange = (formData: Record<string, any>) => {
  console.log('表单数据变化:', formData)
  // 可以在这里实现实时搜索等功能
}
</script>
```

### Q: 多选模式下如何获取所有选中的项？

A: 通过 `change` 事件的第二个参数可以获取所有选中的行：

```vue
<IipDialogSelect :multiple="true" @change="handleChange" />

<script setup lang="ts">
// 定义类型
interface EmployeeRow {
  id: number
  name: string
  department: string
}

// ✅ 使用泛型，类型已推导
const handleChange = (value: EmployeeRow[] | null, selectedRows: EmployeeRow[]) => {
  console.log('选中的值:', value) // EmployeeRow[] | null
  console.log('所有选中的行:', selectedRows) // EmployeeRow[]
  // ✅ value 和 selectedRows 中的每个元素类型都是 EmployeeRow
}
</script>
```

### Q: 如何手动打开/关闭弹窗？

A: 通过 ref 调用组件方法：

```vue
<template>
  <IipDialogSelect ref="dialogRef" :dialog-select-options="dialogSelectOptions" />
  <el-button @click="dialogRef?.open()">打开</el-button>
  <el-button @click="dialogRef?.close()">关闭</el-button>
</template>
```

### Q: 如何刷新表格数据？

A: 通过 ref 调用 `refresh` 方法：

```vue
<template>
  <IipDialogSelect ref="dialogRef" :dialog-select-options="dialogSelectOptions" />
  <el-button @click="dialogRef?.refresh()">刷新</el-button>
</template>
```

### Q: 如何使用 dialogSelectOptions 配置列和表单项？

A: `dialogSelectOptions` 是一个数组，每个项包含 `field`、`title` 等公共字段，以及 `columnProps` 或 `formItemProps`：

```vue
<script setup lang="ts">
import type { DialogSelectOptions } from '@bingwu/iip-ui-components'

const dialogSelectOptions: DialogSelectOptions = [
  // 表格列配置（useForm 默认为 false）
  {
    field: 'id',
    title: 'ID',
    columnProps: { width: 80 }
  },
  // 表单项配置（useForm 设置为 true）
  {
    field: 'name',
    title: '姓名',
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入姓名'
    }
  },
  // 同一字段可以同时作为列和表单项
  {
    field: 'department',
    title: '部门',
    columnProps: { width: 120 }, // 作为列
    useForm: true,
    formItemProps: {
      formType: 'select',
      options: [...]
    }
  }
]
</script>
```

### Q: useForm 字段的作用是什么？

A: `useForm` 字段用于标识一个选项是否是表单项：

- `useForm: true` → 作为表单项使用，会显示在筛选表单中
- `useForm: false` 或未设置 → 作为表格列使用，会显示在表格中
- 同一字段可以同时设置 `columnProps` 和 `formItemProps`，通过 `useForm` 控制是否显示在表单中
