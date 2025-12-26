# openDialogSelect 函数式调用

`openDialogSelect` 是一个命令式函数，用于以编程方式打开弹窗选择器，无需在模板中声明组件。适用于表格单元格点击、按钮点击等场景。

## 特性

- 🎯 **命令式调用**: 无需在模板中声明组件，通过函数调用即可打开弹窗
- 📋 **Promise 返回**: 返回 Promise，支持 async/await 语法
- ✅ **单选/多选**: 支持单选和多选两种模式
- 🔄 **初始值支持**: 支持传入初始值，弹窗打开时自动选中
- 🎨 **完整配置**: 支持 DialogSelect 组件的所有配置选项
- 🛠️ **TypeScript**: 完整的 TypeScript 类型支持
- ⚡ **自动清理**: 弹窗关闭后自动清理 DOM，无需手动管理

## 基础用法

### 单选示例

<script setup>
import Basic from '../examples/dialog-select-function/basic.vue'
</script>

<Basic />

::: details 查看代码
<<< @/examples/dialog-select-function/basic.vue
:::

### 多选示例

```vue
<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column prop="productsDisplay" label="已选产品">
        <template #default="{ row }">
          <span class="cell-link" @click="handleProductsClick(row)">
            {{ row.productsDisplay || '点击选择' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { openDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions,
  TableRowItem
} from '@bingwu/iip-ui-components'
import { ElMessage } from 'element-plus'

const tableData = ref([
  { id: 1, projectName: '电商平台开发', products: [], productsDisplay: '' },
  { id: 2, projectName: '移动应用设计', products: [], productsDisplay: '' }
])

// 模拟产品数据
const mockProducts = Array.from({ length: 50 }, (_, i) => ({
  id: `PROD-${String(i + 1).padStart(3, '0')}`,
  name: `产品${i + 1}`,
  price: (Math.random() * 1000).toFixed(2),
  category: ['电子产品', '服装', '食品', '家居'][i % 4]
}))

// DialogSelect 选项配置
const productDialogSelectOptions: DialogSelectOptions = [
  { field: 'id', title: '产品ID', columnProps: { width: 120 } },
  { field: 'name', title: '产品名称', columnProps: { width: 150 } },
  { field: 'price', title: '价格', columnProps: { width: 100 } },
  { field: 'category', title: '分类', columnProps: { width: 120 } },
  {
    field: 'name',
    title: '产品名称',
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入产品名称'
    }
  },
  {
    field: 'category',
    title: '分类',
    useForm: true,
    formItemProps: {
      formType: 'select',
      placeholder: '请选择分类',
      options: [
        { label: '电子产品', value: '电子产品' },
        { label: '服装', value: '服装' },
        { label: '食品', value: '食品' },
        { label: '家居', value: '家居' }
      ]
    }
  }
]

// 获取产品数据
const fetchProductData = async (
  params: FetchDialogSelectDataParams
): Promise<FetchDialogSelectDataResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, name, category } = params

  // 根据筛选条件过滤
  let filteredProducts = mockProducts
  if (name) {
    filteredProducts = filteredProducts.filter(product => product.name.includes(name as string))
  }
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category)
  }

  // 分页处理
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredProducts.slice(start, end)

  return {
    data,
    total: filteredProducts.length
  }
}

// 点击单元格选择产品（多选）
const handleProductsClick = async (row: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchProductData,
      dialogSelectOptions: productDialogSelectOptions,
      multiple: true, // 启用多选
      valueKey: 'id',
      labelKey: 'name',
      dialogTitle: '选择产品',
      initialValue: row.products // 传入当前选中的值数组
    })

    // result 是选中的对象数组（多选模式）
    if (result && Array.isArray(result)) {
      row.products = result
      row.productsDisplay = result.map((item: any) => item.name).join(', ')
      ElMessage.success(`已选择 ${result.length} 个产品`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}
</script>
```

### 带初始值的示例

```vue
<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="ticketNo" label="工单号" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="assignee" label="指派人" width="150">
        <template #default="{ row }">
          <span class="cell-link" @click="handleAssigneeClick(row)">
            {{ row.assignee || '点击选择' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { openDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions,
  TableRowItem
} from '@bingwu/iip-ui-components'
import { ElMessage } from 'element-plus'

const tableData = ref([
  {
    id: 1,
    ticketNo: 'TK-001',
    title: '系统登录异常',
    assignee: '员工3',
    assigneeData: {
      id: 3,
      name: '员工3',
      department: '运营部'
    }
  },
  {
    id: 2,
    ticketNo: 'TK-002',
    title: '页面加载缓慢',
    assignee: '',
    assigneeData: null
  }
])

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
  { field: 'status', title: '状态', columnProps: { width: 100 } },
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

// 获取员工数据
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

// 点击单元格选择指派人（带初始值）
const handleAssigneeClick = async (row: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchEmployeeData,
      dialogSelectOptions: employeeDialogSelectOptions,
      dialogTitle: '选择指派人',
      // 传入初始值，会在弹窗打开时自动选中
      initialValue: row.assigneeData
    })

    if (result && typeof result === 'object' && !Array.isArray(result)) {
      row.assignee = result.name as string
      row.assigneeData = result
      ElMessage.success(`已指派给：${result.name}`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}
</script>
```

## 完整示例

以下是一个完整的示例，展示了单选、多选和带初始值的用法：

```vue
<template>
  <div class="app-container">
    <h2>openDialogSelect 函数式调用示例</h2>

    <!-- 示例1：单选员工 -->
    <div class="demo-section">
      <h3>点击表格单元格选择员工（单选）</h3>
      <p style="margin-bottom: 15px; color: #666">点击"负责人"列的单元格可以选择员工</p>
      <el-table :data="taskTableData" border stripe style="width: 100%" max-height="300">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="taskName" label="任务名称" min-width="200" />
        <el-table-column prop="owner" label="负责人" width="150">
          <template #default="{ row }">
            <span class="cell-link" @click="handleOwnerClick(row)">
              {{ row.owner || '点击选择' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" />
      </el-table>
    </div>

    <!-- 示例2：多选产品 -->
    <div class="demo-section">
      <h3>点击表格单元格选择产品（多选）</h3>
      <p style="margin-bottom: 15px; color: #666">点击"已选产品"列的单元格可以选择多个产品</p>
      <el-table :data="projectTableData" border stripe style="width: 100%" max-height="250">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="projectName" label="项目名称" min-width="200" />
        <el-table-column prop="productsDisplay" label="已选产品" min-width="300">
          <template #default="{ row }">
            <span class="cell-link" @click="handleProductsClick(row)">
              {{ row.productsDisplay || '点击选择' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 示例3：带初始值的选择 -->
    <div class="demo-section">
      <h3>带初始值的选择</h3>
      <p style="margin-bottom: 15px; color: #666">点击单元格时会带上当前选中的值作为初始值</p>
      <el-table :data="ticketTableData" border stripe style="width: 100%" max-height="250">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="ticketNo" label="工单号" width="120" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="assignee" label="指派人" width="150">
          <template #default="{ row }">
            <span class="cell-link" @click="handleAssigneeClick(row)">
              {{ row.assignee || '点击选择' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { openDialogSelect } from '@bingwu/iip-ui-components'
import type {
  FetchDialogSelectDataParams,
  FetchDialogSelectDataResult,
  DialogSelectOptions,
  TableRowItem
} from '@bingwu/iip-ui-components'
import { ElMessage } from 'element-plus'

// 示例1：任务表格数据（单选员工作为负责人）
const taskTableData = ref([
  { id: 1, taskName: '开发用户登录功能', owner: '', ownerData: null, status: '进行中' },
  { id: 2, taskName: '设计产品首页', owner: '', ownerData: null, status: '未开始' },
  { id: 3, taskName: '编写API文档', owner: '', ownerData: null, status: '进行中' }
])

// 示例2：项目表格数据（多选产品）
const projectTableData = ref([
  { id: 1, projectName: '电商平台开发', products: [], productsDisplay: '' },
  { id: 2, projectName: '移动应用设计', products: [], productsDisplay: '' },
  { id: 3, projectName: '数据分析系统', products: [], productsDisplay: '' }
])

// 示例3：工单表格数据（带初始值的单选）
const ticketTableData = ref([
  {
    id: 1,
    ticketNo: 'TK-001',
    title: '系统登录异常',
    assignee: '员工3',
    assigneeData: {
      id: 3,
      name: '员工3',
      department: '运营部',
      email: 'employee3@example.com',
      phone: '13800000003',
      status: '离职'
    },
    priority: '高'
  },
  {
    id: 2,
    ticketNo: 'TK-002',
    title: '页面加载缓慢',
    assignee: '',
    assigneeData: null,
    priority: '中'
  }
])

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
  { field: 'id', title: 'ID', columnProps: { width: 80 } },
  { field: 'name', title: '姓名', columnProps: { width: 120 } },
  { field: 'department', title: '部门', columnProps: { width: 120 } },
  { field: 'email', title: '邮箱', columnProps: { width: 200 } },
  { field: 'phone', title: '电话', columnProps: { width: 150 } },
  { field: 'status', title: '状态', columnProps: { width: 100 } },
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
      options: async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
        return [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '运营部', value: '运营部' },
          { label: '市场部', value: '市场部' },
          { label: '人事部', value: '人事部' }
        ]
      }
    }
  }
]

// 获取员工数据
const fetchEmployeeData = async (
  params: FetchDialogSelectDataParams
): Promise<FetchDialogSelectDataResult> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, name, department } = params

  let filteredEmployees = mockEmployees
  if (name) {
    filteredEmployees = filteredEmployees.filter(employee => employee.name.includes(name as string))
  }
  if (department) {
    filteredEmployees = filteredEmployees.filter(employee => employee.department === department)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredEmployees.slice(start, end)

  return {
    data,
    total: filteredEmployees.length
  }
}

// 员工 keyGetter：使用 id 作为 key
const employeeKeyGetter = (row: TableRowItem) => {
  return row.id
}

// 示例1：点击选择负责人（单选）
const handleOwnerClick = async (row: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchEmployeeData,
      dialogSelectOptions: employeeDialogSelectOptions,
      keyGetter: employeeKeyGetter,
      dialogTitle: '选择负责人',
      initialValue: row.ownerData
    })

    if (result && typeof result === 'object' && !Array.isArray(result)) {
      row.owner = result.name as string
      row.ownerData = result
      ElMessage.success(`已选择负责人：${result.name}`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}

// 模拟产品数据
const mockProducts = Array.from({ length: 50 }, (_, i) => ({
  id: `PROD-${String(i + 1).padStart(3, '0')}`,
  name: `产品${i + 1}`,
  price: (Math.random() * 1000).toFixed(2),
  category: ['电子产品', '服装', '食品', '家居'][i % 4]
}))

// DialogSelect 选项配置（产品）
const productDialogSelectOptions: DialogSelectOptions = [
  { field: 'id', title: '产品ID', columnProps: { width: 120 } },
  { field: 'name', title: '产品名称', columnProps: { width: 150 } },
  { field: 'price', title: '价格', columnProps: { width: 100 } },
  { field: 'category', title: '分类', columnProps: { width: 120 } },
  {
    field: 'name',
    title: '产品名称',
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入产品名称',
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
      defaultValue: '电子产品',
      options: [
        { label: '电子产品', value: '电子产品' },
        { label: '服装', value: '服装' },
        { label: '食品', value: '食品' },
        { label: '家居', value: '家居' }
      ]
    }
  }
]

// 获取产品数据
const fetchProductDataForDialog = async (
  params: FetchDialogSelectDataParams
): Promise<FetchDialogSelectDataResult> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page, pageSize, name, category } = params

  let filteredProducts = mockProducts
  if (name) {
    filteredProducts = filteredProducts.filter(product => product.name.includes(name as string))
  }
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredProducts.slice(start, end)

  return {
    data,
    total: filteredProducts.length
  }
}

// 产品 keyGetter：使用 id 和 category 拼接作为 key
const productKeyGetter = (row: TableRowItem) => {
  return `${row.id}-${row.category}`
}

// 示例2：点击选择产品（多选）
const handleProductsClick = async (row: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchProductDataForDialog,
      dialogSelectOptions: productDialogSelectOptions,
      keyGetter: productKeyGetter,
      multiple: true,
      valueKey: 'id',
      labelKey: 'name',
      dialogTitle: '选择产品',
      initialValue: row.products
    })

    if (result && Array.isArray(result)) {
      row.products = result
      row.productsDisplay = result.map((item: any) => item.name).join(', ')
      ElMessage.success(`已选择 ${result.length} 个产品`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}

// 示例3：点击选择指派人（带初始值）
const handleAssigneeClick = async (row: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchEmployeeData,
      dialogSelectOptions: employeeDialogSelectOptions,
      keyGetter: employeeKeyGetter,
      dialogTitle: '选择指派人',
      initialValue: row.assigneeData
    })

    if (result && typeof result === 'object' && !Array.isArray(result)) {
      row.assignee = result.name as string
      row.assigneeData = result
      ElMessage.success(`已指派给：${result.name}`)
    }
  } catch (error: any) {
    console.log('取消选择:', error.message)
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.cell-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.cell-link:hover {
  color: #66b1ff;
}
</style>
```

## API

### openDialogSelect

函数签名：

```typescript
function openDialogSelect<T extends BaseRecord = BaseRecord>(
  options: OpenDialogSelectOptions<T>
): Promise<T | T[] | null>
```

**泛型参数说明：**

- `T`: 表格行数据类型，默认为 `BaseRecord`（即 `Record<string, any>`）
- 传入具体类型后，返回值、参数类型都会自动推导

**使用示例：**

```typescript
// 不传泛型（使用默认类型）
const result1 = await openDialogSelect({ ... })
// result1 类型为 Record<string, any> | Record<string, any>[] | null

// 传入具体类型（推荐）
interface UserRow {
  id: number
  name: string
}
const result2 = await openDialogSelect<UserRow>({ ... })
// result2 类型为 UserRow | UserRow[] | null
```

### OpenDialogSelectOptions

| 参数                | 说明                                                   | 类型                                                                            | 默认值     | 必需 |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- | ---------- | ---- |
| fetchData           | 获取数据的方法                                         | `(params: FetchDialogSelectDataParams) => Promise<FetchDialogSelectDataResult>` | -          | ✅   |
| dialogSelectOptions | DialogSelect 选项配置数组（合并 columns 和 formItems） | `DialogSelectOptions`                                                           | -          | ✅   |
| multiple            | 是否多选                                               | `boolean`                                                                       | `false`    | ❌   |
| valueKey            | 选项值的键名                                           | `string`                                                                        | `'id'`     | ❌   |
| labelKey            | 选项标签的键名（用于显示在输入框中）                   | `string`                                                                        | `'name'`   | ❌   |
| keyGetter           | 获取行的唯一标识key的函数，如果不提供则使用valueKey    | `(row: TableRowItem) => string \| number`                                       | -          | ❌   |
| dialogTitle         | 弹窗标题                                               | `string`                                                                        | `'请选择'` | ❌   |
| dialogWidth         | 弹窗宽度                                               | `string \| number`                                                              | `'1100px'` | ❌   |
| gridConfig          | vxe-grid 配置，支持透传 vxe-grid 的所有 props          | `VxeGridProps`                                                                  | -          | ❌   |
| initialValue        | 初始值，单选时为对象，多选时为对象数组                 | `TableRowItem \| TableRowItem[] \| null`                                        | `null`     | ❌   |
| animationDuration   | 弹窗关闭动画时长（ms）                                 | `number`                                                                        | `300`      | ❌   |

### 返回值

函数返回一个 Promise，类型根据泛型参数推导：

- **单选模式** (`multiple: false`): `Promise<T | null>`
- **多选模式** (`multiple: true`): `Promise<T[] | null>`

其中 `T` 是传入的泛型参数，默认为 `BaseRecord`。

**示例：**

```typescript
interface EmployeeRow {
  id: number
  name: string
}

// 单选模式
const result1 = await openDialogSelect<EmployeeRow>({ ... })
// result1 类型为 EmployeeRow | null

// 多选模式
const result2 = await openDialogSelect<EmployeeRow>({ multiple: true, ... })
// result2 类型为 EmployeeRow[] | null
```

### 错误处理

当用户取消选择（点击取消按钮或遮罩层）时，Promise 会被 reject，错误信息为 `'用户取消选择'`。

```typescript
try {
  const result = await openDialogSelect({ ... })
  // 处理选择结果
} catch (error: any) {
  if (error.message === '用户取消选择') {
    console.log('用户取消了选择')
  } else {
    console.error('发生错误:', error)
  }
}
```

## 类型定义

```typescript
import type { VxeGridProps, VxeColumnProps } from 'vxe-table'

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
 * interface UserRow {
 *   id: number
 *   name: string
 *   department: string
 * }
 * // params 类型为 { page: number, pageSize: number, id?: number, name?: string, department?: string }
 * const fetchData = (params: FetchDialogSelectDataParams<UserRow>) => { ... }
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

// DialogSelect 选项配置
export type DialogSelectOptions = DialogSelectOption[]

export type DialogSelectOption = {
  /** 字段名（公共字段） */
  field: string
  /** 标题（公共字段） */
  title: string
  /** 是否是表单项，默认为 false */
  useForm?: boolean
  /** 列配置属性（当作为表格列时使用） */
  columnProps?: Omit<VxeColumnProps, 'field' | 'title'>
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

/**
 * 函数式调用 DialogSelect 的选项（支持泛型）
 * @template T - 表格行数据类型
 */
export type OpenDialogSelectOptions<T extends BaseRecord = BaseRecord> = {
  fetchData: (params: FetchDialogSelectDataParams<T>) => Promise<FetchDialogSelectDataResult<T>>
  dialogSelectOptions: DialogSelectOptions
  multiple?: boolean
  valueKey?: string
  labelKey?: string
  keyGetter?: (row: T) => string | number
  dialogTitle?: string
  dialogWidth?: string | number
  gridConfig?: VxeGridProps
  initialValue?: T | T[] | null
  /** 弹窗关闭动画时长（ms），默认 300 */
  animationDuration?: number
}
```

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

// 3. 调用时类型完全推导
const result = await openDialogSelect<EmployeeRow>({
  fetchData: fetchEmployeeData,
  dialogSelectOptions: [...],
  keyGetter: (row) => row.id  // row 类型为 EmployeeRow
})
// result 类型为 EmployeeRow | EmployeeRow[] | null
```

## 使用场景

### 1. 表格单元格点击选择

最常见的场景是在表格中点击单元格打开选择弹窗：

```vue
<el-table-column prop="owner" label="负责人">
  <template #default="{ row }">
    <span @click="handleSelectOwner(row)">{{ row.owner || '点击选择' }}</span>
  </template>
</el-table-column>
```

### 2. 按钮点击选择

通过按钮触发选择：

```vue
<template>
  <el-button @click="handleSelect">选择员工</el-button>
</template>

<script setup>
const handleSelect = async () => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchEmployeeData,
      dialogSelectOptions: employeeDialogSelectOptions,
      dialogTitle: '选择员工'
    })
    console.log('选中的员工:', result)
  } catch (error) {
    console.log('取消选择')
  }
}
</script>
```

### 3. 表单编辑场景

在编辑表单时，可以传入初始值：

```vue
<script setup>
const handleEdit = async (formData: any) => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchEmployeeData,
      dialogSelectOptions: employeeDialogSelectOptions,
      dialogTitle: '选择负责人',
      // 传入当前表单中的值作为初始值
      initialValue: formData.owner
    })

    // 更新表单数据
    formData.owner = result
  } catch (error) {
    // 用户取消，不做处理
  }
}
</script>
```

## 最佳实践

### 1. 错误处理

始终使用 try-catch 处理 Promise：

```typescript
const handleSelect = async () => {
  try {
    const result = await openDialogSelect({ ... })
    // 处理选择结果
  } catch (error: any) {
    if (error.message === '用户取消选择') {
      // 用户取消，不需要特殊处理
      return
    }
    // 其他错误
    ElMessage.error('选择失败，请重试')
  }
}
```

### 2. 初始值处理

在编辑场景中，始终传入初始值以确保数据回显：

```typescript
const handleEdit = async (row: any) => {
  const result = await openDialogSelect({
    fetchData: fetchData,
    dialogSelectOptions: options,
    initialValue: row.selectedData // 传入当前选中的数据
  })
}
```

### 3. 多选数据处理

多选模式下，结果是一个数组，需要正确处理：

```typescript
const handleMultiSelect = async () => {
  try {
    const result = await openDialogSelect({
      fetchData: fetchData,
      dialogSelectOptions: options,
      multiple: true
    })

    if (result && Array.isArray(result)) {
      // 处理数组结果
      const ids = result.map(item => item.id)
      const names = result.map(item => item.name).join(', ')
      console.log('选中的ID:', ids)
      console.log('选中的名称:', names)
    }
  } catch (error) {
    // 处理错误
  }
}
```

### 4. keyGetter 使用

当数据需要复合 key 时，使用 keyGetter：

```typescript
const productKeyGetter = (row: TableRowItem) => {
  return `${row.id}-${row.category}`
}

const result = await openDialogSelect({
  fetchData: fetchProductData,
  dialogSelectOptions: productOptions,
  keyGetter: productKeyGetter
})
```

## 注意事项

1. **Promise 处理**: 函数返回 Promise，必须使用 async/await 或 .then() 处理
2. **错误处理**: 用户取消选择时会 reject Promise，需要 catch 处理
3. **初始值格式**:
   - 单选模式：`initialValue` 应该是单个对象或 `null`
   - 多选模式：`initialValue` 应该是对象数组或 `null`
4. **返回值格式**:
   - 单选模式：返回单个对象或 `null`
   - 多选模式：返回对象数组或 `null`
5. **自动清理**: 弹窗关闭后会自动清理 DOM，无需手动管理
6. **组件实例**: 函数内部会创建临时的 DialogSelect 组件实例，无需在模板中声明
7. **动画时长**: 可以通过 `animationDuration` 自定义关闭动画时长，默认 300ms
8. **fetchData 必需**: 必须提供 `fetchData` 方法
9. **dialogSelectOptions 必需**: 必须提供 `dialogSelectOptions` 配置数组

## 常见问题

### Q: 如何判断用户是确认还是取消？

A: 使用 try-catch 处理：

```typescript
try {
  const result = await openDialogSelect({ ... })
  // 用户确认，result 是选中的值
} catch (error: any) {
  if (error.message === '用户取消选择') {
    // 用户取消
  }
}
```

### Q: 单选和多选的返回值有什么区别？

A:

- **单选** (`multiple: false`): 返回 `T | null`（`T` 为泛型参数）
- **多选** (`multiple: true`): 返回 `T[] | null`

如果不传泛型参数，`T` 默认为 `BaseRecord`（即 `Record<string, any>`）。

### Q: 如何使用泛型获得类型推导？

A: 定义表格行类型，然后在调用时传入泛型参数：

```typescript
// 1. 定义类型
interface UserRow {
  id: number
  name: string
  department: string
}

// 2. fetchData 使用泛型
const fetchData = async (
  params: FetchDialogSelectDataParams<UserRow>
): Promise<FetchDialogSelectDataResult<UserRow>> => {
  // params.name 类型为 string | undefined
  // params.department 类型为 string | undefined
  // params.foo 类型错误（不存在）
  return { data: [], total: 0 }
}

// 3. 调用时传入泛型
const result = await openDialogSelect<UserRow>({
  fetchData,
  dialogSelectOptions: [...]
})
// result 类型为 UserRow | UserRow[] | null
```

### Q: initialValue 的作用是什么？

A: `initialValue` 用于设置弹窗打开时的初始选中值。在编辑场景中，传入当前选中的数据，弹窗打开时会自动选中这些数据。

### Q: 如何自定义弹窗宽度？

A: 通过 `dialogWidth` 参数设置：

```typescript
await openDialogSelect({
  fetchData: fetchData,
  dialogSelectOptions: options,
  dialogWidth: '1400px' // 或数字 1400
})
```

### Q: 如何透传 vxe-grid 的配置？

A: 通过 `gridConfig` 参数：

```typescript
await openDialogSelect({
  fetchData: fetchData,
  dialogSelectOptions: options,
  gridConfig: {
    border: false,
    height: '600px',
    stripe: true
  }
})
```

### Q: 函数式调用和组件式调用有什么区别？

A:

- **函数式调用** (`openDialogSelect`): 适用于动态场景，如表格单元格点击、按钮点击等，无需在模板中声明组件
- **组件式调用** (`IipDialogSelect`): 适用于表单场景，需要在模板中声明组件，支持 v-model 双向绑定

### Q: 可以在同一个页面多次调用 openDialogSelect 吗？

A: 可以。每次调用都会创建独立的弹窗实例，互不影响。

### Q: 弹窗关闭后数据会被清理吗？

A: 是的。弹窗关闭后会自动清理 DOM 和组件实例，无需手动管理。

### Q: 如何自定义 keyGetter？

A: 传入 keyGetter 函数：

```typescript
const keyGetter = (row: TableRowItem) => {
  // 返回唯一标识，可以是单个字段或复合字段
  return `${row.id}-${row.category}`
}

await openDialogSelect({
  fetchData: fetchData,
  dialogSelectOptions: options,
  keyGetter: keyGetter
})
```

### Q: 支持表单筛选吗？

A: 支持。通过 `dialogSelectOptions` 配置表单项，使用 `useForm: true` 标识：

```typescript
const options: DialogSelectOptions = [
  {
    field: 'name',
    title: '姓名',
    useForm: true,
    formItemProps: {
      formType: 'input',
      placeholder: '请输入姓名'
    }
  }
]
```
