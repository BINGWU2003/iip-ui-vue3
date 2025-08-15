# Utils 工具函数

IIP UI Vue3 提供了一系列实用的工具函数，包括通用工具、DOM 操作、主题管理、数据验证等功能。

## 安装和引入

```bash
# 安装工具包
pnpm add @bingwu/iip-ui-utils
```

```typescript
// 全量引入
import * as IipUtils from '@bingwu/iip-ui-utils'

// 按需引入
import { isNullOrUndefined, formatDate, debounce } from '@bingwu/iip-ui-utils'

// 分类引入
import { dom, theme, validate } from '@bingwu/iip-ui-utils'
```

## 通用工具 (Common)

### 类型检查

```typescript
import {
  isNullOrUndefined,
  isFunction,
  isObject,
  isArray,
  isString,
  isNumber,
  isBoolean,
  isEmpty
} from '@bingwu/iip-ui-utils'

// 检查是否为 null 或 undefined
console.log(isNullOrUndefined(null)) // true
console.log(isNullOrUndefined(undefined)) // true
console.log(isNullOrUndefined('')) // false

// 检查函数
console.log(isFunction(() => {})) // true
console.log(isFunction('string')) // false

// 检查对象
console.log(isObject({})) // true
console.log(isObject([])) // false
console.log(isObject(null)) // false

// 检查数组
console.log(isArray([])) // true
console.log(isArray({})) // false

// 检查字符串
console.log(isString('hello')) // true
console.log(isString(123)) // false

// 检查数字
console.log(isNumber(123)) // true
console.log(isNumber('123')) // false

// 检查布尔值
console.log(isBoolean(true)) // true
console.log(isBoolean(1)) // false

// 检查是否为空
console.log(isEmpty('')) // true
console.log(isEmpty([])) // true
console.log(isEmpty({})) // true
console.log(isEmpty(null)) // true
console.log(isEmpty(undefined)) // true
console.log(isEmpty('hello')) // false
```

### 函数工具

```typescript
import { debounce, throttle, once } from '@bingwu/iip-ui-utils'

// 防抖函数
const debouncedSave = debounce((data: any) => {
  console.log('保存数据:', data)
}, 500)

// 使用防抖
debouncedSave({ name: 'test' })

// 节流函数
const throttledScroll = throttle(() => {
  console.log('滚动事件')
}, 100)

window.addEventListener('scroll', throttledScroll)

// 只执行一次的函数
const initOnce = once(() => {
  console.log('初始化完成')
})

initOnce() // 执行
initOnce() // 不会执行
```

### 对象工具

```typescript
import { deepClone, deepMerge, pick, omit } from '@bingwu/iip-ui-utils'

const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Beijing',
    street: 'Main St'
  },
  hobbies: ['reading', 'coding']
}

// 深拷贝
const cloned = deepClone(original)
cloned.address.city = 'Shanghai'
console.log(original.address.city) // 'Beijing' (原对象不受影响)

// 深度合并
const updates = {
  age: 31,
  address: {
    zipCode: '100000'
  }
}
const merged = deepMerge(original, updates)
console.log(merged.address) // { city: 'Beijing', street: 'Main St', zipCode: '100000' }

// 选择指定属性
const picked = pick(original, ['name', 'age'])
console.log(picked) // { name: 'John', age: 30 }

// 排除指定属性
const omitted = omit(original, ['address', 'hobbies'])
console.log(omitted) // { name: 'John', age: 30 }
```

### 数组工具

```typescript
import { unique, groupBy, chunk, flatten } from '@bingwu/iip-ui-utils'

// 数组去重
const numbers = [1, 2, 2, 3, 3, 4]
console.log(unique(numbers)) // [1, 2, 3, 4]

// 对象数组去重
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John' }
]
console.log(unique(users, 'id')) // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

// 数组分组
const grouped = groupBy(users, 'name')
console.log(grouped) // { 'John': [...], 'Jane': [...] }

// 数组分块
const chunked = chunk([1, 2, 3, 4, 5, 6], 2)
console.log(chunked) // [[1, 2], [3, 4], [5, 6]]

// 数组扁平化
const nested = [[1, 2], [3, [4, 5]], 6]
console.log(flatten(nested)) // [1, 2, 3, 4, 5, 6]
```

### 字符串工具

```typescript
import {
  camelCase,
  kebabCase,
  pascalCase,
  snakeCase,
  capitalize,
  truncate
} from '@bingwu/iip-ui-utils'

const text = 'hello-world_example'

// 转换命名格式
console.log(camelCase(text)) // 'helloWorldExample'
console.log(kebabCase(text)) // 'hello-world-example'
console.log(pascalCase(text)) // 'HelloWorldExample'
console.log(snakeCase(text)) // 'hello_world_example'

// 首字母大写
console.log(capitalize('hello')) // 'Hello'

// 文本截断
console.log(truncate('这是一段很长的文本内容', 10)) // '这是一段很长的文...'
console.log(truncate('这是一段很长的文本内容', 10, '***')) // '这是一段很长的文***'
```

### 日期工具

```typescript
import { formatDate, parseDate, addDays, diffDays } from '@bingwu/iip-ui-utils'

const now = new Date()

// 格式化日期
console.log(formatDate(now, 'YYYY-MM-DD')) // '2024-12-17'
console.log(formatDate(now, 'YYYY年MM月DD日')) // '2024年12月17日'
console.log(formatDate(now, 'HH:mm:ss')) // '14:30:25'
console.log(formatDate(now, 'YYYY-MM-DD HH:mm:ss')) // '2024-12-17 14:30:25'

// 解析日期
const parsed = parseDate('2024-12-17', 'YYYY-MM-DD')
console.log(parsed) // Date 对象

// 日期计算
const tomorrow = addDays(now, 1)
const lastWeek = addDays(now, -7)

// 日期差值
const diff = diffDays(tomorrow, now)
console.log(diff) // 1
```

## DOM 操作工具

```typescript
import { dom } from '@bingwu/iip-ui-utils'

// 元素选择
const element = dom.querySelector('#my-element')
const elements = dom.querySelectorAll('.my-class')

// 类名操作
dom.addClass(element, 'active')
dom.removeClass(element, 'inactive')
dom.toggleClass(element, 'visible')
console.log(dom.hasClass(element, 'active')) // true

// 样式操作
dom.setStyle(element, 'color', 'red')
dom.setStyle(element, {
  backgroundColor: 'blue',
  fontSize: '16px'
})
const color = dom.getStyle(element, 'color')

// 属性操作
dom.setAttribute(element, 'data-id', '123')
const dataId = dom.getAttribute(element, 'data-id')
dom.removeAttribute(element, 'data-temp')

// 事件操作
const handler = (e: Event) => console.log('clicked')
dom.addEventListener(element, 'click', handler)
dom.removeEventListener(element, 'click', handler)

// 元素尺寸和位置
const rect = dom.getBoundingClientRect(element)
const offset = dom.getOffset(element)
const scrollTop = dom.getScrollTop()
const scrollLeft = dom.getScrollLeft()

// 滚动操作
dom.scrollTo(0, 100)
dom.scrollToTop()
dom.scrollIntoView(element)
```

## 主题工具

```typescript
import { theme } from '@bingwu/iip-ui-utils'

// 主题检测
console.log(theme.isDark()) // 检查是否为暗色主题
console.log(theme.isLight()) // 检查是否为亮色主题

// 主题切换
theme.setTheme('dark') // 设置暗色主题
theme.setTheme('light') // 设置亮色主题
theme.toggleTheme() // 切换主题

// 系统主题检测
console.log(theme.getSystemTheme()) // 'light' | 'dark'

// 监听系统主题变化
theme.watchSystemTheme(newTheme => {
  console.log('系统主题变化:', newTheme)
})

// CSS 变量操作
theme.setCSSVar('--primary-color', '#409eff')
const primaryColor = theme.getCSSVar('--primary-color')

// 批量设置 CSS 变量
theme.setCSSVars({
  '--primary-color': '#409eff',
  '--success-color': '#67c23a',
  '--warning-color': '#e6a23c'
})
```

## 数据验证工具

```typescript
import { validate } from '@bingwu/iip-ui-utils'

// 邮箱验证
console.log(validate.email('test@example.com')) // true
console.log(validate.email('invalid-email')) // false

// 手机号验证
console.log(validate.phone('13812345678')) // true
console.log(validate.phone('123')) // false

// 身份证验证
console.log(validate.idCard('110101199003077777')) // true

// URL 验证
console.log(validate.url('https://example.com')) // true
console.log(validate.url('not-a-url')) // false

// 密码强度验证
const passwordResult = validate.password('MyPassword123!')
console.log(passwordResult) // { valid: true, strength: 'strong', issues: [] }

// 自定义验证规则
const customValidator = validate.createValidator({
  required: (value: any) => value != null && value !== '',
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max
})

const result = customValidator.validate('hello', ['required', ['minLength', 3], ['maxLength', 10]])
console.log(result) // { valid: true, errors: [] }
```

## Vue 组合式函数工具

```typescript
import {
  useDebounce,
  useThrottle,
  useLocalStorage,
  useClipboard,
  useEventListener
} from '@bingwu/iip-ui-utils'

export default {
  setup() {
    // 防抖响应式值
    const searchText = ref('')
    const debouncedSearch = useDebounce(searchText, 500)

    watch(debouncedSearch, value => {
      console.log('执行搜索:', value)
    })

    // 节流函数
    const { throttledFn } = useThrottle(() => {
      console.log('节流函数执行')
    }, 1000)

    // 本地存储
    const { value: settings, setValue: setSettings } = useLocalStorage('app-settings', {
      theme: 'light',
      language: 'zh-CN'
    })

    // 剪贴板操作
    const { copy, copied } = useClipboard()

    const copyText = async () => {
      await copy('要复制的文本')
      console.log('复制成功:', copied.value)
    }

    // 事件监听
    useEventListener(window, 'resize', () => {
      console.log('窗口大小改变')
    })

    return {
      searchText,
      debouncedSearch,
      throttledFn,
      settings,
      setSettings,
      copyText,
      copied
    }
  }
}
```

## Eova 转换工具

```typescript
import { eovaConverter, EovaToAvueConverter } from '@bingwu/iip-ui-utils'

// 使用预设实例
const eovaFields = [
  {
    cn: '姓名',
    en: 'name',
    type: '文本框',
    width: 120,
    is_show: true,
    is_order: true
  }
]

const columns = eovaConverter.convertColumns(eovaFields)
console.log(columns)

// 创建自定义转换器
const customConverter = new EovaToAvueConverter()

// 自定义字段类型映射
customConverter.fieldTypeMap = {
  ...customConverter.fieldTypeMap,
  自定义字段: 'custom-input'
}

const customColumns = customConverter.convertColumns(eovaFields)
```

## 工具函数在组件中的使用

### 表格数据处理

```vue
<template>
  <div>
    <el-input v-model="searchText" placeholder="搜索用户..." clearable />

    <iip-table :data="filteredData" :columns="columns" :loading="loading" border stripe />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { debounce, formatDate, deepClone, groupBy, useDebounce } from '@bingwu/iip-ui-utils'

// 原始数据
const originalData = ref([
  { id: 1, name: '张三', createTime: new Date(), status: 'active' },
  { id: 2, name: '李四', createTime: new Date(), status: 'inactive' }
])

// 搜索
const searchText = ref('')
const debouncedSearch = useDebounce(searchText, 300)

// 过滤数据
const filteredData = computed(() => {
  if (!debouncedSearch.value) return originalData.value

  return originalData.value.filter(item =>
    item.name.toLowerCase().includes(debouncedSearch.value.toLowerCase())
  )
})

// 表格列配置
const columns = computed(() => [
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  {
    tableColumnProps: {
      field: 'createTime',
      title: '创建时间',
      width: 160,
      formatter: ({ cellValue }: any) => formatDate(cellValue, 'YYYY-MM-DD HH:mm')
    }
  },
  { tableColumnProps: { field: 'status', title: '状态', width: 100 } }
])

const loading = ref(false)

// 数据处理函数
const processData = debounce(async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 深拷贝数据避免直接修改
    const processedData = deepClone(originalData.value)

    // 按状态分组
    const groupedData = groupBy(processedData, 'status')
    console.log('分组数据:', groupedData)
  } finally {
    loading.value = false
  }
}, 500)
</script>
```

### 主题管理

```vue
<template>
  <div class="theme-manager">
    <div class="current-theme">当前主题: {{ currentTheme }}</div>

    <div class="theme-actions">
      <button @click="toggleTheme">切换主题</button>
      <button @click="followSystem">跟随系统</button>
      <button @click="customizeTheme">自定义主题</button>
    </div>

    <div class="theme-vars" v-if="showCustomize">
      <h4>自定义主题变量</h4>
      <div class="var-item" v-for="(value, key) in themeVars" :key="key">
        <label>{{ key }}:</label>
        <input type="color" v-model="themeVars[key]" @change="applyCustomVars" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { theme, useLocalStorage } from '@bingwu/iip-ui-utils'

const currentTheme = ref<'light' | 'dark'>('light')
const showCustomize = ref(false)

// 持久化主题设置
const { value: savedTheme, setValue: saveTheme } = useLocalStorage('user-theme', 'light')

// 自定义主题变量
const themeVars = ref({
  '--iip-color-primary': '#409eff',
  '--iip-color-success': '#67c23a',
  '--iip-color-warning': '#e6a23c',
  '--iip-color-danger': '#f56c6c'
})

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  theme.setTheme(currentTheme.value)
  saveTheme(currentTheme.value)
}

const followSystem = () => {
  const systemTheme = theme.getSystemTheme()
  currentTheme.value = systemTheme
  theme.setTheme(systemTheme)

  // 监听系统主题变化
  theme.watchSystemTheme(newTheme => {
    currentTheme.value = newTheme
    theme.setTheme(newTheme)
  })
}

const customizeTheme = () => {
  showCustomize.value = !showCustomize.value
}

const applyCustomVars = () => {
  theme.setCSSVars(themeVars.value)
}

onMounted(() => {
  currentTheme.value = savedTheme.value
  theme.setTheme(currentTheme.value)
})
</script>

<style scoped>
.theme-manager {
  padding: 20px;
  border: 1px solid var(--iip-border-color);
  border-radius: 8px;
}

.current-theme {
  margin-bottom: 16px;
  font-weight: 500;
}

.theme-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.theme-vars {
  padding: 16px;
  background: var(--iip-fill-color-light);
  border-radius: 4px;
}

.var-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.var-item label {
  min-width: 200px;
  font-size: 14px;
}
</style>
```

## 类型定义

```typescript
// 工具函数的 TypeScript 类型定义

// 通用类型
export type Nullable<T> = T | null | undefined
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 防抖函数类型
export interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
}

export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void
  cancel(): void
  flush(): ReturnType<T>
}

// 主题相关类型
export type Theme = 'light' | 'dark'
export type ThemeVars = Record<string, string>

// 验证结果类型
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

// Eova 字段类型
export interface EovaField {
  cn: string
  en: string
  type: string
  width?: number
  is_show?: boolean
  is_order?: boolean
  [key: string]: any
}
```

通过这些工具函数，你可以大大简化日常开发中的常见任务，提高开发效率和代码质量。
