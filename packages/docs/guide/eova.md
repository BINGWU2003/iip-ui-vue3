# Eova 工具

IIP UI Vue3 提供了 Eova 到 Vue 组件配置的转换工具，帮助你快速将 Eova 字段定义转换为 Table 组件所需的列配置。

## 简介

`EovaToAvueConverter` 是一个专门用于将 Eova 字段定义转换为表格列配置的工具类。它能够：

- 将 Eova 字段类型映射为对应的组件类型
- 转换字段属性为表格列属性
- 过滤和验证字段数据
- 提供类型安全的转换结果

## 基础用法

### 导入工具

```typescript
import { eovaConverter, EovaToAvueConverter } from '@bingwu/iip-ui-utils'

// 使用预设实例
console.log(eovaConverter)

// 或创建新实例
const converter = new EovaToAvueConverter()
```

### 简单转换

```typescript
// Eova 字段定义
const eovaFields = [
  {
    cn: '姓名',
    en: 'name',
    type: '文本框',
    width: 120,
    is_show: true,
    is_order: true
    // ... 其他 Eova 字段属性
  },
  {
    cn: '年龄',
    en: 'age',
    type: '数字框',
    width: 80,
    is_show: true,
    is_order: false
  },
  {
    cn: '邮箱',
    en: 'email',
    type: '文本框',
    width: 200,
    is_show: true,
    is_order: false
  }
]

// 转换为表格列配置
const tableColumns = eovaConverter.convertColumns(eovaFields)

console.log(tableColumns)
// 输出:
// [
//   { field: 'name', title: '姓名', width: 120, visible: true, sortable: true },
//   { field: 'age', title: '年龄', width: 80, visible: true, sortable: false },
//   { field: 'email', title: '邮箱', width: 200, visible: true, sortable: false }
// ]
```

### 在 Table 组件中使用

```vue
<template>
  <div>
    <iip-table :data="tableData" :columns="tableColumns" border stripe />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { eovaConverter } from '@bingwu/iip-ui-utils'

// 从 API 获取的 Eova 字段定义
const eovaFields = ref([
  {
    cn: '用户名',
    en: 'username',
    type: '文本框',
    width: 120,
    is_show: true,
    is_order: true,
    order_num: 1
  },
  {
    cn: '状态',
    en: 'status',
    type: '下拉框',
    width: 100,
    is_show: true,
    is_order: false,
    order_num: 2
  },
  {
    cn: '创建时间',
    en: 'createTime',
    type: '日期框',
    width: 150,
    is_show: true,
    is_order: true,
    order_num: 3
  }
])

// 转换为表格列配置
const tableColumns = computed(() => {
  const convertedColumns = eovaConverter.convertColumns(eovaFields.value)
  return convertedColumns.map(column => ({
    tableColumnProps: column
  }))
})

// 表格数据
const tableData = ref([
  {
    username: 'admin',
    status: '正常',
    createTime: '2024-01-01'
  },
  {
    username: 'user1',
    status: '禁用',
    createTime: '2024-01-02'
  }
])
</script>
```

## 字段类型映射

### 内置映射关系

`EovaToAvueConverter` 内置了常用的字段类型映射：

| Eova 字段类型 | 映射类型 | 说明         |
| ------------- | -------- | ------------ |
| 文本框        | input    | 普通文本输入 |
| 文本域        | textarea | 多行文本输入 |
| 数字框        | number   | 数字输入     |
| 自增框        | input    | 自增ID输入   |
| 密码框        | password | 密码输入     |
| 日期框        | date     | 日期选择     |
| 时间框        | datetime | 日期时间选择 |
| 时间框2       | datetime | 日期时间选择 |
| 年            | year     | 年份选择     |
| 月            | month    | 月份选择     |
| 日            | date     | 日期选择     |
| 下拉框        | select   | 下拉选择     |
| 单选框        | radio    | 单选按钮     |
| 复选框        | checkbox | 复选框       |
| 布尔框        | switch   | 开关切换     |
| 查找框        | select   | 查找选择     |
| 下拉树        | tree     | 树形选择     |
| 输入选择框    | select   | 输入选择     |
| 图片框        | upload   | 图片上传     |
| 多图框        | upload   | 多图上传     |
| 多图框2       | upload   | 多图上传     |
| 文件框        | upload   | 文件上传     |
| 编辑框        | ueditor  | 富文本编辑   |
| JSON          | textarea | JSON 文本    |
| JSON框        | textarea | JSON 编辑    |
| 图标框        | icon     | 图标选择     |
| 颜色框        | color    | 颜色选择     |
| 坐标框        | input    | 坐标输入     |
| SVG           | input    | SVG 输入     |

### 自定义映射

你可以修改字段类型映射来满足特定需求：

```typescript
import { EovaToAvueConverter } from '@bingwu/iip-ui-utils'

// 创建新的转换器实例
const customConverter = new EovaToAvueConverter()

// 获取当前映射并修改
const currentMapping = customConverter.fieldTypeMap
console.log(currentMapping)

// 设置新的映射关系
customConverter.fieldTypeMap = {
  ...currentMapping,
  自定义字段: 'custom-component',
  特殊输入: 'special-input'
}

// 使用自定义转换器
const customColumns = customConverter.convertColumns(eovaFields)
```

## 字段属性转换

### 支持的字段属性

转换器会处理以下 Eova 字段属性：

```typescript
interface EovaField {
  cn: string // 中文名称 -> title
  en: string // 英文名称 -> field
  type: string // 字段类型 -> 组件类型映射
  width: number // 宽度 -> width
  is_show: boolean // 是否显示 -> visible
  is_order: boolean // 是否可排序 -> sortable
  order_num: number // 排序号（用于字段排序）
  // ... 其他属性
}
```

### 转换结果

转换后的列配置包含以下属性：

```typescript
interface TableColumnProps {
  field?: string // 列字段名
  title?: string // 列标题
  width?: number // 列宽度
  visible?: boolean // 是否可见
  sortable?: boolean // 是否可排序
  fixed?: 'left' | 'right' // 固定列位置
}
```

## 高级用法

### 字段过滤

转换器会自动过滤不符合条件的字段：

```typescript
// 以下字段会被过滤掉：
const invalidFields = [
  { cn: '', en: 'empty_title' }, // 空标题
  { cn: '   ', en: 'whitespace' }, // 只包含空格的标题
  { cn: null, en: 'null_title' } // null 标题
]

const validFields = [{ cn: '有效字段', en: 'valid_field' }]

// 只有有效字段会被转换
const result = eovaConverter.convertColumns([...invalidFields, ...validFields])
console.log(result.length) // 1
```

### 批量转换示例

```typescript
// 模拟从 API 获取 Eova 配置
async function fetchEovaConfig() {
  const response = await fetch('/api/eova/fields')
  const eovaFields = await response.json()

  // 转换为表格配置
  const tableColumns = eovaConverter.convertColumns(eovaFields)

  // 包装为 IIP Table 格式
  return tableColumns.map(column => ({
    tableColumnProps: column
  }))
}

// 在组件中使用
export default {
  async setup() {
    const columns = await fetchEovaConfig()
    const tableData = ref([])

    return {
      columns,
      tableData
    }
  }
}
```

### 与表单编辑结合

```vue
<template>
  <div>
    <!-- 可编辑表格 -->
    <iip-table
      :data="tableData"
      :columns="editableColumns"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
      border
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { eovaConverter } from '@bingwu/iip-ui-utils'

const eovaFields = ref([
  {
    cn: '姓名',
    en: 'name',
    type: '文本框',
    width: 120,
    is_show: true,
    is_edit: true // 可编辑字段
  },
  {
    cn: '年龄',
    en: 'age',
    type: '数字框',
    width: 80,
    is_show: true,
    is_edit: true
  },
  {
    cn: '状态',
    en: 'status',
    type: '下拉框',
    width: 100,
    is_show: true,
    is_edit: true
  }
])

// 转换并添加编辑配置
const editableColumns = computed(() => {
  const baseColumns = eovaConverter.convertColumns(eovaFields.value)

  return baseColumns.map((column, index) => {
    const eovaField = eovaFields.value[index]
    const tableColumnProps = { ...column }

    // 根据 Eova 字段类型添加编辑器
    if (eovaField.is_edit) {
      switch (eovaField.type) {
        case '文本框':
          tableColumnProps.editRender = { name: 'input' }
          break
        case '数字框':
          tableColumnProps.editRender = {
            name: 'input',
            attrs: { type: 'number' }
          }
          break
        case '下拉框':
          tableColumnProps.editRender = { name: 'select' }
          break
      }
    }

    return { tableColumnProps }
  })
})
</script>
```

## 工具方法

### 检查字段类型支持

```typescript
// 检查字段类型是否被支持
const isSupported = eovaConverter.isFieldTypeSupported('文本框') // true
const isCustomSupported = eovaConverter.isFieldTypeSupported('自定义类型') // false

// 获取所有支持的字段类型
const supportedTypes = eovaConverter.getSupportedFieldTypes()
console.log(supportedTypes) // ['文本框', '数字框', '下拉框', ...]
```

### 获取推荐宽度

```typescript
// 根据字段类型获取推荐的列宽
const recommendedWidth = eovaConverter.getRecommendedWidth('数字框') // 100
const defaultWidth = eovaConverter.getRecommendedWidth('未知类型') // 120
```

## 最佳实践

### 1. 缓存转换结果

```typescript
import { computed, ref } from 'vue'

const eovaFields = ref([])
const cachedColumns = computed(() => {
  // 只在 eovaFields 变化时重新转换
  return eovaConverter.convertColumns(eovaFields.value)
})
```

### 2. 错误处理

```typescript
function safeConvertColumns(fields: any[]) {
  try {
    if (!Array.isArray(fields)) {
      console.warn('Eova fields must be an array')
      return []
    }

    return eovaConverter.convertColumns(fields)
  } catch (error) {
    console.error('Error converting Eova fields:', error)
    return []
  }
}
```

### 3. 类型安全

```typescript
interface EovaField {
  cn: string
  en: string
  type: string
  width?: number
  is_show?: boolean
  is_order?: boolean
}

// 使用明确的类型定义
const typedFields: EovaField[] = await fetchEovaFields()
const columns = eovaConverter.convertColumns(typedFields)
```

### 4. 性能优化

```typescript
// 对于大量字段，考虑分批处理
function convertLargeFieldSet(fields: EovaField[], batchSize = 50) {
  const batches = []
  for (let i = 0; i < fields.length; i += batchSize) {
    const batch = fields.slice(i, i + batchSize)
    batches.push(eovaConverter.convertColumns(batch))
  }
  return batches.flat()
}
```

通过这些工具和方法，你可以轻松地将现有的 Eova 配置迁移到 IIP UI Vue3 的 Table 组件中，大大减少手动配置的工作量。
