# Select 选择器(不要使用，后续将移除)

基于 Element Plus Select 组件的二次封装，提供了更丰富的功能和更好的用户体验。

## 基础用法

```vue
<template>
  <iip-select v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' }
]
</script>
```

## 多选模式

```vue
<template>
  <iip-select
    v-model="value"
    :options="options"
    multiple
    show-select-all
    show-count
    placeholder="请选择多个选项"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' },
  { value: '4', label: '选项四' }
]
</script>
```

## 主要特性

- ✅ **全选功能** - 多选模式下支持全选/取消全选
- ✅ **搜索过滤** - 可搜索选项内容
- ✅ **远程加载** - 支持远程搜索和数据加载
- ✅ **分组选项** - 支持选项分组显示
- ✅ **选项统计** - 显示已选择的选项数量
- ✅ **防抖搜索** - 可配置的搜索防抖

## API

### Props

| 参数            | 说明             | 类型           | 默认值  |
| --------------- | ---------------- | -------------- | ------- |
| model-value     | 绑定值           | any            | —       |
| options         | 选项数据         | SelectOption[] | []      |
| multiple        | 是否多选         | boolean        | false   |
| show-select-all | 是否显示全选     | boolean        | false   |
| select-all-text | 全选文本         | string         | 全选    |
| filterable      | 是否可搜索       | boolean        | false   |
| remote          | 是否远程搜索     | boolean        | false   |
| remote-method   | 远程搜索方法     | function       | —       |
| search-debounce | 搜索防抖延迟(ms) | number         | 300     |
| show-count      | 是否显示选项数量 | boolean        | false   |
| clearable       | 是否可清空       | boolean        | true    |
| placeholder     | 占位文本         | string         | 请选择  |
| size            | 尺寸             | string         | default |

### Events

| 事件名            | 说明           | 参数                |
| ----------------- | -------------- | ------------------- |
| update:modelValue | 值变化         | (value: any)        |
| change            | 选择变化       | (value: any)        |
| select-all        | 全选/取消全选  | (selected: boolean) |
| search            | 搜索关键词变化 | (query: string)     |
| clear             | 清空选项       | —                   |

### SelectOption 类型

```typescript
interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
  [key: string]: any
}
```
