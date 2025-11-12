# Table 表格

基于 vxe-table 二次封装的表格组件，提供了丰富的功能和简洁的 API。

## 特性

- 🚀 **高性能**：智能插槽渲染，只渲染实际使用的插槽，避免不必要的性能开销
- 🎨 **灵活定制**：支持多种插槽类型（内容、表头、编辑、筛选、页脚、校验）
- 📦 **开箱即用**：基于 vxe-table 4.15+ 封装，提供简洁统一的 API
- 🔧 **类型安全**：完整的 TypeScript 类型定义
- 🎯 **插槽优化**：精确的插槽检测机制，提升组件渲染效率
- 🛠️ **功能丰富**：支持分页、排序、筛选、编辑、展开、复选框、单选框等功能

## 安装

### 安装组件库

```bash
# 使用 npm
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme

# 使用 pnpm
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-theme

# 使用 yarn
yarn add @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

### 安装依赖

Table 组件基于 vxe-table 和 vxe-pc-ui，需要安装以下依赖：

```bash
# 必须依赖
npm install vxe-table@^4.15.6 vxe-pc-ui@4.8.15 xe-utils@^3.7.8

# 如果使用 Element Plus（推荐）
npm install element-plus@^2.4.4 @element-plus/icons-vue@^2.1.0
```

## 全局引入

在 `main.ts` 中引入并注册组件：

```ts
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Element Plus（可选，但推荐）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 必须：vxe-table 相关
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// IIP UI 组件库
import IipUI from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-components/dist/style.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册插件（顺序很重要）
app.use(createPinia())
app.use(router)
app.use(VxeUITable) // 必须在 IipUI 之前注册
app.use(VxePCUI) // 必须在 IipUI 之前注册
app.use(ElementPlus) // 可选
app.use(IipUI) // 最后注册 IIP UI

app.mount('#app')
```

## 按需引入

如果只想使用 Table 组件：

```ts
import { IipTable } from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-components/dist/style.css'

// 仍需要注册 vxe-table 相关插件
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxePCUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

const app = createApp(App)
app.use(VxeUITable)
app.use(VxePCUI)

// 注册单个组件
app.component('IipTable', IipTable)
```

## 基础用法

最简单的表格用法。

```vue
<template>
  <iip-table :data="tableData" :columns="columns" border stripe />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IipTableExpose } from '@bingwu/iip-ui-components'

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', department: '研发部' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', department: '产品部' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', department: '设计部' }
])

// 列配置 - 需要使用 tableColumnProps 包装
const columns = [
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80, sortable: true } },
  { tableColumnProps: { field: 'department', title: '部门', width: 120 } },
  { tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 } }
]
</script>
```

### 获取表格实例

通过 `ref` 可以获取表格实例，调用表格的方法：

```vue
<template>
  <div>
    <el-button @click="getSelectedRows">获取选中行</el-button>
    <iip-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :check-box-column-config="{ show: true }"
      border
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IipTableExpose } from '@bingwu/iip-ui-components'

const tableRef = ref<IipTableExpose | null>(null)

const getSelectedRows = () => {
  const instance = tableRef.value?.getTableInstance()
  const selectedRows = instance?.getCheckboxRecords()
  console.log('选中的行:', selectedRows)
}
</script>
```

## 特殊列配置

### 复选框和序号列

表格支持复选框选择和序号显示。

```vue
<template>
  <iip-table
    :data="tableData"
    :columns="columns"
    :check-box-column-config="{ show: true }"
    :seq-column-config="{ show: true }"
    border
    @checkbox-change="handleCheckboxChange"
    @checkbox-all="handleCheckboxAll"
  />
</template>

<script setup>
const columns = [
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80 } },
  { tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 } }
]

const handleCheckboxChange = params => {
  console.log('复选框变化:', params)
}

const handleCheckboxAll = params => {
  console.log('全选变化:', params)
}
</script>
```

### 单选框列

支持单选框选择模式。

```vue
<template>
  <iip-table
    :data="tableData"
    :columns="columns"
    :radio-column-config="{ show: true }"
    border
    @radio-change="handleRadioChange"
  />
</template>

<script setup>
const handleRadioChange = params => {
  console.log('单选框变化:', params)
}
</script>
```

### 展开列

支持行展开功能。

```vue
<template>
  <iip-table :data="tableData" :columns="columns" :expand-column-config="{ show: true }" border>
    <!-- 展开内容自定义 -->
    <template #expand-slot-column-content="{ row }">
      <div class="expand-content">
        <p><strong>详细信息:</strong></p>
        <p>ID: {{ row.id }}</p>
        <p>创建时间: {{ row.createTime }}</p>
        <p>备注: {{ row.remark || '无' }}</p>
      </div>
    </template>
  </iip-table>
</template>

<style>
.expand-content {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
}
</style>
```

### 自定义特殊列

所有特殊列都支持自定义渲染。

```vue
<template>
  <iip-table
    :data="tableData"
    :columns="columns"
    :check-box-column-config="{ show: true }"
    :seq-column-config="{ show: true }"
    border
  >
    <!-- 自定义序号列 -->
    <template #seq-slot-column-default="{ rowIndex }">
      <span class="custom-seq">No.{{ rowIndex + 1 }}</span>
    </template>

    <!-- 自定义复选框列 -->
    <template #checkbox-slot-column-default="{ row }">
      <span class="custom-checkbox"> <i class="el-icon-check"></i> {{ row.name }} </span>
    </template>
  </iip-table>
</template>

<style>
.custom-seq {
  color: #409eff;
  font-weight: bold;
}

.custom-checkbox {
  color: #67c23a;
}
</style>
```

## 分页表格

支持分页功能的表格，使用 vxe-pc-ui 的分页器。

```vue
<template>
  <div>
    <iip-table
      :data="paginatedData"
      :columns="columns"
      :pagination="paginationConfig"
      border
      stripe
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 模拟数据
const allTableData = ref(
  Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    age: 20 + (index % 40),
    email: `user${index + 1}@example.com`,
    department: ['研发部', '产品部', '设计部', '运营部'][index % 4],
    createTime: new Date(2023, 0, 1 + index).toISOString().split('T')[0]
  }))
)

const columns = [
  { tableColumnProps: { field: 'id', title: 'ID', width: 80 } },
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80, sortable: true } },
  { tableColumnProps: { field: 'department', title: '部门', width: 120 } },
  { tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 } },
  { tableColumnProps: { field: 'createTime', title: '创建时间', width: 120 } }
]

// 分页配置
const paginationConfig = ref({
  currentPage: 1,
  pageSize: 10,
  total: allTableData.value.length,
  layouts: ['Total', 'Sizes', 'PrevPage', 'Number', 'NextPage', 'Jump'],
  pageSizes: [10, 20, 50, 100],
  onPageChange: handlePageChange,
  onPageSizeChange: handlePageSizeChange
})

// 计算当前页数据
const paginatedData = computed(() => {
  const start = (paginationConfig.value.currentPage - 1) * paginationConfig.value.pageSize
  const end = start + paginationConfig.value.pageSize
  return allTableData.value.slice(start, end)
})

// 页码变化处理
function handlePageChange(params: { currentPage: number }) {
  paginationConfig.value.currentPage = params.currentPage
  console.log('页码变化:', params)
}

// 每页条数变化处理
function handlePageSizeChange(params: { pageSize: number }) {
  paginationConfig.value.pageSize = params.pageSize
  paginationConfig.value.currentPage = 1 // 重置到第一页
  console.log('每页条数变化:', params)
}
</script>
```

### 高级分页配置

分页器支持多种布局和配置选项：

```vue
<script setup lang="ts">
// 自定义分页器布局
const customPaginationConfig = ref({
  currentPage: 1,
  pageSize: 10,
  total: 200,
  // 可配置的布局元素
  layouts: [
    'Total', // 显示总数
    'Sizes', // 每页条数选择器
    'PrevPage', // 上一页按钮
    'Number', // 页码数字
    'NextPage', // 下一页按钮
    'Jump' // 跳转输入框
  ],
  pageSizes: [5, 10, 20, 50, 100],
  // 事件处理
  onPageChange: params => console.log('页面变化:', params),
  onPageSizeChange: params => console.log('每页条数变化:', params),
  // 其他配置
  showTotal: true, // 是否显示总数
  showSizes: true, // 是否显示每页条数选择器
  showJumper: true, // 是否显示跳转输入框
  showPrevNext: true, // 是否显示上下页按钮
  showNumber: true // 是否显示页码数字
})
</script>
```

## 自定义列

支持自定义列内容渲染，包括列内容和列头的自定义。

### 基础自定义列内容

```vue
<template>
  <iip-table :data="tableData" :columns="customColumns" border>
    <!-- 状态列自定义渲染 -->
    <template #status-slot-column-default="{ row }">
      <el-tag :type="getStatusType(row.status)">
        {{ getStatusText(row.status) }}
      </el-tag>
    </template>
    <!-- 操作列自定义渲染 -->
    <template #actions-slot-column-default="{ row }">
      <el-button size="small" type="primary" @click="editRow(row)">编辑</el-button>
      <el-button size="small" type="danger" @click="deleteRow(row)">删除</el-button>
    </template>
  </iip-table>
</template>

<script setup>
const customColumns = [
  {
    tableColumnProps: { field: 'name', title: '姓名', width: 120 }
  },
  {
    tableColumnProps: { field: 'age', title: '年龄', width: 80, sortable: true }
  },
  {
    tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 }
  },
  {
    tableColumnProps: { field: 'status', title: '状态', width: 100 }
  },
  {
    tableColumnProps: { field: 'actions', title: '操作', width: 160 }
  }
]

const getStatusType = status => {
  const types = ['info', 'success', 'warning']
  return types[status] || 'info'
}

const getStatusText = status => {
  const texts = ['禁用', '正常', '待审核']
  return texts[status] || '未知'
}

const editRow = row => {
  console.log('编辑行:', row)
}

const deleteRow = row => {
  console.log('删除行:', row)
}
</script>
```

### 自定义列头

支持自定义列头内容渲染。

```vue
<template>
  <iip-table :data="tableData" :columns="headerColumns" border>
    <!-- 自定义列头 -->
    <template #name-slot-column-header="{ column }">
      <i class="el-icon-user"></i>
      {{ column.title }}
    </template>
    <!-- 自定义列内容 -->
    <template #name-slot-column-default="{ row }">
      <strong>{{ row.name }}</strong>
    </template>
  </iip-table>
</template>

<script setup>
const headerColumns = [
  {
    tableColumnProps: { field: 'name', title: '姓名', width: 120 }
  },
  {
    tableColumnProps: { field: 'age', title: '年龄', width: 80 }
  },
  {
    tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 }
  }
]
</script>
```

### 高级自定义列插槽

支持更多类型的列插槽，包括编辑、筛选、页脚、校验等。

```vue
<template>
  <iip-table
    :data="tableData"
    :columns="advancedColumns"
    :edit-config="{ trigger: 'click', mode: 'cell' }"
    border
  >
    <!-- 编辑插槽 -->
    <template #status-slot-column-edit="{ row }">
      <el-select v-model="row.status" placeholder="请选择状态">
        <el-option label="正常" value="1"></el-option>
        <el-option label="禁用" value="0"></el-option>
      </el-select>
    </template>

    <!-- 筛选插槽 -->
    <template #department-slot-column-filter="{ column }">
      <el-input placeholder="筛选部门" size="mini"></el-input>
    </template>

    <!-- 页脚插槽 -->
    <template #amount-slot-column-footer="{ column }">
      <strong>总计: ¥{{ getTotalAmount() }}</strong>
    </template>

    <!-- 校验插槽 -->
    <template #email-slot-column-valid="{ row, rule }">
      <span class="error-tip">{{ rule.content }}</span>
    </template>
  </iip-table>
</template>

<script setup>
const advancedColumns = [
  {
    tableColumnProps: {
      field: 'name',
      title: '姓名',
      width: 120,
      editRender: { name: 'input' }
    }
  },
  {
    tableColumnProps: {
      field: 'department',
      title: '部门',
      width: 120,
      filters: [{ data: '' }]
    }
  },
  {
    tableColumnProps: {
      field: 'status',
      title: '状态',
      width: 100,
      editRender: { name: 'select' }
    }
  },
  {
    tableColumnProps: {
      field: 'amount',
      title: '金额',
      width: 120,
      footerRender: { name: 'sum' }
    }
  },
  {
    tableColumnProps: {
      field: 'email',
      title: '邮箱',
      minWidth: 200,
      editRules: [
        { required: true, message: '邮箱不能为空' },
        { pattern: /\S+@\S+\.\S+/, message: '邮箱格式不正确' }
      ]
    }
  }
]

const getTotalAmount = () => {
  return tableData.value.reduce((sum, item) => sum + (item.amount || 0), 0)
}
</script>

<style>
.error-tip {
  color: #f56c6c;
  font-size: 12px;
}
</style>
```

### 复选框列自定义

支持自定义复选框列的内容。

```vue
<template>
  <iip-table :data="tableData" :columns="columns" :check-box-column-config="{ show: true }" border>
    <!-- 复选框列自定义内容 -->
    <template #checkbox-slot-column-default="{ row }">
      <span class="custom-checkbox-content"> 选择 {{ row.name }} </span>
    </template>
  </iip-table>
</template>
```

## 可编辑表格

表格支持单元格编辑功能，基于 vxe-table 的编辑能力。

```vue
<template>
  <div>
    <div style="margin-bottom: 16px;">
      <el-button @click="addRow">新增行</el-button>
      <el-button @click="removeSelectedRows">删除选中</el-button>
      <el-button @click="saveData">保存数据</el-button>
    </div>

    <iip-table
      ref="editTableRef"
      :data="editTableData"
      :columns="editColumns"
      :check-box-column-config="{ show: true }"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
      border
      stripe
    >
      <!-- 自定义状态编辑器 -->
      <template #status-slot-column-edit="{ row }">
        <el-select v-model="row.status" placeholder="请选择状态">
          <el-option label="正常" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </template>

      <!-- 操作列 -->
      <template #action-slot-column-default="{ row, rowIndex }">
        <el-button size="small" type="primary" @click="editRow(row, rowIndex)"> 编辑 </el-button>
        <el-button size="small" type="danger" @click="deleteRow(rowIndex)"> 删除 </el-button>
      </template>
    </iip-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { IipTableExpose } from '@bingwu/iip-ui-components'

const editTableRef = ref<IipTableExpose | null>(null)

const editTableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: 1 },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: 0 },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: 1 }
])

const editColumns = [
  {
    tableColumnProps: {
      field: 'name',
      title: '姓名',
      width: 120,
      editRender: { name: 'input' }
    }
  },
  {
    tableColumnProps: {
      field: 'age',
      title: '年龄',
      width: 100,
      editRender: {
        name: 'input',
        attrs: { type: 'number', min: 1, max: 100 }
      }
    }
  },
  {
    tableColumnProps: {
      field: 'email',
      title: '邮箱',
      width: 200,
      editRender: { name: 'input' }
    }
  },
  {
    tableColumnProps: {
      field: 'status',
      title: '状态',
      width: 120,
      editRender: { name: 'select' } // 使用插槽自定义编辑器
    }
  },
  {
    tableColumnProps: {
      field: 'action',
      title: '操作',
      width: 150,
      fixed: 'right'
    }
  }
]

// 新增行
const addRow = () => {
  const newId = Math.max(...editTableData.value.map(item => item.id)) + 1
  editTableData.value.push({
    id: newId,
    name: '',
    age: 18,
    email: '',
    status: 1
  })
  ElMessage.success('新增行成功')
}

// 删除选中行
const removeSelectedRows = () => {
  const instance = editTableRef.value?.getTableInstance()
  const selectedRows = instance?.getCheckboxRecords()

  if (!selectedRows || selectedRows.length === 0) {
    ElMessage.warning('请先选择要删除的行')
    return
  }

  selectedRows.forEach(row => {
    const index = editTableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      editTableData.value.splice(index, 1)
    }
  })

  ElMessage.success(`删除了 ${selectedRows.length} 行数据`)
}

// 编辑行
const editRow = (row: any, rowIndex: number) => {
  ElMessage.info(`编辑第 ${rowIndex + 1} 行数据`)
}

// 删除行
const deleteRow = (rowIndex: number) => {
  editTableData.value.splice(rowIndex, 1)
  ElMessage.success('删除成功')
}

// 保存数据
const saveData = () => {
  console.log('保存的数据:', editTableData.value)
  ElMessage.success('数据保存成功')
}
</script>
```

## 加载状态

表格支持加载状态显示。

```vue
<template>
  <div>
    <el-button @click="toggleLoading">
      {{ loading ? '停止加载' : '开始加载' }}
    </el-button>
    <iip-table :data="tableData" :columns="columns" :loading="loading" border />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

const toggleLoading = () => {
  loading.value = !loading.value
}

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
])

const columns = [
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80 } },
  { tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 } }
]
</script>
```

## API

### Table Props

| 参数                 | 说明           | 类型                            | 默认值       | 版本  |
| -------------------- | -------------- | ------------------------------- | ------------ | ----- |
| data                 | 表格数据       | `any[]`                         | `[]`         | 1.0.0 |
| columns              | 表格列配置     | `TableColumn[]`                 | `[]`         | 1.0.0 |
| checkBoxColumnConfig | 复选框列配置   | `checkBoxColumnConfigProps`     | -            | 1.0.0 |
| seqColumnConfig      | 序号列配置     | `seqColumnConfigProps`          | -            | 1.0.0 |
| expandColumnConfig   | 展开列配置     | `expandColumnConfigProps`       | -            | 1.0.0 |
| radioColumnConfig    | 单选框列配置   | `radioColumnConfigProps`        | -            | 1.0.0 |
| pagination           | 分页配置       | `VxePagerProps`                 | -            | 1.0.0 |
| height               | 表格高度       | `number \| string`              | -            | 1.0.0 |
| maxHeight            | 表格最大高度   | `number \| string`              | -            | 1.0.0 |
| border               | 是否显示边框   | `boolean`                       | `false`      | 1.0.0 |
| stripe               | 是否显示斑马纹 | `boolean`                       | `false`      | 1.0.0 |
| showHeader           | 是否显示表头   | `boolean`                       | `true`       | 1.0.0 |
| loading              | 加载状态       | `boolean`                       | `false`      | 1.0.0 |
| emptyText            | 空数据提示文本 | `string`                        | `'暂无数据'` | 1.0.0 |
| size                 | 表格尺寸       | `'mini' \| 'small' \| 'medium'` | `'medium'`   | 1.0.0 |
| editConfig           | 编辑配置       | `VxeTableEditConfig`            | -            | 1.1.0 |
| columnConfig         | 列配置         | `VxeTableColumnConfig`          | -            | 1.1.0 |
| checkboxConfig       | 复选框配置     | `VxeTableCheckboxConfig`        | -            | 1.1.0 |
| footerData           | 页脚数据       | `any[][]`                       | -            | 1.1.0 |
| showFooter           | 是否显示页脚   | `boolean`                       | `false`      | 1.1.0 |

**说明：**

- 所有 vxe-table 的原生属性都可以通过 `v-bind="attrs"` 传递
- `editConfig` 支持单元格编辑配置，如 `{ trigger: 'click', mode: 'cell' }`
- `columnConfig` 支持列配置，如 `{ resizable: true }`
- `checkboxConfig` 支持复选框配置，如 `{ highlight: true }`

### TableColumn

| 参数             | 说明           | 类型             | 默认值 |
| ---------------- | -------------- | ---------------- | ------ |
| tableColumnProps | 表格列原生属性 | `VxeColumnProps` | -      |

#### VxeColumnProps (表格列原生属性)

基于 vxe-table 的列配置，支持所有原生属性：

| 参数         | 说明           | 类型                                | 默认值   | 版本  |
| ------------ | -------------- | ----------------------------------- | -------- | ----- |
| field        | 列标识         | `string`                            | -        | 1.0.0 |
| title        | 列标题         | `string`                            | -        | 1.0.0 |
| width        | 列宽度         | `number \| string`                  | -        | 1.0.0 |
| minWidth     | 最小宽度       | `number \| string`                  | -        | 1.0.0 |
| sortable     | 是否可排序     | `boolean`                           | `false`  | 1.0.0 |
| filters      | 筛选配置       | `VxeColumnFilterConfig[]`           | -        | 1.1.0 |
| align        | 列对齐方式     | `'left' \| 'center' \| 'right'`     | `'left'` | 1.0.0 |
| fixed        | 是否固定列     | `'left' \| 'right'`                 | -        | 1.0.0 |
| visible      | 是否显示       | `boolean`                           | `true`   | 1.0.0 |
| resizable    | 是否可调整宽度 | `boolean`                           | `true`   | 1.1.0 |
| editRender   | 编辑渲染配置   | `VxeColumnEditRender`               | -        | 1.1.0 |
| editRules    | 编辑校验规则   | `VxeColumnEditRule[]`               | -        | 1.1.0 |
| footerRender | 页脚渲染配置   | `VxeColumnFooterRender`             | -        | 1.1.0 |
| formatter    | 格式化函数     | `(params: any) => string \| number` | -        | 1.0.0 |

**编辑渲染配置示例：**

```ts
// 输入框编辑
editRender: { name: 'input', attrs: { type: 'text' } }

// 数字输入框
editRender: { name: 'input', attrs: { type: 'number', min: 0, max: 100 } }

// 下拉选择
editRender: {
  name: 'select',
  options: [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 }
  ]
}

// 自定义编辑器（使用插槽）
editRender: { name: 'select' } // 配合 #field-slot-column-edit 插槽使用
```

### 特殊列配置

#### checkBoxColumnConfigProps (复选框列配置)

| 参数             | 说明             | 类型             | 默认值 |
| ---------------- | ---------------- | ---------------- | ------ |
| show             | 是否显示复选框   | `boolean`        | -      |
| tableColumnProps | 复选框列原生属性 | `VxeColumnProps` | -      |

#### seqColumnConfigProps (序号列配置)

| 参数             | 说明           | 类型             | 默认值 |
| ---------------- | -------------- | ---------------- | ------ |
| show             | 是否显示序号   | `boolean`        | -      |
| tableColumnProps | 序号列原生属性 | `VxeColumnProps` | -      |

#### expandColumnConfigProps (展开列配置)

| 参数             | 说明           | 类型             | 默认值 |
| ---------------- | -------------- | ---------------- | ------ |
| show             | 是否显示展开列 | `boolean`        | -      |
| tableColumnProps | 展开列原生属性 | `VxeColumnProps` | -      |

#### radioColumnConfigProps (单选框列配置)

| 参数             | 说明             | 类型             | 默认值 |
| ---------------- | ---------------- | ---------------- | ------ |
| show             | 是否显示单选框   | `boolean`        | -      |
| tableColumnProps | 单选框列原生属性 | `VxeColumnProps` | -      |

### PaginationConfig

| 参数        | 说明                   | 类型       | 默认值              |
| ----------- | ---------------------- | ---------- | ------------------- |
| currentPage | 当前页码               | `number`   | `1`                 |
| pageSize    | 每页条数               | `number`   | `20`                |
| total       | 总条数                 | `number`   | `0`                 |
| pageSizes   | 每页条数选项           | `number[]` | `[10, 20, 50, 100]` |
| showTotal   | 是否显示总条数         | `boolean`  | `true`              |
| showSizes   | 是否显示每页条数选择器 | `boolean`  | `true`              |
| showJumper  | 是否显示跳转页面       | `boolean`  | `true`              |

### Table Events

| 事件名           | 说明             | 参数                         |
| ---------------- | ---------------- | ---------------------------- |
| row-click        | 行点击事件       | `{ row, rowIndex, $event }`  |
| row-dblclick     | 行双击事件       | `{ row, rowIndex, $event }`  |
| checkbox-change  | 复选框变化事件   | `{ checked, row, rowIndex }` |
| checkbox-all     | 全选变化事件     | `{ checked, records }`       |
| sort-change      | 排序变化事件     | `{ column, field, order }`   |
| filter-change    | 筛选变化事件     | `{ column, field, values }`  |
| page-change      | 分页变化事件     | `{ currentPage, pageSize }`  |
| page-size-change | 每页条数变化事件 | `{ pageSize }`               |

### Table Methods

| 方法名             | 说明             | 参数              |
| ------------------ | ---------------- | ----------------- |
| getTableInstance   | 获取表格实例     | -                 |
| getCheckboxRecords | 获取选中的行数据 | -                 |
| setCheckboxRow     | 设置选中的行     | `(rows, checked)` |
| setAllCheckboxRow  | 设置全选状态     | `(checked)`       |
| clearCheckboxRow   | 清空选中状态     | -                 |
| refresh            | 刷新表格         | -                 |
| recalculate        | 重新计算表格     | -                 |

### Table Slots

| 插槽名                       | 说明               | 参数                        |
| ---------------------------- | ------------------ | --------------------------- |
| [field]-slot-column-default  | 自定义列内容       | `{ row, rowIndex, column }` |
| [field]-slot-column-header   | 自定义列头         | `{ column }`                |
| [field]-slot-column-edit     | 自定义编辑内容     | `{ row, rowIndex, column }` |
| [field]-slot-column-filter   | 自定义筛选内容     | `{ column }`                |
| [field]-slot-column-footer   | 自定义页脚内容     | `{ column, items }`         |
| [field]-slot-column-valid    | 自定义校验错误提示 | `{ row, column, rule }`     |
| checkbox-slot-column-default | 自定义复选框列     | `{ row, rowIndex }`         |
| seq-slot-column-default      | 自定义序号列       | `{ rowIndex }`              |
| expand-slot-column-content   | 自定义展开列内容   | `{ row, rowIndex }`         |
| radio-slot-column-default    | 自定义单选框列     | `{ row, rowIndex }`         |

**插槽命名规则：**

- 普通列插槽：`{field}-slot-column-{slotType}`
- 特殊列插槽：
  - 复选框：`checkbox-slot-column-default`
  - 序号：`seq-slot-column-default`
  - 展开：`expand-slot-column-content`
  - 单选框：`radio-slot-column-default`
- `{field}` 为列的 field 属性值
- `{slotType}` 为插槽类型：
  - `default`：默认内容插槽
  - `header`：列头插槽
  - `edit`：编辑状态插槽
  - `filter`：筛选插槽
  - `footer`：页脚插槽
  - `valid`：校验错误提示插槽

**插槽优化说明：**

从 v2.0.0 开始，表格组件进行了插槽渲染优化：

- 只有当列确实定义了插槽时，才会渲染对应的 template
- 未使用的插槽不会产生额外的 DOM 节点，提升渲染性能
- 插槽检查基于 `hasColumnSlot` 函数，精确判断插槽是否存在

## 注意事项

### 🔧 环境要求

1. **Node.js**: 建议使用 Node.js 16+ 版本
2. **Vue**: 需要 Vue 3.3+ 版本
3. **依赖要求**：
   - `vxe-table@^4.15.6` - 核心表格组件
   - `vxe-pc-ui@4.8.15` - PC端UI组件
   - `xe-utils@^3.7.8` - 工具函数库
   - `element-plus@^2.4.4` (可选) - Element Plus组件库

### 📦 安装和引入

4. **插件注册顺序很重要**：必须先注册 `VxeUITable` 和 `VxePCUI`，再注册 `IipUI`
5. **样式引入**：需要同时引入 vxe-table、vxe-pc-ui 和 iip-ui-theme 的样式文件
6. **按需引入**：如果只使用 Table 组件，仍需要注册 vxe-table 相关插件

### 🎯 使用规范

7. **列配置结构**：必须使用 `{ tableColumnProps: {...} }` 包装列属性
8. **插槽命名规则**：严格按照 `{field}-slot-column-{slotType}` 格式
9. **特殊列配置**：复选框、序号、展开、单选框需要通过对应配置属性启用
10. **分页处理**：需要手动处理数据分页逻辑，组件不会自动分页

### ⚡ 性能优化

11. **智能插槽渲染**：v1.2.0+ 版本实现了插槽性能优化，只渲染实际使用的插槽
12. **支持的插槽类型**：`default`、`header`、`edit`、`filter`、`footer`、`valid`
13. **虚拟滚动**：大量数据时可通过 `getTableInstance()` 访问原生实例启用虚拟滚动

### 🔄 版本兼容

14. **当前版本**：基于 vxe-table 4.15.6，支持最新的 API 特性
15. **API 变更**：v1.1.0+ 使用 `column-config` 替代已废弃的 `resizable` 属性
16. **向后兼容**：保持与旧版本的 API 兼容性

### 🐛 常见问题

17. **样式问题**：确保正确引入所有必要的 CSS 文件
18. **编辑功能**：使用编辑功能时需配置 `editConfig` 和 `editRender`
19. **事件监听**：表格事件需要通过 vxe-table 的事件系统处理
20. **类型支持**：完整的 TypeScript 类型定义，建议使用 TS 开发
