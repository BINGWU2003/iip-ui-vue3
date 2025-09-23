# Utils 工具函数

IIP UI Vue3 提供了一系列实用的工具函数，包括类型检查、通用工具、数据验证、Vue 工具和 Eova 转换等功能。

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
  isBoolean, // 类型检查
  debounce,
  throttle,
  deepClone,
  copyText,
  fallbackCopyTextToClipboard, // 通用工具
  isEmail,
  isPhone,
  isIdCard, // 验证工具
  withInstall,
  createNamespace, // Vue 工具
  createRequestManager, // 请求管理
  eovaConverter // Eova 转换
} from '@bingwu/iip-ui-utils'
```

## 类型检查工具 (Types)

### 基础类型检查

```typescript
import {
  isString,
  isNumber,
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

## 数据验证工具 (Validate)

### 基础验证

```typescript
import { isEmail, isPhone, isIdCard, isUrl, isIP, getPasswordStrength } from '@bingwu/iip-ui-utils'

// 邮箱验证
console.log(isEmail('test@example.com')) // true
console.log(isEmail('user@domain.cn')) // true
console.log(isEmail('invalid-email')) // false
console.log(isEmail('test@')) // false

// 手机号验证（中国大陆）
console.log(isPhone('13812345678')) // true
console.log(isPhone('15987654321')) // true
console.log(isPhone('12345678901')) // false
console.log(isPhone('1381234567')) // false

// 身份证验证（中国大陆）
console.log(isIdCard('110101199003077777')) // true
console.log(isIdCard('12345678901234567')) // false
console.log(isIdCard('110101199003077')) // false

// URL 验证
console.log(isUrl('https://example.com')) // true
console.log(isUrl('http://localhost:3000')) // true
console.log(isUrl('ftp://files.example.com')) // true
console.log(isUrl('not-a-url')) // false

// IP 地址验证
console.log(isIP('192.168.1.1')) // true
console.log(isIP('127.0.0.1')) // true
console.log(isIP('256.1.1.1')) // false
console.log(isIP('192.168.1')) // false

// 密码强度检查
console.log(getPasswordStrength('123456')) // 0 (太短)
console.log(getPasswordStrength('12345678')) // 1 (仅数字)
console.log(getPasswordStrength('password')) // 2 (仅小写字母)
console.log(getPasswordStrength('Password')) // 3 (大小写字母)
console.log(getPasswordStrength('Password123')) // 4 (大小写字母+数字)
console.log(getPasswordStrength('Password123!')) // 4 (大小写字母+数字+特殊字符)

// 自定义最小长度
console.log(getPasswordStrength('Pass1!', 6)) // 4 (满足 6 位最小长度)
console.log(getPasswordStrength('Pass1!', 10)) // 0 (不满足 10 位最小长度)
```

### 表单验证示例

```typescript
import { isEmail, isPhone, getPasswordStrength } from '@bingwu/iip-ui-utils'

// 用户注册表单验证
interface RegisterForm {
  email: string
  phone: string
  password: string
  confirmPassword: string
}

function validateRegisterForm(form: RegisterForm) {
  const errors: string[] = []

  // 验证邮箱
  if (!form.email) {
    errors.push('邮箱不能为空')
  } else if (!isEmail(form.email)) {
    errors.push('请输入有效的邮箱地址')
  }

  // 验证手机号
  if (!form.phone) {
    errors.push('手机号不能为空')
  } else if (!isPhone(form.phone)) {
    errors.push('请输入有效的手机号')
  }

  // 验证密码
  if (!form.password) {
    errors.push('密码不能为空')
  } else {
    const strength = getPasswordStrength(form.password)
    if (strength < 3) {
      errors.push('密码强度太低，请包含大小写字母和数字')
    }
  }

  // 验证确认密码
  if (form.password !== form.confirmPassword) {
    errors.push('两次输入的密码不一致')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// 使用示例
const formData = {
  email: 'user@example.com',
  phone: '13812345678',
  password: 'MyPassword123',
  confirmPassword: 'MyPassword123'
}

const validation = validateRegisterForm(formData)
console.log(validation) // { valid: true, errors: [] }
```

## Vue 工具函数 (Vue)

### 组件安装工具

```typescript
import { withInstall, withInstallFunction } from '@bingwu/iip-ui-utils'
import type { App } from 'vue'

// 为单个组件添加 install 方法
import MyButton from './MyButton.vue'

const IipButton = withInstall(MyButton)

export default IipButton

// 在插件中使用
export function install(app: App) {
  app.use(IipButton)
}

// 为函数添加 install 方法
function showMessage(message: string) {
  console.log(message)
}

const IipMessage = withInstallFunction(showMessage, '$message')

// 安装后可以通过 this.$message() 使用
```

### 命名空间工具

```typescript
import { createNamespace } from '@bingwu/iip-ui-utils'

// 创建组件命名空间
const { n, classes } = createNamespace('button')

console.log(n()) // 'iip-button'
console.log(n('primary')) // 'iip-button__primary'
console.log(n('large')) // 'iip-button__large'

// 生成多个类名
console.log(classes('primary', 'large', 'disabled'))
// 'iip-button__primary iip-button__large iip-button__disabled'

// 在 Vue 组件中使用
export default {
  name: 'IipButton',
  setup() {
    const { n, classes } = createNamespace('button')

    const buttonClass = computed(() => {
      return classes(props.type, props.size, props.disabled && 'disabled')
    })

    return {
      buttonClass
    }
  }
}
```

```vue
<!-- 在模板中使用 -->
<template>
  <button :class="[n(), buttonClass]">
    <slot />
  </button>
</template>

<style scoped>
.iip-button {
  /* 基础样式 */
}

.iip-button__primary {
  /* 主要按钮样式 */
}

.iip-button__large {
  /* 大尺寸样式 */
}

.iip-button__disabled {
  /* 禁用状态样式 */
}
</style>
```

## 请求管理工具 (Request)

IIP UI Vue3 提供了强大的请求管理工具，专门用于解决前端开发中常见的请求竞态问题。当用户快速触发多个异步请求时，这个工具确保只处理最新请求的响应，避免数据混乱。

### 核心功能

- **请求竞态控制**：自动识别和处理过期请求
- **简单易用的API**：支持Promise和async/await两种使用方式
- **TypeScript支持**：完整的类型定义和智能提示
- **灵活的回调机制**：支持成功和过期请求的不同处理方式

### 基础使用

```typescript
import { createRequestManager } from '@bingwu/iip-ui-utils'

// 创建请求管理器实例
const requestManager = createRequestManager()

// 使用 managedRequest 方法
const searchUsers = async (keyword: string) => {
  return requestManager.managedRequest(
    // 异步请求函数
    async requestId => {
      console.log(`执行搜索请求 ${requestId}:`, keyword)
      const response = await fetch(`/api/users?keyword=${keyword}`)
      return response.json()
    },
    // 成功回调（仅最新请求）
    data => {
      console.log('搜索结果:', data)
      // 更新UI
      userList.value = data.users
      return data
    },
    // 过期请求回调（可选）
    (data, requestId) => {
      console.log(`请求 ${requestId} 已过期，忽略结果`)
    }
  )
}

// 使用 managedFetch 方法（更简洁）
const fetchUserProfile = async (userId: string) => {
  const result = await requestManager.managedFetch(async requestId => {
    console.log(`获取用户资料 ${requestId}:`, userId)
    const response = await fetch(`/api/users/${userId}`)
    return response.json()
  })

  // 检查是否是最新请求的结果
  if (result.isLatest) {
    console.log('用户资料:', result.data)
    userProfile.value = result.data
  } else {
    console.log('忽略过期请求结果')
  }

  return result
}
```

### 在Vue组件中的应用

#### 搜索组件示例

```vue
<template>
  <div class="search-component">
    <el-input v-model="searchKeyword" @input="handleSearch" placeholder="搜索用户..." clearable />

    <div v-loading="loading" class="search-results">
      <div v-for="user in users" :key="user.id" class="user-item">
        <span>{{ user.name }}</span>
        <span>{{ user.email }}</span>
      </div>

      <div v-if="users.length === 0 && !loading" class="no-data">暂无搜索结果</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { createRequestManager, debounce } from '@bingwu/iip-ui-utils'

// 响应式数据
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

  try {
    const result = await requestManager.managedRequest(
      async requestId => {
        // 模拟API请求
        console.log(`执行搜索请求 ${requestId}:`, keyword)
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(keyword)}`)
        if (!response.ok) throw new Error('搜索失败')
        return response.json()
      },
      // 成功回调 - 只有最新请求会执行
      data => {
        users.value = data.users || []
        loading.value = false
        console.log(`搜索完成，找到 ${users.value.length} 个用户`)
        return data
      },
      // 过期请求回调
      (data, requestId) => {
        console.log(`搜索请求 ${requestId} 已过期，忽略结果`)
        loading.value = false
      }
    )
  } catch (error) {
    console.error('搜索出错:', error)
    users.value = []
    loading.value = false
  }
}

// 防抖搜索
const debouncedSearch = debounce(searchUsers, 300)

// 监听搜索关键词变化
watch(searchKeyword, newKeyword => {
  debouncedSearch(newKeyword)
})
</script>
```

#### 数据详情组件示例

```vue
<template>
  <div class="user-detail">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="基本信息" name="basic">
        <div v-loading="loading.basic">
          <div v-if="userInfo">
            <p>姓名: {{ userInfo.name }}</p>
            <p>邮箱: {{ userInfo.email }}</p>
            <p>电话: {{ userInfo.phone }}</p>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="订单历史" name="orders">
        <div v-loading="loading.orders">
          <div v-for="order in orders" :key="order.id" class="order-item">
            <span>订单号: {{ order.orderNo }}</span>
            <span>金额: ¥{{ order.amount }}</span>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="操作日志" name="logs">
        <div v-loading="loading.logs">
          <div v-for="log in logs" :key="log.id" class="log-item">
            <span>{{ log.action }}</span>
            <span>{{ log.createTime }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { createRequestManager } from '@bingwu/iip-ui-utils'

interface Props {
  userId: string
}

const props = defineProps<Props>()

// 响应式数据
const activeTab = ref('basic')
const userInfo = ref(null)
const orders = ref([])
const logs = ref([])

const loading = reactive({
  basic: false,
  orders: false,
  logs: false
})

// 为每个数据类型创建独立的请求管理器
const basicInfoManager = createRequestManager()
const ordersManager = createRequestManager()
const logsManager = createRequestManager()

// 获取用户基本信息
const fetchUserInfo = async () => {
  loading.basic = true

  try {
    const result = await basicInfoManager.managedFetch(async requestId => {
      console.log(`获取用户基本信息 ${requestId}`)
      const response = await fetch(`/api/users/${props.userId}`)
      return response.json()
    })

    if (result.isLatest) {
      userInfo.value = result.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loading.basic = false
  }
}

// 获取用户订单
const fetchUserOrders = async () => {
  loading.orders = true

  try {
    await ordersManager.managedRequest(
      async requestId => {
        console.log(`获取用户订单 ${requestId}`)
        const response = await fetch(`/api/users/${props.userId}/orders`)
        return response.json()
      },
      data => {
        orders.value = data.orders || []
        loading.orders = false
      },
      () => {
        loading.orders = false
      }
    )
  } catch (error) {
    console.error('获取订单失败:', error)
    loading.orders = false
  }
}

// 获取操作日志
const fetchUserLogs = async () => {
  loading.logs = true

  try {
    await logsManager.managedRequest(
      async requestId => {
        console.log(`获取操作日志 ${requestId}`)
        const response = await fetch(`/api/users/${props.userId}/logs`)
        return response.json()
      },
      data => {
        logs.value = data.logs || []
        loading.logs = false
      },
      () => {
        loading.logs = false
      }
    )
  } catch (error) {
    console.error('获取日志失败:', error)
    loading.logs = false
  }
}

// Tab切换处理
const handleTabChange = (tabName: string) => {
  switch (tabName) {
    case 'basic':
      if (!userInfo.value) fetchUserInfo()
      break
    case 'orders':
      if (orders.value.length === 0) fetchUserOrders()
      break
    case 'logs':
      if (logs.value.length === 0) fetchUserLogs()
      break
  }
}

// 组件挂载时获取基本信息
onMounted(() => {
  fetchUserInfo()
})
</script>
```

### 高级用法

#### 自定义请求标识

```typescript
import { createRequestManager } from '@bingwu/iip-ui-utils'

const requestManager = createRequestManager()

// 手动创建请求标识
const { requestId, isLatestRequest } = requestManager.createRequest()

// 在复杂的异步流程中使用
const complexAsyncProcess = async () => {
  const { requestId, isLatestRequest } = requestManager.createRequest()

  try {
    // 第一步：获取用户信息
    const userResponse = await fetch(`/api/users/${userId}`)
    const userData = await userResponse.json()

    // 检查请求是否仍然有效
    if (!isLatestRequest()) {
      console.log(`请求 ${requestId} 已过期，终止流程`)
      return
    }

    // 第二步：根据用户信息获取相关数据
    const detailResponse = await fetch(`/api/users/${userData.id}/details`)
    const detailData = await detailResponse.json()

    // 再次检查请求有效性
    if (!isLatestRequest()) {
      console.log(`请求 ${requestId} 已过期，终止流程`)
      return
    }

    // 更新UI
    updateUserDetails(userData, detailData)
  } catch (error) {
    if (isLatestRequest()) {
      console.error('请求失败:', error)
      handleError(error)
    }
  }
}
```

#### 获取当前请求ID

```typescript
const requestManager = createRequestManager()

// 获取当前最新的请求ID
const currentId = requestManager.getCurrentId()
console.log('当前请求ID:', currentId)

// 在调试时很有用
const debugSearch = async (keyword: string) => {
  console.log('开始搜索，当前ID:', requestManager.getCurrentId())

  const result = await requestManager.managedFetch(async requestId => {
    console.log(`执行请求 ${requestId}，期望ID: ${requestManager.getCurrentId()}`)
    // ... 执行请求
  })

  console.log('搜索完成，最终ID:', requestManager.getCurrentId())
  return result
}
```

### 实际应用场景

#### 1. 快速搜索场景

```typescript
// 用户快速输入搜索关键词时，只处理最新的搜索结果
const handleQuickSearch = debounce(async (keyword: string) => {
  await requestManager.managedRequest(
    async requestId => {
      return searchAPI(keyword)
    },
    results => {
      // 只有最新搜索的结果会更新UI
      searchResults.value = results
    }
  )
}, 200)
```

#### 2. 标签页切换场景

```typescript
// 用户快速切换标签页时，只显示当前标签页的数据
const switchTab = async (tabId: string) => {
  currentTab.value = tabId

  await requestManager.managedRequest(
    async requestId => {
      return fetchTabData(tabId)
    },
    data => {
      // 只有当前标签页的数据会被显示
      if (currentTab.value === tabId) {
        tabData.value = data
      }
    }
  )
}
```

#### 3. 分页数据加载场景

```typescript
// 用户快速点击分页按钮时，只显示最新页的数据
const loadPage = async (page: number) => {
  currentPage.value = page

  await requestManager.managedRequest(
    async requestId => {
      return fetchPageData(page)
    },
    data => {
      // 只有最新页的数据会被显示
      tableData.value = data.items
      total.value = data.total
    }
  )
}
```

### 错误处理

```typescript
const requestManager = createRequestManager()

const fetchDataWithErrorHandling = async () => {
  try {
    const result = await requestManager.managedFetch(async requestId => {
      const response = await fetch('/api/data')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return response.json()
    })

    if (result.isLatest) {
      // 处理成功结果
      console.log('数据获取成功:', result.data)
    }
  } catch (error) {
    // 只有最新请求的错误才会被抛出
    console.error('请求失败:', error)
    ElMessage.error('数据加载失败，请重试')
  }
}
```

### 性能优化建议

1. **合理使用请求管理器实例**

   ```typescript
   // ✅ 推荐：为不同的数据类型创建独立的管理器
   const userManager = createRequestManager()
   const orderManager = createRequestManager()

   // ❌ 不推荐：所有请求共用一个管理器
   const globalManager = createRequestManager()
   ```

2. **结合防抖使用**

   ```typescript
   // ✅ 推荐：结合防抖减少请求频率
   const debouncedSearch = debounce(async keyword => {
     await requestManager.managedRequest(/* ... */)
   }, 300)

   // ❌ 不推荐：每次输入都发送请求
   const immediateSearch = async keyword => {
     await requestManager.managedRequest(/* ... */)
   }
   ```

3. **适当的错误处理**
   ```typescript
   // ✅ 推荐：区分处理不同类型的错误
   try {
     await requestManager.managedRequest(/* ... */)
   } catch (error) {
     if (error.name === 'NetworkError') {
       ElMessage.error('网络连接失败')
     } else {
       ElMessage.error('请求处理失败')
     }
   }
   ```

## Eova 转换工具

### 基础使用

```typescript
import { eovaConverter, EovaToAvueConverter } from '@bingwu/iip-ui-utils'

// 定义 Eova 字段数据
const eovaFields = [
  {
    id: 1,
    cn: '用户姓名',
    en: 'userName',
    type: '文本框',
    width: 120,
    is_show: true,
    is_order: true,
    is_required: true,
    placeholder: '请输入用户姓名'
  },
  {
    id: 2,
    cn: '用户邮箱',
    en: 'email',
    type: '文本框',
    width: 180,
    is_show: true,
    is_order: false,
    is_required: true
  },
  {
    id: 3,
    cn: '注册时间',
    en: 'createTime',
    type: '日期框',
    width: 160,
    is_show: true,
    is_order: true
  },
  {
    id: 4,
    cn: '用户状态',
    en: 'status',
    type: '下拉框',
    width: 100,
    is_show: true,
    is_order: false
  }
]

// 使用预设转换器实例
const tableColumns = eovaConverter.convertColumns(eovaFields)
console.log(tableColumns)
/*
输出:
[
  {
    field: 'userName',
    title: '用户姓名',
    width: 120,
    visible: true,
    sortable: true
  },
  {
    field: 'email',
    title: '用户邮箱',
    width: 180,
    visible: true,
    sortable: false
  },
  {
    field: 'createTime',
    title: '注册时间',
    width: 160,
    visible: true,
    sortable: true
  },
  {
    field: 'status',
    title: '用户状态',
    width: 100,
    visible: true,
    sortable: false
  }
]
*/
```

### 自定义转换器

```typescript
import { EovaToAvueConverter } from '@bingwu/iip-ui-utils'

// 创建自定义转换器
const customConverter = new EovaToAvueConverter()

// 查看默认字段类型映射
console.log(customConverter.fieldTypeMap)
/*
{
  文本框: 'input',
  文本域: 'textarea',
  数字框: 'number',
  密码框: 'password',
  日期框: 'date',
  时间框: 'datetime',
  下拉框: 'select',
  单选框: 'radio',
  复选框: 'checkbox',
  布尔框: 'switch',
  图片框: 'upload',
  文件框: 'upload',
  编辑框: 'ueditor',
  // ... 更多类型映射
}
*/

// 扩展字段类型映射
customConverter.fieldTypeMap = {
  ...customConverter.fieldTypeMap,
  自定义输入框: 'custom-input',
  地址选择器: 'address-picker',
  标签选择器: 'tag-selector'
}

// 使用自定义转换器
const customFields = [
  {
    cn: '详细地址',
    en: 'address',
    type: '地址选择器',
    width: 200,
    is_show: true,
    is_order: false
  }
]

const customColumns = customConverter.convertColumns(customFields)
console.log(customColumns)
```

### 在表格组件中使用

```vue
<template>
  <div class="user-table">
    <iip-table :data="tableData" :columns="tableColumns" :loading="loading" border stripe />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { eovaConverter, isNullOrUndefined } from '@bingwu/iip-ui-utils'

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 从后端获取的 Eova 字段配置
const eovaFields = ref([])

// 转换为表格列配置
const tableColumns = computed(() => {
  if (eovaFields.value.length === 0) return []

  const columns = eovaConverter.convertColumns(eovaFields.value)

  // 可以进一步自定义列配置
  return columns.map(col => ({
    tableColumnProps: {
      ...col,
      // 添加自定义格式化函数
      formatter: ({ cellValue, row, column }: any) => {
        if (col.field === 'createTime' && !isNullOrUndefined(cellValue)) {
          return new Date(cellValue).toLocaleDateString()
        }
        if (col.field === 'status') {
          return cellValue === 1 ? '激活' : '禁用'
        }
        return cellValue
      }
    }
  }))
})

// 获取字段配置和数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    const [fieldsResponse, dataResponse] = await Promise.all([
      fetch('/api/eova/fields'),
      fetch('/api/users')
    ])

    eovaFields.value = await fieldsResponse.json()
    tableData.value = await dataResponse.json()
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
```

## 实际应用示例

### 用户管理页面

```vue
<template>
  <div class="user-management">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchText"
        placeholder="搜索用户姓名或邮箱..."
        clearable
        style="width: 300px;"
      />
      <el-button @click="handleSearch" type="primary">搜索</el-button>
    </div>

    <!-- 用户表格 -->
    <iip-table :data="filteredUsers" :columns="userColumns" :loading="loading" border stripe>
      <!-- 操作列插槽 -->
      <template #action="{ row }">
        <el-button size="small" @click="editUser(row)">编辑</el-button>
        <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
      </template>
    </iip-table>

    <!-- 用户编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="600px">
      <el-form :model="editForm" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="editForm.userName" />
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="editForm.status">
            <el-option label="激活" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import {
  debounce,
  deepClone,
  generateId,
  isEmail,
  isPhone,
  eovaConverter
} from '@bingwu/iip-ui-utils'

// 响应式数据
const loading = ref(false)
const searchText = ref('')
const dialogVisible = ref(false)
const users = ref([])
const editForm = reactive({
  id: '',
  userName: '',
  email: '',
  phone: '',
  status: 1
})

// 表单验证规则
const formRules = {
  userName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value && !isEmail(value)) {
          callback(new Error('请输入有效的邮箱地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value && !isPhone(value)) {
          callback(new Error('请输入有效的手机号码'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 防抖搜索
const debouncedSearch = debounce(() => {
  // 执行搜索逻辑
  console.log('搜索:', searchText.value)
}, 300)

// 过滤用户数据
const filteredUsers = computed(() => {
  if (!searchText.value) return users.value

  return users.value.filter(
    (user: any) =>
      user.userName.toLowerCase().includes(searchText.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 表格列配置（使用 Eova 转换器）
const userColumns = computed(() => {
  const eovaFields = [
    {
      cn: '用户姓名',
      en: 'userName',
      type: '文本框',
      width: 120,
      is_show: true,
      is_order: true
    },
    {
      cn: '邮箱地址',
      en: 'email',
      type: '文本框',
      width: 200,
      is_show: true,
      is_order: false
    },
    {
      cn: '手机号码',
      en: 'phone',
      type: '文本框',
      width: 140,
      is_show: true,
      is_order: false
    },
    {
      cn: '注册时间',
      en: 'createTime',
      type: '日期框',
      width: 160,
      is_show: true,
      is_order: true
    },
    {
      cn: '用户状态',
      en: 'status',
      type: '下拉框',
      width: 100,
      is_show: true,
      is_order: false
    }
  ]

  const columns = eovaConverter.convertColumns(eovaFields)

  // 添加操作列
  columns.push({
    field: 'action',
    title: '操作',
    width: 150,
    visible: true,
    sortable: false
  })

  return columns.map(col => ({
    tableColumnProps: {
      ...col,
      formatter: ({ cellValue, row }: any) => {
        if (col.field === 'status') {
          return cellValue === 1 ? '激活' : '禁用'
        }
        if (col.field === 'createTime') {
          return new Date(cellValue).toLocaleString()
        }
        return cellValue
      }
    }
  }))
})

// 方法
const handleSearch = debouncedSearch

const editUser = (user: any) => {
  // 深拷贝用户数据到编辑表单
  Object.assign(editForm, deepClone(user))
  dialogVisible.value = true
}

const deleteUser = async (user: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      type: 'warning'
    })

    // 执行删除逻辑
    console.log('删除用户:', user)

    ElMessage.success('删除成功')
    await fetchUsers()
  } catch {
    // 用户取消删除
  }
}

const saveUser = async () => {
  try {
    // 表单验证
    await formRef.value.validate()

    // 保存用户数据
    console.log('保存用户:', editForm)

    dialogVisible.value = false
    ElMessage.success('保存成功')
    await fetchUsers()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    users.value = [
      {
        id: generateId('user'),
        userName: '张三',
        email: 'zhangsan@example.com',
        phone: '13812345678',
        createTime: new Date(),
        status: 1
      },
      {
        id: generateId('user'),
        userName: '李四',
        email: 'lisi@example.com',
        phone: '15987654321',
        createTime: new Date(),
        status: 0
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-area {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}
</style>
```

## API 参考

### 类型检查函数

| 函数名                   | 参数      | 返回值    | 描述                         |
| ------------------------ | --------- | --------- | ---------------------------- |
| `isString(val)`          | `unknown` | `boolean` | 检查是否为字符串             |
| `isNumber(val)`          | `unknown` | `boolean` | 检查是否为数字               |
| `isBoolean(val)`         | `unknown` | `boolean` | 检查是否为布尔值             |
| `isFunction(val)`        | `unknown` | `boolean` | 检查是否为函数               |
| `isObject(val)`          | `unknown` | `boolean` | 检查是否为对象               |
| `isArray(val)`           | `unknown` | `boolean` | 检查是否为数组               |
| `isUndefined(val)`       | `unknown` | `boolean` | 检查是否为 undefined         |
| `isNull(val)`            | `unknown` | `boolean` | 检查是否为 null              |
| `isNullOrUndefined(val)` | `unknown` | `boolean` | 检查是否为 null 或 undefined |

### 通用工具函数

| 函数名                              | 参数                         | 返回值          | 描述                         |
| ----------------------------------- | ---------------------------- | --------------- | ---------------------------- |
| `debounce(func, wait, immediate?)`  | `Function, number, boolean?` | `Function`      | 创建防抖函数                 |
| `throttle(func, limit)`             | `Function, number`           | `Function`      | 创建节流函数                 |
| `deepClone(obj)`                    | `T`                          | `T`             | 深拷贝对象                   |
| `generateId(prefix?)`               | `string?`                    | `string`        | 生成唯一ID                   |
| `copyText(text)`                    | `string`                     | `Promise<void>` | 复制文本到剪贴板（自动兼容） |
| `fallbackCopyTextToClipboard(text)` | `string`                     | `Promise<void>` | 降级复制方法（兼容旧浏览器） |

### 验证函数

| 函数名                                      | 参数              | 返回值    | 描述             |
| ------------------------------------------- | ----------------- | --------- | ---------------- |
| `isEmail(email)`                            | `string`          | `boolean` | 验证邮箱格式     |
| `isPhone(phone)`                            | `string`          | `boolean` | 验证手机号格式   |
| `isIdCard(idCard)`                          | `string`          | `boolean` | 验证身份证格式   |
| `isUrl(url)`                                | `string`          | `boolean` | 验证URL格式      |
| `isIP(ip)`                                  | `string`          | `boolean` | 验证IP地址格式   |
| `getPasswordStrength(password, minLength?)` | `string, number?` | `number`  | 获取密码强度等级 |

### Vue 工具函数

| 函数名                          | 参数               | 返回值              | 描述                    |
| ------------------------------- | ------------------ | ------------------- | ----------------------- |
| `withInstall(component)`        | `Component`        | `SFCWithInstall<T>` | 为组件添加 install 方法 |
| `withInstallFunction(fn, name)` | `Function, string` | `Function`          | 为函数添加 install 方法 |
| `createNamespace(name)`         | `string`           | `Object`            | 创建命名空间工具        |

### 请求管理工具

| 函数名/接口                           | 参数/属性                          | 返回值                      | 描述                        |
| ------------------------------------- | ---------------------------------- | --------------------------- | --------------------------- |
| `createRequestManager()`              | 无                                 | `RequestManager`            | 创建请求管理器实例          |
| `RequestManager.createRequest()`      | 无                                 | `RequestIdentifier`         | 创建新的请求标识            |
| `RequestManager.managedRequest()`     | `asyncFn, onSuccess?, onOutdated?` | `Promise<RequestResult<T>>` | 执行受控异步请求            |
| `RequestManager.managedFetch()`       | `fetchFn`                          | `Promise<RequestResult<T>>` | 使用async/await处理请求竞态 |
| `RequestManager.getCurrentId()`       | 无                                 | `number`                    | 获取当前最新请求ID          |
| `RequestIdentifier.requestId`         | 属性                               | `number`                    | 唯一请求ID                  |
| `RequestIdentifier.isLatestRequest()` | 无                                 | `boolean`                   | 检查是否是最新请求          |
| `RequestResult.data`                  | 属性                               | `T`                         | 请求返回的数据              |
| `RequestResult.requestId`             | 属性                               | `number`                    | 请求ID                      |
| `RequestResult.isLatest`              | 属性                               | `boolean`                   | 是否是最新请求的结果        |
| `RequestResult.result`                | 属性                               | `any`                       | onSuccess回调返回值         |
| `RequestResult.error`                 | 属性                               | `Error`                     | 请求错误信息                |

### Eova 转换工具

| 类/函数名                | 方法/参数     | 返回值                   | 描述                 |
| ------------------------ | ------------- | ------------------------ | -------------------- |
| `EovaToAvueConverter`    | 构造函数      | `EovaToAvueConverter`    | 创建转换器实例       |
| `convertColumns(fields)` | `EovaField[]` | `TableColumnProps[]`     | 转换字段为表格列配置 |
| `fieldTypeMap`           | getter/setter | `Record<string, string>` | 字段类型映射         |
| `eovaConverter`          | 预设实例      | `EovaToAvueConverter`    | 默认转换器实例       |

通过这些工具函数，你可以大大简化日常开发中的常见任务，提高开发效率和代码质量。所有函数都经过 TypeScript 类型检查，提供完整的类型支持和 IDE 智能提示。
