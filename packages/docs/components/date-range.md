# DateRange 日期范围选择器

基于 Element Plus DatePicker 组件的二次封装，提供了更便捷的日期范围选择功能，支持快速选择预设日期范围。

## 特性

- 🚀 **便捷选择**: 提供今天、昨天、本周、本月等快速选择选项
- 📅 **范围限制**: 支持禁用未来日期，确保开始日期不晚于结束日期
- 🎨 **样式定制**: 支持自定义开始和结束日期选择器的样式
- ⚡ **智能联动**: 选择开始日期时自动设置合理的结束日期
- 🔧 **灵活配置**: 支持透传 Element Plus DatePicker 的所有属性

## 基础用法

最简单的日期范围选择：

```vue
<template>
  <div>
    <iip-date-range v-model="dateRange" @change="handleDateChange" />
    <p>选择的日期范围：{{ dateRange.startTime }} ~ {{ dateRange.endTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const dateRange = reactive({
  startTime: '',
  endTime: ''
})

const handleDateChange = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围变化:', value)
}
</script>
```

## 允许选择未来日期

默认情况下，组件禁用未来日期。可以通过 `selectFutureTime` 属性允许选择未来日期：

```vue
<template>
  <iip-date-range v-model="dateRange" :select-future-time="true" @change="handleDateChange" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const dateRange = reactive({
  startTime: '',
  endTime: ''
})

const handleDateChange = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围变化:', value)
}
</script>
```

## 自定义样式

可以分别为开始和结束日期选择器设置不同的样式：

```vue
<template>
  <iip-date-range
    v-model="dateRange"
    :gap="20"
    :start-picker-css="{ width: '200px', borderColor: '#409eff' }"
    :end-picker-css="{ width: '200px', borderColor: '#67c23a' }"
    @change="handleDateChange"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const dateRange = reactive({
  startTime: '',
  endTime: ''
})

const handleDateChange = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围变化:', value)
}
</script>
```

## 透传属性配置

可以为开始和结束日期选择器分别配置不同的属性：

```vue
<template>
  <iip-date-range
    v-model="dateRange"
    :start-props="{
      placeholder: '请选择开始日期',
      clearable: true,
      size: 'large'
    }"
    :end-props="{
      placeholder: '请选择结束日期',
      clearable: true,
      size: 'large'
    }"
    @change="handleDateChange"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const dateRange = reactive({
  startTime: '',
  endTime: ''
})

const handleDateChange = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围变化:', value)
}
</script>
```

## 表单集成

在表单中使用日期范围选择器：

```vue
<template>
  <el-form :model="form" label-width="100px">
    <el-form-item label="查询时间" prop="dateRange">
      <iip-date-range
        v-model="form.dateRange"
        :select-future-time="false"
        @change="handleDateChange"
      />
    </el-form-item>
    <el-form-item label="项目名称" prop="projectName">
      <el-input v-model="form.projectName" placeholder="请输入项目名称" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  dateRange: {
    startTime: '',
    endTime: ''
  },
  projectName: ''
})

const handleDateChange = (value: { startTime: string; endTime: string }) => {
  console.log('日期范围变化:', value)
}

const handleSubmit = () => {
  console.log('表单数据:', form)
}

const handleReset = () => {
  form.dateRange.startTime = ''
  form.dateRange.endTime = ''
  form.projectName = ''
}
</script>
```

## 快速选择功能

组件内置了多个快速选择选项：

- **今天**: 选择当天日期
- **昨天**: 选择昨天的日期
- **本周**: 选择本周开始到今天
- **本月**: 选择本月开始到结束
- **上月**: 选择上个月开始到结束
- **本年**: 选择本年开始到今天

```vue
<template>
  <div>
    <h3>使用快速选择</h3>
    <iip-date-range v-model="dateRange" @change="handleDateChange" />
    <p style="margin-top: 10px;">点击日期选择器左侧的快速选择按钮，可以快速选择常用的日期范围</p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const dateRange = reactive({
  startTime: '',
  endTime: ''
})

const handleDateChange = (value: { startTime: string; endTime: string }) => {
  console.log('快速选择的日期范围:', value)
}
</script>
```

## 日期验证逻辑

组件内置了智能的日期验证逻辑：

1. **未来日期限制**: 默认禁用未来日期（可通过 `selectFutureTime` 开启）
2. **范围验证**: 开始日期不能晚于结束日期，结束日期不能早于开始日期
3. **智能联动**: 选择开始日期时，如果没有结束日期或开始日期是今天，会自动设置结束日期为今天

```vue
<template>
  <div>
    <h3>日期验证示例</h3>
    <iip-date-range v-model="dateRange" :select-future-time="false" @change="handleDateChange" />
    <div style="margin-top: 10px; color: #666;">
      <p>验证规则：</p>
      <ul>
        <li>不能选择未来日期</li>
        <li>开始日期不能晚于结束日期</li>
        <li>结束日期不能早于开始日期</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const dateRange = reactive({
  startTime: '',
  endTime: ''
})

const handleDateChange = (value: { startTime: string; endTime: string }) => {
  console.log('验证通过的日期范围:', value)
}
</script>
```

## API

### Props

| 参数             | 说明                           | 类型                                     | 默认值                           |
| ---------------- | ------------------------------ | ---------------------------------------- | -------------------------------- |
| modelValue       | 绑定值，包含开始和结束时间     | `{ startTime: string; endTime: string }` | `{ startTime: '', endTime: '' }` |
| gap              | 两个日期选择器之间的间距（px） | `number \| string`                       | `10`                             |
| startProps       | 开始日期选择器的属性           | `Partial<DatePickerProps>`               | `{}`                             |
| endProps         | 结束日期选择器的属性           | `Partial<DatePickerProps>`               | `{}`                             |
| selectFutureTime | 是否允许选择未来时间           | `boolean`                                | `false`                          |
| startPickerCss   | 开始日期选择器的自定义样式     | `CSSProperties`                          | `{}`                             |
| endPickerCss     | 结束日期选择器的自定义样式     | `CSSProperties`                          | `{}`                             |

### Events

| 事件名            | 说明           | 参数                                              |
| ----------------- | -------------- | ------------------------------------------------- |
| update:modelValue | 值变化时触发   | `(value: { startTime: string; endTime: string })` |
| change            | 日期变化时触发 | `(value: { startTime: string; endTime: string })` |

### 数据格式

组件使用的日期格式为 `YYYY-MM-DD`，例如：

```typescript
{
  startTime: '2024-01-01',
  endTime: '2024-01-31'
}
```

### DatePickerProps

`startProps` 和 `endProps` 支持 Element Plus DatePicker 的所有属性，常用属性包括：

| 属性        | 说明             | 类型                              | 默认值                      |
| ----------- | ---------------- | --------------------------------- | --------------------------- |
| placeholder | 占位文本         | `string`                          | `'开始日期'` / `'结束日期'` |
| clearable   | 是否显示清除按钮 | `boolean`                         | `true`                      |
| size        | 输入框尺寸       | `'large' \| 'default' \| 'small'` | `'default'`                 |
| disabled    | 是否禁用         | `boolean`                         | `false`                     |
| readonly    | 是否只读         | `boolean`                         | `false`                     |

## 最佳实践

### 1. 搜索表单中使用

在搜索表单中，通常需要设置合理的默认值：

```vue
<template>
  <div class="search-form">
    <iip-date-range
      v-model="searchForm.dateRange"
      :select-future-time="false"
      @change="handleSearch"
    />
    <el-button type="primary" @click="handleSearch">搜索</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import dayjs from 'dayjs'

const searchForm = reactive({
  dateRange: {
    startTime: '',
    endTime: ''
  }
})

// 页面加载时设置默认的查询时间范围（最近30天）
onMounted(() => {
  searchForm.dateRange.startTime = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
  searchForm.dateRange.endTime = dayjs().format('YYYY-MM-DD')
})

const handleSearch = () => {
  console.log('搜索条件:', searchForm.dateRange)
  // 执行搜索逻辑
}
</script>
```

### 2. 数据统计场景

在数据统计场景中，可以配合图表组件使用：

```vue
<template>
  <div class="statistics-panel">
    <div class="date-selector">
      <span>统计时间：</span>
      <iip-date-range
        v-model="statisticsForm.dateRange"
        :select-future-time="false"
        @change="updateStatistics"
      />
    </div>
    <div class="chart-container">
      <!-- 图表组件 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const statisticsForm = reactive({
  dateRange: {
    startTime: '',
    endTime: ''
  }
})

const updateStatistics = () => {
  console.log('更新统计数据:', statisticsForm.dateRange)
  // 根据日期范围更新统计数据
}

// 监听日期变化，自动更新统计
watch(
  () => statisticsForm.dateRange,
  newValue => {
    if (newValue.startTime && newValue.endTime) {
      updateStatistics()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.statistics-panel {
  padding: 20px;
}

.date-selector {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.chart-container {
  height: 400px;
  border: 1px solid #eee;
}
</style>
```

### 3. 表单验证

在需要验证的表单中使用：

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
    <el-form-item label="时间范围" prop="dateRange">
      <iip-date-range v-model="form.dateRange" @change="validateDateRange" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import dayjs from 'dayjs'

const formRef = ref<FormInstance>()

const form = reactive({
  dateRange: {
    startTime: '',
    endTime: ''
  }
})

const rules = {
  dateRange: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!value.startTime || !value.endTime) {
          callback(new Error('请选择时间范围'))
        } else {
          // 验证时间范围不能超过90天
          const start = dayjs(value.startTime)
          const end = dayjs(value.endTime)
          const diffDays = end.diff(start, 'day')

          if (diffDays > 90) {
            callback(new Error('时间范围不能超过90天'))
          } else {
            callback()
          }
        }
      },
      trigger: 'change'
    }
  ]
}

const validateDateRange = () => {
  formRef.value?.validateField('dateRange')
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    console.log('表单验证通过:', form)
  }
}
</script>
```

通过这些示例和最佳实践，你可以更好地在项目中使用 DateRange 组件。
