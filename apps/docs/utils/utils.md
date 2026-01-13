# Utils 工具函数

IIP UI Vue3 提供了一系列实用的工具函数，包括类型检查、通用工具等功能。

## 安装和引入

```bash
# 安装工具包
pnpm add @bingwu/iip-ui-utils
```

```typescript
// 全量引入
import * as IipUtils from '@bingwu/iip-ui-utils'

// 按需引入
import {
  isNullOrUndefined,
  debounce,
  deepClone,
  copyText,
  createRequestManager
} from '@bingwu/iip-ui-utils'

// 分类引入
import {
  isString,
  isNumber,
  isInteger,
  isNumeric,
  isNumericInteger,
  isBoolean, // 类型检查
  debounce,
  throttle,
  deepClone,
  copyText,
  fallbackCopyTextToClipboard, // 通用工具
  createRequestManager // 请求管理
} from '@bingwu/iip-ui-utils'
```

## 类型检查工具 (Types)

### 基础类型检查

```typescript
import {
  isString,
  isNumber,
  isInteger,
  isNumeric,
  isNumericInteger,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isUndefined,
  isNull,
  isNullOrUndefined
} from '@bingwu/iip-ui-utils'

// 检查字符串
console.log(isString('hello')) // true
console.log(isString(123)) // false

// 检查数字
console.log(isNumber(123)) // true
console.log(isNumber('123')) // false

// 检查整数
console.log(isInteger(123)) // true
console.log(isInteger(3.14)) // false
console.log(isInteger('123')) // false

// 检查是否为数字（支持 number 和数字字符串）
console.log(isNumeric(123)) // true
console.log(isNumeric('123')) // true
console.log(isNumeric('123.45')) // true
console.log(isNumeric('-123')) // true
console.log(isNumeric('abc')) // false
console.log(isNumeric('')) // false
console.log(isNumeric(Infinity)) // false
console.log(isNumeric(NaN)) // false

// 检查是否为整数（支持 number 和整数字符串）
console.log(isNumericInteger(123)) // true
console.log(isNumericInteger('123')) // true
console.log(isNumericInteger('-456')) // true
console.log(isNumericInteger('123.45')) // false
console.log(isNumericInteger(3.14)) // false
console.log(isNumericInteger('abc')) // false
console.log(isNumericInteger('')) // false
console.log(isNumericInteger(Infinity)) // false
console.log(isNumericInteger(NaN)) // false

// 检查布尔值
console.log(isBoolean(true)) // true
console.log(isBoolean(1)) // false

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

// 检查 undefined
console.log(isUndefined(undefined)) // true
console.log(isUndefined(null)) // false

// 检查 null
console.log(isNull(null)) // true
console.log(isNull(undefined)) // false

// 检查 null 或 undefined
console.log(isNullOrUndefined(null)) // true
console.log(isNullOrUndefined(undefined)) // true
console.log(isNullOrUndefined('')) // false
```

## 通用工具函数 (Common)

### 防抖和节流

```typescript
import { debounce, throttle } from '@bingwu/iip-ui-utils'

// 防抖函数 - 延迟执行，如果在延迟期间再次调用则重新计时
const debouncedSave = debounce((data: any) => {
  console.log('保存数据:', data)
}, 500)

// 使用防抖
debouncedSave({ name: 'test1' })
debouncedSave({ name: 'test2' }) // 会取消上一次的调用
// 只有最后一次调用会在 500ms 后执行

// 立即执行的防抖（第一次立即执行，后续防抖）
const immediateDebounced = debounce(
  (data: any) => {
    console.log('立即执行:', data)
  },
  500,
  true
)

// 节流函数 - 限制执行频率
const throttledScroll = throttle(() => {
  console.log('滚动事件')
}, 100)

window.addEventListener('scroll', throttledScroll)
```

### 深拷贝

```typescript
import { deepClone } from '@bingwu/iip-ui-utils'

const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Beijing',
    street: 'Main St'
  },
  hobbies: ['reading', 'coding'],
  createdAt: new Date()
}

// 深拷贝对象
const cloned = deepClone(original)
cloned.address.city = 'Shanghai'
cloned.hobbies.push('swimming')

console.log(original.address.city) // 'Beijing' (原对象不受影响)
console.log(original.hobbies) // ['reading', 'coding'] (原数组不受影响)
console.log(cloned.address.city) // 'Shanghai'
console.log(cloned.hobbies) // ['reading', 'coding', 'swimming']

// 支持各种数据类型
const complexData = {
  date: new Date(),
  array: [1, { nested: true }, [2, 3]],
  nullValue: null,
  undefinedValue: undefined
}

const clonedComplex = deepClone(complexData)
console.log(clonedComplex.date instanceof Date) // true
```

### ID 生成器

```typescript
import { generateId } from '@bingwu/iip-ui-utils'

// 生成默认 ID（前缀为 'id'）
const id1 = generateId()
console.log(id1) // 'id-a1b2c3d4e'

// 生成带自定义前缀的 ID
const userId = generateId('user')
console.log(userId) // 'user-x9y8z7w6v'

const componentId = generateId('component')
console.log(componentId) // 'component-m5n4o3p2q'

// 在 Vue 组件中使用
export default {
  setup() {
    const formId = generateId('form')
    const fieldId = generateId('field')

    return {
      formId,
      fieldId
    }
  }
}
```

### 文本复制工具

```typescript
import { copyText, fallbackCopyTextToClipboard } from '@bingwu/iip-ui-utils'

// 现代浏览器复制文本（自动兼容旧浏览器）
const handleCopy = async (text: string) => {
  try {
    await copyText(text)
    console.log('复制成功')
    // 显示成功提示
    ElMessage.success('内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动复制')
  }
}

// 在按钮点击事件中使用
const copyUserInfo = async () => {
  const userInfo = `姓名: ${user.name}\n邮箱: ${user.email}\n电话: ${user.phone}`
  await handleCopy(userInfo)
}

// 复制表格数据
const copyTableData = async (rows: any[]) => {
  const csvData = rows.map(row => Object.values(row).join('\t')).join('\n')

  await handleCopy(csvData)
}

// 手动使用降级复制方法（一般不需要直接调用）
const manualFallbackCopy = async (text: string) => {
  try {
    await fallbackCopyTextToClipboard(text)
    console.log('降级复制成功')
  } catch (error) {
    console.error('降级复制失败:', error)
  }
}
```

#### 在 Vue 组件中的使用示例

```vue
<template>
  <div class="copy-demo">
    <el-card title="用户信息">
      <p>姓名: {{ userInfo.name }}</p>
      <p>邮箱: {{ userInfo.email }}</p>
      <p>电话: {{ userInfo.phone }}</p>

      <el-button @click="copyUserInfo" type="primary" icon="DocumentCopy"> 复制用户信息 </el-button>
    </el-card>

    <el-card title="代码片段" style="margin-top: 20px;">
      <pre><code>{{ codeSnippet }}</code></pre>

      <el-button @click="copyCode" type="success" icon="DocumentCopy"> 复制代码 </el-button>
    </el-card>

    <el-card title="表格数据" style="margin-top: 20px;">
      <el-table :data="tableData" border>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话" />
      </el-table>

      <el-button @click="copyTableAsCSV" type="info" icon="DocumentCopy" style="margin-top: 10px;">
        复制为 CSV 格式
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { copyText } from '@bingwu/iip-ui-utils'
import { ElMessage } from 'element-plus'

const userInfo = ref({
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13812345678'
})

const codeSnippet = ref(`
import { copyText } from '@bingwu/iip-ui-utils'

const handleCopy = async (text) => {
  try {
    await copyText(text)
    console.log('复制成功')
  } catch (error) {
    console.error('复制失败:', error)
  }
}
`)

const tableData = ref([
  { name: '张三', email: 'zhangsan@example.com', phone: '13812345678' },
  { name: '李四', email: 'lisi@example.com', phone: '15987654321' },
  { name: '王五', email: 'wangwu@example.com', phone: '18612345678' }
])

// 复制用户信息
const copyUserInfo = async () => {
  const info = `姓名: ${userInfo.value.name}\n邮箱: ${userInfo.value.email}\n电话: ${userInfo.value.phone}`

  try {
    await copyText(info)
    ElMessage.success('用户信息已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 复制代码片段
const copyCode = async () => {
  try {
    await copyText(codeSnippet.value.trim())
    ElMessage.success('代码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 复制表格数据为 CSV 格式
const copyTableAsCSV = async () => {
  // 生成 CSV 格式的表头
  const headers = ['姓名', '邮箱', '电话']
  const csvContent = [
    headers.join(','),
    ...tableData.value.map(row => [row.name, row.email, row.phone].join(','))
  ].join('\n')

  try {
    await copyText(csvContent)
    ElMessage.success('表格数据已复制为 CSV 格式')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>
```

#### 复制功能特性

- **自动兼容**：`copyText` 函数会自动检测浏览器支持情况，优先使用现代 Clipboard API，在不支持的环境下自动降级到传统方法
- **安全上下文**：现代 Clipboard API 需要在 HTTPS 环境或 localhost 下使用，函数会自动处理这种限制
- **错误处理**：提供完整的错误处理机制，包括参数验证和执行失败的情况
- **TypeScript 支持**：完整的类型定义，提供智能提示和类型检查

#### 浏览器兼容性

| 浏览器       | Clipboard API | 降级方法 (execCommand) |
| ------------ | ------------- | ---------------------- |
| Chrome 66+   | ✅            | ✅                     |
| Firefox 63+  | ✅            | ✅                     |
| Safari 13.1+ | ✅            | ✅                     |
| Edge 79+     | ✅            | ✅                     |
| IE 11        | ❌            | ✅                     |
| 移动端浏览器 | 部分支持      | ✅                     |

**注意**：

- 现代 Clipboard API 需要在安全上下文（HTTPS 或 localhost）下使用
- 降级方法 `execCommand('copy')` 虽然被标记为废弃，但仍被广泛支持
- 在某些移动端浏览器中，复制功能可能需要用户交互触发

## 请求管理工具 (Request)

用于解决前端开发中常见的请求竞态问题。当用户快速触发多个异步请求时，确保只处理最新请求的响应。

### 基础使用

```typescript
import { createRequestManager } from '@bingwu/iip-ui-utils'

// 创建请求管理器实例
const requestManager = createRequestManager()

// 方式1：async/await 写法
const { data, isLatest } = await requestManager.request(async () => {
  const response = await fetch(`/api/users?keyword=${keyword}`)
  return response.json()
})

if (isLatest) {
  userList.value = data.users
}

// 方式2：使用回调（推荐，更简洁）
await requestManager.request(
  async () => {
    const response = await fetch(`/api/users/${userId}`)
    return response.json()
  },
  {
    onSuccess: data => {
      userProfile.value = data
    },
    onError: error => {
      ElMessage.error('获取资料失败')
    },
    onFinally: () => {
      loading.value = false
    }
  }
)

// 方式3：then/catch 写法
requestManager
  .request(() => fetch('/api/data').then(r => r.json()))
  .then(({ data, isLatest }) => {
    if (isLatest) {
      tableData.value = data
    }
  })
  .catch(error => console.error('加载失败:', error))
  .finally(() => (loading.value = false))
```

### Vue 组件示例

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { createRequestManager, debounce } from '@bingwu/iip-ui-utils'

const searchKeyword = ref('')
const users = ref([])
const loading = ref(false)

// 创建请求管理器
const requestManager = createRequestManager()

// 搜索用户函数
const searchUsers = async (keyword: string) => {
  if (!keyword.trim()) {
    users.value = []
    return
  }

  loading.value = true

  await requestManager.request(
    async () => {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(keyword)}`)
      if (!response.ok) throw new Error('搜索失败')
      return response.json()
    },
    {
      onSuccess: data => {
        users.value = data.users || []
      },
      onError: error => {
        console.error('搜索出错:', error)
        users.value = []
      },
      onFinally: () => {
        loading.value = false
      }
    }
  )
}

// 防抖搜索
const debouncedSearch = debounce(searchUsers, 300)

// 监听搜索关键词变化
watch(searchKeyword, newKeyword => {
  debouncedSearch(newKeyword)
})
</script>
```

### 注意事项

```typescript
// ✅ 推荐：为不同的数据类型创建独立的管理器
const userManager = createRequestManager()
const orderManager = createRequestManager()

// ✅ 推荐：结合防抖减少请求频率
const debouncedSearch = debounce(async keyword => {
  await requestManager.request(/* ... */)
}, 300)
```

## API 参考

### 类型检查函数

| 函数名                   | 参数      | 返回值    | 描述                                       |
| ------------------------ | --------- | --------- | ------------------------------------------ |
| `isString(val)`          | `unknown` | `boolean` | 检查是否为字符串                           |
| `isNumber(val)`          | `unknown` | `boolean` | 检查是否为数字                             |
| `isInteger(val)`         | `unknown` | `boolean` | 检查是否为整数                             |
| `isNumeric(val)`         | `unknown` | `boolean` | 检查是否为数字（支持 number 和数字字符串） |
| `isNumericInteger(val)`  | `unknown` | `boolean` | 检查是否为整数（支持 number 和整数字符串） |
| `isBoolean(val)`         | `unknown` | `boolean` | 检查是否为布尔值                           |
| `isFunction(val)`        | `unknown` | `boolean` | 检查是否为函数                             |
| `isObject(val)`          | `unknown` | `boolean` | 检查是否为对象                             |
| `isArray(val)`           | `unknown` | `boolean` | 检查是否为数组                             |
| `isUndefined(val)`       | `unknown` | `boolean` | 检查是否为 undefined                       |
| `isNull(val)`            | `unknown` | `boolean` | 检查是否为 null                            |
| `isNullOrUndefined(val)` | `unknown` | `boolean` | 检查是否为 null 或 undefined               |

### 通用工具函数

| 函数名                              | 参数                         | 返回值          | 描述                         |
| ----------------------------------- | ---------------------------- | --------------- | ---------------------------- |
| `debounce(func, wait, immediate?)`  | `Function, number, boolean?` | `Function`      | 创建防抖函数                 |
| `throttle(func, limit)`             | `Function, number`           | `Function`      | 创建节流函数                 |
| `deepClone(obj)`                    | `T`                          | `T`             | 深拷贝对象                   |
| `generateId(prefix?)`               | `string?`                    | `string`        | 生成唯一ID                   |
| `copyText(text)`                    | `string`                     | `Promise<void>` | 复制文本到剪贴板（自动兼容） |
| `fallbackCopyTextToClipboard(text)` | `string`                     | `Promise<void>` | 降级复制方法（兼容旧浏览器） |

### 请求管理工具

| 函数名/接口                           | 参数/属性           | 返回值                          | 描述                           |
| ------------------------------------- | ------------------- | ------------------------------- | ------------------------------ |
| `createRequestManager()`              | 无                  | `RequestManager`                | 创建请求管理器实例             |
| `RequestManager.createRequest()`      | 无                  | `RequestIdentifier`             | 创建新的请求标识               |
| `RequestManager.request()`            | `asyncFn, options?` | `Promise<RequestResult<T>>`     | 执行受控异步请求，支持多种回调 |
| `RequestManager.getCurrentId()`       | 无                  | `number`                        | 获取当前最新请求ID             |
| `RequestIdentifier.requestId`         | 属性                | `number`                        | 唯一请求ID                     |
| `RequestIdentifier.isLatestRequest()` | 无                  | `boolean`                       | 检查是否是最新请求             |
| `RequestResult.data`                  | 属性                | `T`                             | 请求返回的数据                 |
| `RequestResult.requestId`             | 属性                | `number`                        | 请求ID                         |
| `RequestResult.isLatest`              | 属性                | `boolean`                       | 是否是最新请求的结果           |
| `RequestResult.result`                | 属性                | `any`                           | onSuccess回调返回值            |
| `RequestResult.error`                 | 属性                | `Error`                         | 请求错误信息                   |
| `RequestOptions.onSuccess`            | 回调                | `(data: T) => R`                | 成功回调，仅当是最新请求时调用 |
| `RequestOptions.onError`              | 回调                | `(error: Error) => void`        | 错误回调，仅当是最新请求时调用 |
| `RequestOptions.onOutdated`           | 回调                | `(data: T, id: number) => void` | 过期请求回调                   |
| `RequestOptions.onFinally`            | 回调                | `() => void`                    | 无论成功失败都会执行的回调     |

通过这些工具函数，你可以大大简化日常开发中的常见任务，提高开发效率和代码质量。所有函数都经过 TypeScript 类型检查，提供完整的类型支持和 IDE 智能提示。
