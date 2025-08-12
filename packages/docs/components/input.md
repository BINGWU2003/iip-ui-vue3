# Input 输入框

基于 Element Plus Input 组件的二次封装，提供了更丰富的功能和更好的用户体验。

## 基础用法

```vue
<template>
  <iip-input v-model="value" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
</script>
```

## 主要特性

- ✅ **清空功能** - 可配置的清空按钮
- ✅ **字符计数** - 显示当前字符数和最大限制
- ✅ **输入验证** - 内置常用验证规则
- ✅ **防抖输入** - 可配置的输入防抖
- ✅ **格式处理** - 粘贴时自动处理格式

## API

### Props

| 参数            | 说明             | 类型          | 默认值  |
| --------------- | ---------------- | ------------- | ------- |
| model-value     | 绑定值           | string        | —       |
| placeholder     | 占位文本         | string        | 请输入  |
| clearable       | 是否显示清空按钮 | boolean       | true    |
| show-word-limit | 是否显示字符计数 | boolean       | false   |
| maxlength       | 最大字符数       | number/string | —       |
| validate-rule   | 验证规则         | string        | —       |
| debounce-delay  | 防抖延迟(ms)     | number        | 300     |
| size            | 尺寸             | string        | default |

### Events

| 事件名            | 说明         | 参数                                 |
| ----------------- | ------------ | ------------------------------------ |
| update:modelValue | 值变化       | (value: string)                      |
| input             | 输入时触发   | (value: string)                      |
| validate          | 验证状态变化 | (isValid: boolean, message?: string) |
| clear             | 清空时触发   | —                                    |
