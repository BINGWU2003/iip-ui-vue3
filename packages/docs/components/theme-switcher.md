# ThemeSwitcher 主题切换器

ThemeSwitcher 是一个用于切换亮色和暗色主题的交互组件，提供了多种样式和交互方式。

## 基础用法

最简单的主题切换器：

```vue
<template>
  <div>
    <theme-switcher v-model="currentTheme" />
    <p>当前主题：{{ currentTheme }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitcher } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
</script>
```

## 显示标签

```vue
<template>
  <div class="theme-demo">
    <!-- 显示标签的切换器 -->
    <theme-switcher v-model="currentTheme" :show-label="true" />

    <!-- 自定义标签文本 -->
    <theme-switcher
      v-model="currentTheme"
      :show-label="true"
      light-label="日间模式"
      dark-label="夜间模式"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitcher } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
</script>

<style scoped>
.theme-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}
</style>
```

## 不同尺寸

```vue
<template>
  <div class="size-demo">
    <div class="size-group">
      <h4>小尺寸</h4>
      <theme-switcher v-model="currentTheme" size="small" />
    </div>

    <div class="size-group">
      <h4>中等尺寸（默认）</h4>
      <theme-switcher v-model="currentTheme" size="medium" />
    </div>

    <div class="size-group">
      <h4>大尺寸</h4>
      <theme-switcher v-model="currentTheme" size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitcher } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
</script>

<style scoped>
.size-demo {
  display: flex;
  gap: 24px;
  padding: 20px;
  align-items: center;
}

.size-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.size-group h4 {
  margin: 0;
  font-size: 14px;
  color: var(--iip-text-color-secondary);
}
</style>
```

## 不同样式类型

```vue
<template>
  <div class="type-demo">
    <div class="type-group">
      <h4>开关样式（默认）</h4>
      <theme-switcher v-model="currentTheme" type="switch" />
    </div>

    <div class="type-group">
      <h4>按钮样式</h4>
      <theme-switcher v-model="currentTheme" type="button" />
    </div>

    <div class="type-group">
      <h4>图标样式</h4>
      <theme-switcher v-model="currentTheme" type="icon" />
    </div>

    <div class="type-group">
      <h4>选择器样式</h4>
      <theme-switcher v-model="currentTheme" type="select" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitcher } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
</script>

<style scoped>
.type-demo {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 20px;
}

.type-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--iip-border-color);
  border-radius: 8px;
}

.type-group h4 {
  margin: 0;
  font-size: 14px;
  color: var(--iip-text-color-regular);
}
</style>
```

## 自定义图标

```vue
<template>
  <div class="icon-demo">
    <div class="icon-group">
      <h4>默认图标</h4>
      <theme-switcher v-model="currentTheme" type="icon" />
    </div>

    <div class="icon-group">
      <h4>自定义图标</h4>
      <theme-switcher v-model="currentTheme" type="icon" light-icon="☀️" dark-icon="🌙" />
    </div>

    <div class="icon-group">
      <h4>Element Plus 图标</h4>
      <theme-switcher
        v-model="currentTheme"
        type="icon"
        :light-icon="SunIcon"
        :dark-icon="MoonIcon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sunny as SunIcon, Moon as MoonIcon } from '@element-plus/icons-vue'
import { ThemeSwitcher } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
</script>

<style scoped>
.icon-demo {
  display: flex;
  gap: 24px;
  padding: 20px;
}

.icon-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.icon-group h4 {
  margin: 0;
  font-size: 14px;
  color: var(--iip-text-color-secondary);
}
</style>
```

## 禁用状态

```vue
<template>
  <div class="disabled-demo">
    <div class="demo-group">
      <h4>正常状态</h4>
      <theme-switcher v-model="currentTheme" />
    </div>

    <div class="demo-group">
      <h4>禁用状态</h4>
      <theme-switcher v-model="currentTheme" disabled />
    </div>

    <div class="demo-group">
      <h4>加载状态</h4>
      <theme-switcher v-model="currentTheme" loading />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitcher } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
</script>

<style scoped>
.disabled-demo {
  display: flex;
  gap: 24px;
  padding: 20px;
}

.demo-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.demo-group h4 {
  margin: 0;
  font-size: 14px;
  color: var(--iip-text-color-secondary);
}
</style>
```

## 与 ThemeProvider 结合使用

```vue
<template>
  <theme-provider :theme="globalTheme">
    <div id="app">
      <!-- 顶部导航栏 -->
      <header class="app-header">
        <div class="header-content">
          <h1>我的应用</h1>
          <div class="header-actions">
            <theme-switcher v-model="globalTheme" :show-label="true" size="small" />
          </div>
        </div>
      </header>

      <!-- 主要内容 -->
      <main class="app-main">
        <div class="content-card">
          <h2>内容区域</h2>
          <p>这里的内容会根据主题变化调整样式</p>

          <!-- 表格组件也会跟随主题变化 -->
          <iip-table :data="tableData" :columns="columns" border stripe />
        </div>
      </main>

      <!-- 侧边栏中的主题切换 -->
      <aside class="app-sidebar">
        <div class="sidebar-section">
          <h3>主题设置</h3>
          <div class="theme-options">
            <theme-switcher v-model="globalTheme" type="button" :show-label="true" />
          </div>
        </div>
      </aside>
    </div>
  </theme-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeProvider, ThemeSwitcher } from '@bingwu/iip-ui-components'

const globalTheme = ref<'light' | 'dark'>('light')

const tableData = ref([
  { id: 1, name: '张三', status: '正常' },
  { id: 2, name: '李四', status: '禁用' }
])

const columns = ref([
  { tableColumnProps: { field: 'name', title: '姓名', width: 120 } },
  { tableColumnProps: { field: 'status', title: '状态', width: 100 } }
])
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: grid;
  grid-template-areas:
    'header header'
    'sidebar main';
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
}

.app-header {
  grid-area: header;
  background: var(--iip-bg-color-overlay);
  border-bottom: 1px solid var(--iip-border-color);
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.header-content h1 {
  margin: 0;
  color: var(--iip-text-color-primary);
}

.app-sidebar {
  grid-area: sidebar;
  background: var(--iip-fill-color-light);
  border-right: 1px solid var(--iip-border-color);
  padding: 20px;
}

.sidebar-section h3 {
  margin: 0 0 16px 0;
  color: var(--iip-text-color-primary);
}

.app-main {
  grid-area: main;
  padding: 20px;
  background: var(--iip-bg-color-page);
}

.content-card {
  background: var(--iip-bg-color);
  border: 1px solid var(--iip-border-color);
  border-radius: 8px;
  padding: 24px;
}

.content-card h2 {
  margin: 0 0 16px 0;
  color: var(--iip-text-color-primary);
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
```

## 事件处理

```vue
<template>
  <div class="event-demo">
    <div class="switcher-section">
      <h3>主题切换器</h3>
      <theme-switcher
        v-model="currentTheme"
        @change="handleThemeChange"
        @before-change="handleBeforeChange"
      />
    </div>

    <div class="log-section">
      <h3>事件日志</h3>
      <div class="event-log">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-event">{{ log.event }}</span>
          <span class="log-data">{{ log.data }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitcher } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
const eventLogs = ref<
  Array<{
    time: string
    event: string
    data: string
  }>
>([])

const addLog = (event: string, data: any) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    event,
    data: JSON.stringify(data)
  })

  // 限制日志条数
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}

const handleThemeChange = (theme: 'light' | 'dark') => {
  addLog('change', { theme })
  console.log('主题已切换到:', theme)
}

const handleBeforeChange = (oldTheme: 'light' | 'dark', newTheme: 'light' | 'dark') => {
  addLog('before-change', { oldTheme, newTheme })
  console.log('主题即将从', oldTheme, '切换到', newTheme)

  // 可以在这里添加切换前的验证逻辑
  // 返回 false 可以阻止切换
  return true
}
</script>

<style scoped>
.event-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 20px;
}

.switcher-section,
.log-section {
  padding: 16px;
  border: 1px solid var(--iip-border-color);
  border-radius: 8px;
}

.switcher-section h3,
.log-section h3 {
  margin: 0 0 16px 0;
  color: var(--iip-text-color-primary);
}

.event-log {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--iip-border-color-light);
  border-radius: 4px;
  padding: 8px;
}

.log-item {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  border-bottom: 1px solid var(--iip-border-color-extra-light);
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: var(--iip-text-color-secondary);
}

.log-event {
  color: var(--iip-color-primary);
  font-weight: 500;
}

.log-data {
  color: var(--iip-text-color-regular);
  word-break: break-all;
}
</style>
```

## API

### Props

| 参数       | 说明             | 类型                                         | 默认值     |
| ---------- | ---------------- | -------------------------------------------- | ---------- |
| modelValue | 当前主题         | `'light' \| 'dark'`                          | `'light'`  |
| size       | 组件尺寸         | `'small' \| 'medium' \| 'large'`             | `'medium'` |
| type       | 组件类型         | `'switch' \| 'button' \| 'icon' \| 'select'` | `'switch'` |
| showLabel  | 是否显示标签     | `boolean`                                    | `false`    |
| lightLabel | 亮色主题标签     | `string`                                     | `'亮色'`   |
| darkLabel  | 暗色主题标签     | `string`                                     | `'暗色'`   |
| lightIcon  | 亮色主题图标     | `string \| Component`                        | -          |
| darkIcon   | 暗色主题图标     | `string \| Component`                        | -          |
| disabled   | 是否禁用         | `boolean`                                    | `false`    |
| loading    | 是否加载中       | `boolean`                                    | `false`    |
| transition | 过渡动画时长(ms) | `number`                                     | `300`      |

### Events

| 事件名            | 说明               | 参数                                                                            |
| ----------------- | ------------------ | ------------------------------------------------------------------------------- |
| update:modelValue | 主题值更新时触发   | `(theme: 'light' \| 'dark') => void`                                            |
| change            | 主题切换完成时触发 | `(theme: 'light' \| 'dark') => void`                                            |
| before-change     | 主题切换前触发     | `(oldTheme: 'light' \| 'dark', newTheme: 'light' \| 'dark') => boolean \| void` |

### Slots

| 插槽名     | 说明               | 参数                                          |
| ---------- | ------------------ | --------------------------------------------- |
| light-icon | 自定义亮色主题图标 | `{ theme: 'light' }`                          |
| dark-icon  | 自定义暗色主题图标 | `{ theme: 'dark' }`                           |
| label      | 自定义标签内容     | `{ theme: 'light' \| 'dark', label: string }` |

## 自定义样式

### CSS 变量

```css
.theme-switcher {
  /* 开关轨道 */
  --theme-switcher-track-bg: var(--iip-fill-color);
  --theme-switcher-track-active-bg: var(--iip-color-primary);

  /* 开关按钮 */
  --theme-switcher-thumb-bg: var(--iip-bg-color);
  --theme-switcher-thumb-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  /* 尺寸 */
  --theme-switcher-width: 44px;
  --theme-switcher-height: 22px;
  --theme-switcher-thumb-size: 18px;

  /* 过渡 */
  --theme-switcher-transition: all 0.3s ease;
}
```

### 自定义样式类

```vue
<template>
  <theme-switcher v-model="currentTheme" class="custom-theme-switcher" />
</template>

<style scoped>
.custom-theme-switcher {
  --theme-switcher-track-bg: #e5e7eb;
  --theme-switcher-track-active-bg: #3b82f6;
  --theme-switcher-width: 52px;
  --theme-switcher-height: 26px;
}

/* 暗色主题下的样式 */
html.dark .custom-theme-switcher {
  --theme-switcher-track-bg: #374151;
  --theme-switcher-track-active-bg: #60a5fa;
}
</style>
```

## 最佳实践

### 1. 合理的放置位置

将主题切换器放在用户容易找到的位置：

```vue
<!-- ✅ 推荐：在导航栏或设置页面 -->
<nav class="navbar">
  <div class="nav-brand">Logo</div>
  <div class="nav-actions">
    <theme-switcher v-model="theme" />
  </div>
</nav>

<!-- ❌ 避免：在页面主要内容区域 -->
```

### 2. 保持一致性

在整个应用中使用统一的主题切换器配置：

```typescript
// theme-config.ts
export const themeConfig = {
  size: 'medium',
  showLabel: false,
  transition: 300
} as const
```

### 3. 响应式设计

考虑在不同设备上的显示效果：

```scss
.theme-switcher-container {
  // 在移动设备上显示图标类型
  @media (max-width: 768px) {
    .theme-switcher--with-label {
      display: none;
    }
    .theme-switcher--icon-only {
      display: inline-flex;
    }
  }

  // 在桌面设备上显示标签
  @media (min-width: 769px) {
    .theme-switcher--with-label {
      display: inline-flex;
    }
    .theme-switcher--icon-only {
      display: none;
    }
  }
}
```

### 4. 可访问性

确保主题切换器具有良好的可访问性：

```vue
<theme-switcher
  v-model="theme"
  :aria-label="`切换到${theme === 'light' ? '暗色' : '亮色'}主题`"
  role="switch"
  :aria-checked="theme === 'dark'"
/>
```

通过合理使用 ThemeSwitcher，你可以为用户提供直观、易用的主题切换体验。
