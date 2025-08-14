# Table 表格

基于 vxe-table 二次封装的表格组件，提供了丰富的功能和简洁的 API。

## 特性

- 🚀 **高性能**：智能插槽渲染，只渲染实际使用的插槽，避免不必要的性能开销
- 🎨 **灵活定制**：支持多种插槽类型（内容、表头、编辑、筛选、页脚、校验）
- 📦 **开箱即用**：基于 vxe-table 4.7+ 封装，提供简洁统一的 API
- 🔧 **类型安全**：完整的 TypeScript 类型定义
- 🎯 **插槽优化**：精确的插槽检测机制，提升组件渲染效率

## 基础用法

最简单的表格用法。

```vue
<template>
  <iip-table :data="tableData" :columns="columns" border />
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' }
])

const columns = [
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80 } },
  { tableColumnProps: { field: 'email', title: '邮箱', minWidth: 200 } }
]
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

支持分页功能的表格。

```vue
<template>
  <iip-table
    :data="paginatedData"
    :columns="columns"
    :pagination="paginationConfig"
    border
    @page-change="handlePageChange"
    @page-size-change="handlePageSizeChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue'

const paginationConfig = ref({
  currentPage: 1,
  pageSize: 10,
  total: 100,
  showTotal: true,
  showSizes: true,
  showJumper: true,
  pageSizes: [10, 20, 50, 100]
})

const paginatedData = computed(() => {
  const start = (paginationConfig.value.currentPage - 1) * paginationConfig.value.pageSize
  const end = start + paginationConfig.value.pageSize
  return tableData.value.slice(start, end)
})

const handlePageChange = params => {
  paginationConfig.value.currentPage = params.currentPage
}

const handlePageSizeChange = params => {
  paginationConfig.value.pageSize = params.pageSize
  paginationConfig.value.currentPage = 1
}
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

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const toggleLoading = () => {
  loading.value = !loading.value
}
</script>
```

## API

### Table Props

| 参数                 | 说明             | 类型                            | 默认值       |
| -------------------- | ---------------- | ------------------------------- | ------------ |
| data                 | 表格数据         | `any[]`                         | `[]`         |
| columns              | 表格列配置       | `TableColumn[]`                 | `[]`         |
| checkBoxColumnConfig | 复选框列配置     | `checkBoxColumnConfigProps`     | -            |
| seqColumnConfig      | 序号列配置       | `seqColumnConfigProps`          | -            |
| expandColumnConfig   | 展开列配置       | `expandColumnConfigProps`       | -            |
| radioColumnConfig    | 单选框列配置     | `radioColumnConfigProps`        | -            |
| height               | 表格高度         | `number \| string`              | -            |
| maxHeight            | 表格最大高度     | `number \| string`              | -            |
| border               | 是否显示边框     | `boolean`                       | `true`       |
| stripe               | 是否显示斑马纹   | `boolean`                       | `false`      |
| showHeader           | 是否显示表头     | `boolean`                       | `true`       |
| resizable            | 是否可调整列宽   | `boolean`                       | `true`       |
| loading              | 加载状态         | `boolean`                       | `false`      |
| emptyText            | 空数据提示文本   | `string`                        | `'暂无数据'` |
| rowKey               | 行键名           | `string`                        | `'id'`       |
| size                 | 表格尺寸         | `'mini' \| 'small' \| 'medium'` | `'medium'`   |
| autoResize           | 是否自适应父容器 | `boolean`                       | `true`       |
| pagination           | 分页配置         | `PaginationConfig`              | -            |

### TableColumn

| 参数             | 说明           | 类型             | 默认值 |
| ---------------- | -------------- | ---------------- | ------ |
| tableColumnProps | 表格列原生属性 | `VxeColumnProps` | -      |

#### VxeColumnProps (表格列原生属性)

| 参数       | 说明           | 类型                                | 默认值   |
| ---------- | -------------- | ----------------------------------- | -------- |
| field      | 列标识         | `string`                            | -        |
| title      | 列标题         | `string`                            | -        |
| width      | 列宽度         | `number \| string`                  | -        |
| minWidth   | 最小宽度       | `number \| string`                  | -        |
| sortable   | 是否可排序     | `boolean`                           | `false`  |
| filterable | 是否可筛选     | `boolean`                           | `false`  |
| align      | 列对齐方式     | `'left' \| 'center' \| 'right'`     | `'left'` |
| fixed      | 是否固定列     | `'left' \| 'right'`                 | -        |
| formatter  | 自定义渲染函数 | `(params: any) => string \| number` | -        |

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

1. 使用 Table 组件需要安装 `vxe-table@^4.7.0` 和 `xe-utils` 依赖
2. 自定义列内容需要按照插槽命名规则定义插槽
3. 特殊列（复选框、序号、展开、单选框）通过对应的配置属性控制显示
4. 插槽命名必须严格按照命名规则：`{field}-slot-column-{slotType}`
5. 分页功能使用 `vxe-pager` 组件，需要手动处理数据分页逻辑
6. 表格的高级功能（如虚拟滚动、树形数据等）可以通过 `getTableInstance` 方法获取原始实例来实现
7. 分页器支持多种布局配置，可通过 `pagination` 配置项控制显示内容
8. 当前版本基于 vxe-table 4.7.0，已适配最新 API（如 `column-config` 替代废弃的 `resizable` 属性）
9. 列配置结构已更新，需要使用 `tableColumnProps` 包装原始的列属性
10. **插槽性能优化**：组件会智能检测是否定义了插槽，只渲染实际使用的插槽模板，避免不必要的性能开销
11. 支持多种插槽类型：`default`（内容）、`header`（表头）、`edit`（编辑）、`filter`（筛选）、`footer`（页脚）、`valid`（校验）
12. 特殊列插槽只有在定义时才会渲染，如 `expand-slot-column-content` 需要配置 `expandColumnConfig.show: true` 且定义对应插槽
