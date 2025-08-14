# Table 表格

基于 vxe-table 二次封装的表格组件，提供了丰富的功能和简洁的 API。

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
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80 },
  { field: 'email', title: '邮箱', minWidth: 200 }
]
</script>
```

## 带复选框和序号

表格支持复选框选择和序号显示。

```vue
<template>
  <iip-table
    :data="tableData"
    :columns="columns"
    show-checkbox
    show-seq
    border
    @checkbox-change="handleCheckboxChange"
    @checkbox-all="handleCheckboxAll"
  />
</template>

<script setup>
const handleCheckboxChange = params => {
  console.log('复选框变化:', params)
}

const handleCheckboxAll = params => {
  console.log('全选变化:', params)
}
</script>
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

支持自定义列内容渲染。

```vue
<template>
  <iip-table :data="tableData" :columns="customColumns" border>
    <!-- 状态列自定义渲染 -->
    <template #status="{ row }">
      <el-tag :type="getStatusType(row.status)">
        {{ getStatusText(row.status) }}
      </el-tag>
    </template>
  </iip-table>
</template>

<script setup>
const customColumns = [
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80, sortable: true },
  { field: 'email', title: '邮箱', minWidth: 200 },
  { field: 'status', title: '状态', width: 100, slotName: 'status' }
]

const getStatusType = status => {
  const types = ['info', 'success', 'warning']
  return types[status] || 'info'
}

const getStatusText = status => {
  const texts = ['禁用', '正常', '待审核']
  return texts[status] || '未知'
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

| 参数         | 说明             | 类型                            | 默认值       |
| ------------ | ---------------- | ------------------------------- | ------------ |
| data         | 表格数据         | `any[]`                         | `[]`         |
| columns      | 表格列配置       | `TableColumn[]`                 | `[]`         |
| height       | 表格高度         | `number \| string`              | -            |
| maxHeight    | 表格最大高度     | `number \| string`              | -            |
| border       | 是否显示边框     | `boolean`                       | `true`       |
| stripe       | 是否显示斑马纹   | `boolean`                       | `false`      |
| showHeader   | 是否显示表头     | `boolean`                       | `true`       |
| showCheckbox | 是否显示复选框   | `boolean`                       | `false`      |
| showSeq      | 是否显示序号     | `boolean`                       | `false`      |
| resizable    | 是否可调整列宽   | `boolean`                       | `true`       |
| loading      | 加载状态         | `boolean`                       | `false`      |
| emptyText    | 空数据提示文本   | `string`                        | `'暂无数据'` |
| rowKey       | 行键名           | `string`                        | `'id'`       |
| size         | 表格尺寸         | `'mini' \| 'small' \| 'medium'` | `'medium'`   |
| autoResize   | 是否自适应父容器 | `boolean`                       | `true`       |
| pagination   | 分页配置         | `PaginationConfig`              | -            |

### TableColumn

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
| slotName   | 插槽名称       | `string`                            | -        |

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

| 插槽名     | 说明         | 参数                        |
| ---------- | ------------ | --------------------------- |
| [slotName] | 自定义列内容 | `{ row, rowIndex, column }` |

## 注意事项

1. 使用 Table 组件需要安装 `vxe-table@^4.7.0` 和 `xe-utils` 依赖
2. 自定义列内容需要在 `columns` 中设置 `slotName` 属性
3. 分页功能使用 `vxe-pager` 组件，需要手动处理数据分页逻辑
4. 表格的高级功能（如虚拟滚动、树形数据等）可以通过 `getTableInstance` 方法获取原始实例来实现
5. 分页器支持多种布局配置，可通过 `pagination` 配置项控制显示内容
6. 当前版本基于 vxe-table 4.7.0，已适配最新 API（如 `column-config` 替代废弃的 `resizable` 属性）
