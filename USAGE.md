# IIP UI Vue3 使用指南

## 📦 安装

### 使用 npm

```bash
npm install @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

### 使用 yarn

```bash
yarn add @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

### 使用 pnpm

```bash
pnpm add @bingwu/iip-ui-components @bingwu/iip-ui-theme
```

## 🚀 快速开始

### 完整引入

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import IipUI from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(IipUI)
app.mount('#app')
```

### 按需引入

```typescript
// main.ts
import { createApp } from 'vue'
import {
  IipInput,
  IipSelect,
  IipTable,
  IipThemeProvider,
  IipThemeSwitcher
} from '@bingwu/iip-ui-components'
import '@bingwu/iip-ui-theme/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.component('IipInput', IipInput)
app.component('IipSelect', IipSelect)
app.component('IipTable', IipTable)
app.component('IipThemeProvider', IipThemeProvider)
app.component('IipThemeSwitcher', IipThemeSwitcher)
app.mount('#app')
```

## 🎨 主题使用

### 基础主题切换

```vue
<template>
  <div>
    <!-- 主题提供者 -->
    <iip-theme-provider :theme="themeConfig">
      <!-- 主题切换器 -->
      <iip-theme-switcher v-model="currentTheme" type="button" show-text />

      <!-- 你的应用内容 -->
      <div class="app-content">
        <iip-input v-model="inputValue" placeholder="输入内容" />
        <iip-select v-model="selectValue" :options="options" />
      </div>
    </iip-theme-provider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentTheme = ref('light')
const inputValue = ref('')
const selectValue = ref('')

const themeConfig = {
  mode: currentTheme.value,
  primaryColor: '#409eff',
  namespace: 'my-app'
}

const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' }
]
</script>
```

### 编程式主题控制

```typescript
import { setTheme, toggleTheme, themeManager } from '@bingwu/iip-ui-utils'

// 设置主题
setTheme({
  mode: 'dark',
  primaryColor: '#409eff',
  namespace: 'my-app'
})

// 切换主题
toggleTheme()

// 监听主题变化
themeManager.watchTheme(theme => {
  console.log('主题已切换到:', theme.mode)
})

// 监听系统主题变化
themeManager.watchSystemTheme(isDark => {
  console.log('系统主题:', isDark ? '暗色' : '亮色')
})
```

## 📋 组件使用示例

### IipInput 输入框

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <iip-input v-model="value1" placeholder="请输入内容" />

    <!-- 带清空功能 -->
    <iip-input v-model="value2" placeholder="可清空" clearable />

    <!-- 字符计数 -->
    <iip-input v-model="value3" placeholder="最多20个字符" :maxlength="20" show-word-limit />

    <!-- 内置验证 -->
    <iip-input
      v-model="email"
      placeholder="请输入邮箱"
      validate-rule="email"
      show-validate-message
    />

    <!-- 防抖输入 -->
    <iip-input v-model="value4" placeholder="防抖输入" :debounce="500" @input="handleInput" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
const email = ref('')
const value4 = ref('')

const handleInput = (value: string) => {
  console.log('输入值:', value)
}
</script>
```

### IipSelect 选择器

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <iip-select v-model="value1" :options="options" placeholder="请选择" />

    <!-- 多选 -->
    <iip-select v-model="value2" :options="options" multiple placeholder="多选" />

    <!-- 带全选功能 -->
    <iip-select
      v-model="value3"
      :options="options"
      multiple
      show-select-all
      placeholder="支持全选"
    />

    <!-- 可搜索 -->
    <iip-select v-model="value4" :options="options" filterable placeholder="可搜索" />

    <!-- 远程搜索 -->
    <iip-select
      v-model="value5"
      :options="remoteOptions"
      filterable
      remote
      :remote-method="handleRemoteSearch"
      placeholder="远程搜索"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref([])
const value3 = ref([])
const value4 = ref('')
const value5 = ref('')

const options = [
  { value: '1', label: '选项一' },
  { value: '2', label: '选项二' },
  { value: '3', label: '选项三' },
  { value: '4', label: '选项四' }
]

const remoteOptions = ref([])

const handleRemoteSearch = async (query: string) => {
  if (query) {
    // 模拟远程搜索
    remoteOptions.value = options.filter(item => item.label.includes(query))
  } else {
    remoteOptions.value = []
  }
}
</script>
```

## 🔧 工具函数使用

### 验证工具

```typescript
import { isEmail, isPhone, isIdCard, isUrl, getPasswordStrength } from '@bingwu/iip-ui-utils'

// 邮箱验证
console.log(isEmail('test@example.com')) // true

// 手机号验证
console.log(isPhone('13800138000')) // true

// 身份证验证
console.log(isIdCard('110101199003077777')) // true

// URL验证
console.log(isUrl('https://www.example.com')) // true

// 密码强度检测
console.log(getPasswordStrength('Password123!')) // 'strong'
```

### 通用工具

```typescript
import { debounce, throttle, deepClone, generateId } from '@bingwu/iip-ui-utils'

// 防抖
const debouncedFn = debounce(() => {
  console.log('防抖执行')
}, 300)

// 节流
const throttledFn = throttle(() => {
  console.log('节流执行')
}, 1000)

// 深拷贝
const cloned = deepClone({ a: 1, b: { c: 2 } })

// 生成唯一ID
const id = generateId() // 'iip-1234567890'
```

## 📚 更多文档

- [组件文档](./packages/docs) - 详细的组件API文档
- [主题定制](./packages/theme) - 主题系统说明
- [工具函数](./packages/utils) - 工具函数API
- [更新日志](./CHANGELOG.md) - 版本更新记录

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### IipTable 表格

```vue
<template>
  <div>
    <!-- 基础表格 -->
    <iip-table :data="tableData" :columns="columns" border stripe />

    <!-- 带复选框和分页 -->
    <iip-table
      :data="paginatedData"
      :columns="columns"
      :pagination="paginationConfig"
      show-checkbox
      show-seq
      border
      @checkbox-change="handleCheckboxChange"
      @page-change="handlePageChange"
    />

    <!-- 自定义列 -->
    <iip-table :data="tableData" :columns="customColumns" border>
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>
    </iip-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: 1 },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: 2 },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: 0 }
])

const columns = [
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80, sortable: true },
  { field: 'email', title: '邮箱', minWidth: 200 }
]

const customColumns = [
  ...columns,
  { field: 'status', title: '状态', width: 100, slotName: 'status' }
]

const paginationConfig = ref({
  currentPage: 1,
  pageSize: 10,
  total: tableData.value.length
})

const paginatedData = computed(() => {
  const start = (paginationConfig.value.currentPage - 1) * paginationConfig.value.pageSize
  const end = start + paginationConfig.value.pageSize
  return tableData.value.slice(start, end)
})

const handleCheckboxChange = params => {
  console.log('选中行变化:', params)
}

const handlePageChange = params => {
  paginationConfig.value.currentPage = params.currentPage
}

const getStatusType = (status: number): 'success' | 'warning' | 'info' => {
  const types: ('success' | 'warning' | 'info')[] = ['info', 'success', 'warning']
  return types[status] || 'info'
}

const getStatusText = (status: number) => {
  const texts = ['禁用', '正常', '待审核']
  return texts[status] || '未知'
}
</script>
```

## 📄 许可证

[MIT](./LICENSE) © 2024 IIP UI Vue3 Team
