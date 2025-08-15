# ThemeProvider 主题提供者

ThemeProvider 组件为应用提供主题上下文，管理全局主题状态和主题切换功能。

## 基础用法

最简单的主题提供者用法：

```vue
<template>
  <theme-provider>
    <div id="app">
      <!-- 你的应用内容 -->
      <router-view />
    </div>
  </theme-provider>
</template>

<script setup lang="ts">
import { ThemeProvider } from '@bingwu/iip-ui-components'
</script>
```

## 指定初始主题

```vue
<template>
  <theme-provider :theme="initialTheme">
    <div id="app">
      <header>
        <h1>我的应用</h1>
        <theme-switcher v-model="currentTheme" />
      </header>
      <main>
        <router-view />
      </main>
    </div>
  </theme-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeProvider, ThemeSwitcher } from '@bingwu/iip-ui-components'

const initialTheme = ref<'light' | 'dark'>('light')
const currentTheme = ref<'light' | 'dark'>('light')
</script>
```

## 响应式主题

```vue
<template>
  <theme-provider :theme="currentTheme">
    <div id="app">
      <div class="theme-demo">
        <h2>当前主题：{{ currentTheme }}</h2>
        <button @click="toggleTheme">切换主题</button>

        <div class="content-area">
          <p>这里的内容会随主题变化而改变样式</p>
          <iip-table :data="tableData" :columns="columns" border />
        </div>
      </div>
    </div>
  </theme-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeProvider } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 }
])

const columns = ref([
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'age', title: '年龄', width: 80 } }
])
</script>

<style scoped>
.theme-demo {
  padding: 20px;
  background: var(--iip-bg-color);
  color: var(--iip-text-color-primary);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.content-area {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid var(--iip-border-color);
  border-radius: 4px;
}
</style>
```

## 持久化主题

```vue
<template>
  <theme-provider :theme="persistentTheme">
    <div id="app">
      <nav>
        <theme-switcher v-model="persistentTheme" />
      </nav>
      <main>
        <router-view />
      </main>
    </div>
  </theme-provider>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ThemeProvider, ThemeSwitcher } from '@bingwu/iip-ui-components'

const persistentTheme = ref<'light' | 'dark'>('light')

// 从本地存储恢复主题
onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark'
  if (savedTheme) {
    persistentTheme.value = savedTheme
  }
})

// 监听主题变化并保存
watch(
  persistentTheme,
  newTheme => {
    localStorage.setItem('app-theme', newTheme)
  },
  { immediate: true }
)
</script>
```

## 系统主题检测

```vue
<template>
  <theme-provider :theme="systemTheme">
    <div id="app">
      <div class="theme-info">
        <p>系统主题：{{ systemPreference }}</p>
        <p>当前主题：{{ systemTheme }}</p>
        <button @click="useSystemTheme">跟随系统</button>
        <button @click="setLightTheme">亮色主题</button>
        <button @click="setDarkTheme">暗色主题</button>
      </div>
      <main>
        <router-view />
      </main>
    </div>
  </theme-provider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ThemeProvider } from '@bingwu/iip-ui-components'

const systemTheme = ref<'light' | 'dark'>('light')
const systemPreference = ref<'light' | 'dark'>('light')

// 检测系统主题偏好
const detectSystemTheme = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemPreference.value = mediaQuery.matches ? 'dark' : 'light'
  return systemPreference.value
}

// 跟随系统主题
const useSystemTheme = () => {
  systemTheme.value = detectSystemTheme()

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', e => {
    systemPreference.value = e.matches ? 'dark' : 'light'
    systemTheme.value = systemPreference.value
  })
}

const setLightTheme = () => {
  systemTheme.value = 'light'
}

const setDarkTheme = () => {
  systemTheme.value = 'dark'
}

onMounted(() => {
  detectSystemTheme()
  useSystemTheme()
})
</script>

<style scoped>
.theme-info {
  padding: 16px;
  background: var(--iip-fill-color-light);
  border-radius: 8px;
  margin-bottom: 20px;
}

.theme-info button {
  margin-right: 8px;
  margin-top: 8px;
}
</style>
```

## 自定义主题变量

```vue
<template>
  <theme-provider :theme="currentTheme" :theme-vars="customVars">
    <div id="app">
      <div class="custom-theme-demo">
        <h2>自定义主题演示</h2>
        <div class="color-palette">
          <div class="color-item primary">主色调</div>
          <div class="color-item success">成功色</div>
          <div class="color-item warning">警告色</div>
          <div class="color-item danger">危险色</div>
        </div>

        <div class="theme-controls">
          <label>
            主色调：
            <input type="color" v-model="customVars.primary" @change="updateThemeVars" />
          </label>
          <label>
            成功色：
            <input type="color" v-model="customVars.success" @change="updateThemeVars" />
          </label>
        </div>
      </div>
    </div>
  </theme-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeProvider } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
const customVars = ref({
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c'
})

const updateThemeVars = () => {
  // ThemeProvider 会自动应用新的主题变量
  console.log('主题变量已更新:', customVars.value)
}
</script>

<style scoped>
.custom-theme-demo {
  padding: 20px;
}

.color-palette {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

.color-item {
  padding: 12px 16px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
}

.color-item.primary {
  background-color: var(--iip-color-primary);
}

.color-item.success {
  background-color: var(--iip-color-success);
}

.color-item.warning {
  background-color: var(--iip-color-warning);
}

.color-item.danger {
  background-color: var(--iip-color-danger);
}

.theme-controls {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.theme-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
```

## API

### Props

| 参数             | 说明                 | 类型                     | 默认值           |
| ---------------- | -------------------- | ------------------------ | ---------------- |
| theme            | 当前主题             | `'light' \| 'dark'`      | `'light'`        |
| themeVars        | 自定义主题变量       | `Record<string, string>` | `{}`             |
| transition       | 是否启用过渡动画     | `boolean`                | `true`           |
| storageKey       | 本地存储键名         | `string`                 | `'iip-ui-theme'` |
| autoDetectSystem | 是否自动检测系统主题 | `boolean`                | `false`          |

### Events

| 事件名       | 说明               | 参数                                     |
| ------------ | ------------------ | ---------------------------------------- |
| theme-change | 主题变化时触发     | `(theme: 'light' \| 'dark') => void`     |
| vars-change  | 主题变量变化时触发 | `(vars: Record<string, string>) => void` |

### Slots

| 插槽名  | 说明                             |
| ------- | -------------------------------- |
| default | 默认插槽，包裹需要应用主题的内容 |

## 组合式 API

### useTheme

```typescript
import { useTheme } from '@bingwu/iip-ui-components'

export default {
  setup() {
    const {
      theme, // 当前主题
      isDark, // 是否为暗色主题
      toggleTheme, // 切换主题
      setTheme, // 设置主题
      themeVars // 主题变量
    } = useTheme()

    return {
      theme,
      isDark,
      toggleTheme,
      setTheme,
      themeVars
    }
  }
}
```

### 高级用法

```vue
<script setup lang="ts">
import { useTheme } from '@bingwu/iip-ui-components'

const { theme, isDark, toggleTheme, setTheme, themeVars, updateThemeVar, resetThemeVars } =
  useTheme()

// 批量更新主题变量
const updateBrandColors = () => {
  updateThemeVar({
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    danger: '#f5222d'
  })
}

// 重置为默认主题变量
const resetToDefault = () => {
  resetThemeVars()
}

// 应用预设主题
const applyPreset = (preset: 'blue' | 'green' | 'purple') => {
  const presets = {
    blue: { primary: '#1890ff' },
    green: { primary: '#52c41a' },
    purple: { primary: '#722ed1' }
  }

  updateThemeVar(presets[preset])
}
</script>
```

## 主题变量

### 可自定义的变量

```typescript
interface ThemeVars {
  // 主色调
  primary?: string
  'primary-light-3'?: string
  'primary-light-5'?: string
  'primary-light-7'?: string
  'primary-light-8'?: string
  'primary-light-9'?: string
  'primary-dark-2'?: string

  // 功能色
  success?: string
  warning?: string
  danger?: string
  info?: string

  // 文本颜色
  'text-color-primary'?: string
  'text-color-regular'?: string
  'text-color-secondary'?: string
  'text-color-placeholder'?: string
  'text-color-disabled'?: string

  // 边框颜色
  'border-color'?: string
  'border-color-light'?: string
  'border-color-lighter'?: string
  'border-color-extra-light'?: string
  'border-color-dark'?: string
  'border-color-darker'?: string

  // 填充颜色
  'fill-color'?: string
  'fill-color-light'?: string
  'fill-color-lighter'?: string
  'fill-color-extra-light'?: string
  'fill-color-dark'?: string
  'fill-color-darker'?: string
  'fill-color-blank'?: string

  // 背景颜色
  'bg-color'?: string
  'bg-color-page'?: string
  'bg-color-overlay'?: string
}
```

## 最佳实践

### 1. 单一数据源

确保整个应用只有一个 ThemeProvider：

```vue
<!-- ✅ 推荐：在根组件中使用 -->
<template>
  <theme-provider :theme="globalTheme">
    <router-view />
  </theme-provider>
</template>

<!-- ❌ 避免：嵌套使用 -->
<template>
  <theme-provider theme="light">
    <theme-provider theme="dark">
      <!-- 不要这样做 -->
      <div>内容</div>
    </theme-provider>
  </theme-provider>
</template>
```

### 2. 主题持久化

使用本地存储或 cookie 保存用户的主题偏好：

```typescript
// 推荐的主题持久化方案
const usePersistedTheme = () => {
  const theme = ref<'light' | 'dark'>('light')

  // 恢复保存的主题
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme as 'light' | 'dark'
  }

  // 监听变化并保存
  watch(theme, newTheme => {
    localStorage.setItem('theme', newTheme)
  })

  return theme
}
```

### 3. 系统主题适配

考虑用户的系统主题偏好：

```typescript
const useSystemTheme = () => {
  const systemTheme = ref<'light' | 'dark'>('light')

  const updateSystemTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    systemTheme.value = isDark ? 'dark' : 'light'
  }

  onMounted(() => {
    updateSystemTheme()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateSystemTheme)
  })

  return systemTheme
}
```

### 4. 性能优化

避免频繁的主题切换导致的性能问题：

```typescript
// 使用防抖来优化主题变量更新
import { debounce } from 'lodash-es'

const debouncedUpdateTheme = debounce((vars: ThemeVars) => {
  updateThemeVar(vars)
}, 300)
```

通过合理使用 ThemeProvider，你可以为用户提供一致的主题体验，并支持个性化的主题定制。
