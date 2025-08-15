# 主题定制

IIP UI Vue3 提供了灵活的主题定制系统，支持亮色和暗色主题，以及自定义主题变量。

## 主题系统

### 🎨 内置主题

IIP UI Vue3 内置了两套主题：

- **亮色主题** (Light Theme) - 默认主题
- **暗色主题** (Dark Theme) - 深色背景主题

### 🔧 技术实现

主题系统基于以下技术：

- **CSS 变量**: 使用 CSS 自定义属性实现动态切换
- **CSS-in-JS**: 支持运行时主题变量修改
- **继承机制**: 基于 Element Plus 主题系统扩展

## 使用主题组件

### ThemeProvider 主题提供者

`ThemeProvider` 为应用提供主题上下文：

```vue
<template>
  <theme-provider :theme="currentTheme">
    <div id="app">
      <!-- 你的应用内容 -->
      <router-view />
    </div>
  </theme-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeProvider } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
</script>
```

### ThemeSwitcher 主题切换器

`ThemeSwitcher` 提供主题切换功能：

```vue
<template>
  <div>
    <!-- 简单的主题切换器 -->
    <theme-switcher v-model="currentTheme" />

    <!-- 自定义样式的主题切换器 -->
    <theme-switcher v-model="currentTheme" :show-label="true" :size="'large'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThemeSwitcher } from '@bingwu/iip-ui-components'

const currentTheme = ref<'light' | 'dark'>('light')
</script>
```

## 自定义主题变量

### CSS 变量定制

你可以通过覆盖 CSS 变量来定制主题：

```css
/* 全局样式文件中 */
:root {
  /* 主色调 */
  --iip-color-primary: #409eff;
  --iip-color-primary-light-3: #79bbff;
  --iip-color-primary-light-5: #a0cfff;
  --iip-color-primary-light-7: #c6e2ff;
  --iip-color-primary-light-8: #d9ecff;
  --iip-color-primary-light-9: #ecf5ff;
  --iip-color-primary-dark-2: #337ecc;

  /* 成功色 */
  --iip-color-success: #67c23a;
  --iip-color-warning: #e6a23c;
  --iip-color-danger: #f56c6c;
  --iip-color-error: #f56c6c;
  --iip-color-info: #909399;

  /* 文本颜色 */
  --iip-text-color-primary: #303133;
  --iip-text-color-regular: #606266;
  --iip-text-color-secondary: #909399;
  --iip-text-color-placeholder: #a8abb2;
  --iip-text-color-disabled: #c0c4cc;

  /* 边框颜色 */
  --iip-border-color: #dcdfe6;
  --iip-border-color-light: #e4e7ed;
  --iip-border-color-lighter: #ebeef5;
  --iip-border-color-extra-light: #f2f6fc;
  --iip-border-color-dark: #d4d7de;
  --iip-border-color-darker: #cdd0d6;

  /* 填充颜色 */
  --iip-fill-color: #f0f2f5;
  --iip-fill-color-light: #f5f7fa;
  --iip-fill-color-lighter: #fafafa;
  --iip-fill-color-extra-light: #fafcff;
  --iip-fill-color-dark: #ebedf0;
  --iip-fill-color-darker: #e6e8eb;
  --iip-fill-color-blank: #ffffff;

  /* 背景颜色 */
  --iip-bg-color: #ffffff;
  --iip-bg-color-page: #f2f3f5;
  --iip-bg-color-overlay: #ffffff;

  /* 字体 */
  --iip-font-size-extra-large: 20px;
  --iip-font-size-large: 18px;
  --iip-font-size-medium: 16px;
  --iip-font-size-base: 14px;
  --iip-font-size-small: 13px;
  --iip-font-size-extra-small: 12px;

  /* 边距 */
  --iip-spacing-xs: 4px;
  --iip-spacing-sm: 8px;
  --iip-spacing-md: 16px;
  --iip-spacing-lg: 24px;
  --iip-spacing-xl: 32px;

  /* 圆角 */
  --iip-border-radius-base: 4px;
  --iip-border-radius-small: 2px;
  --iip-border-radius-round: 20px;
  --iip-border-radius-circle: 100%;

  /* 阴影 */
  --iip-box-shadow-base: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  --iip-box-shadow-dark: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.12);
  --iip-box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 暗色主题变量 */
html.dark {
  --iip-color-primary: #409eff;

  /* 文本颜色 */
  --iip-text-color-primary: #e5eaf3;
  --iip-text-color-regular: #cfd3dc;
  --iip-text-color-secondary: #a3a6ad;
  --iip-text-color-placeholder: #8d9095;
  --iip-text-color-disabled: #6c6e72;

  /* 边框颜色 */
  --iip-border-color: #4c4d4f;
  --iip-border-color-light: #414243;
  --iip-border-color-lighter: #363637;
  --iip-border-color-extra-light: #2b2b2c;
  --iip-border-color-dark: #58585b;
  --iip-border-color-darker: #636466;

  /* 填充颜色 */
  --iip-fill-color: #303030;
  --iip-fill-color-light: #262727;
  --iip-fill-color-lighter: #1d1d1d;
  --iip-fill-color-extra-light: #191919;
  --iip-fill-color-dark: #39393a;
  --iip-fill-color-darker: #424243;
  --iip-fill-color-blank: #141414;

  /* 背景颜色 */
  --iip-bg-color: #141414;
  --iip-bg-color-page: #0a0a0a;
  --iip-bg-color-overlay: #1d1e1f;
}
```

### Sass/SCSS 变量

如果你的项目使用 Sass，可以通过变量文件进行深度定制：

```scss
// theme-custom.scss

// 主色调
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;

// 字体
$font-family:
  'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
  Arial, sans-serif;
$font-size-base: 14px;
$font-size-small: 12px;
$font-size-large: 16px;

// 布局
$border-radius-base: 6px;
$border-width-base: 1px;
$spacing-unit: 8px;

// 组件特定变量
$table-border-color: #f0f0f0;
$table-header-bg: #fafafa;
$table-row-hover-bg: #f5f5f5;

// 导入主题（需要在变量定义之后）
@import '@bingwu/iip-ui-theme/src/index.scss';

// 或者只导入特定组件的样式
@import '@bingwu/iip-ui-theme/src/components/table.scss';
```

## 动态主题切换

### 使用 Composable

你可以使用内置的 composable 来管理主题：

```typescript
// useTheme.ts
import { ref, computed } from 'vue'

type Theme = 'light' | 'dark'

const currentTheme = ref<Theme>('light')

export function useTheme() {
  const isDark = computed(() => currentTheme.value === 'dark')

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    updateThemeClass()
  }

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    updateThemeClass()
  }

  const updateThemeClass = () => {
    const html = document.documentElement
    if (currentTheme.value === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 从本地存储恢复主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('iip-ui-theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }

  // 保存主题到本地存储
  const saveTheme = () => {
    localStorage.setItem('iip-ui-theme', currentTheme.value)
  }

  return {
    currentTheme: readonly(currentTheme),
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
    saveTheme
  }
}
```

### 在组件中使用

```vue
<template>
  <div class="app">
    <header>
      <h1>我的应用</h1>
      <button @click="toggleTheme">{{ isDark ? '🌞' : '🌙' }} 切换主题</button>
    </header>

    <main>
      <iip-table :data="tableData" :columns="columns" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme'

const { isDark, toggleTheme, initTheme, saveTheme } = useTheme()

// 监听主题变化并保存
watch(() => currentTheme.value, saveTheme)

onMounted(() => {
  initTheme()
})
</script>
```

## 自定义组件主题

### 创建主题变量

为你的自定义组件创建主题变量：

```scss
// custom-component.scss
.my-custom-component {
  // 使用主题变量
  background-color: var(--iip-bg-color);
  color: var(--iip-text-color-primary);
  border: 1px solid var(--iip-border-color);
  border-radius: var(--iip-border-radius-base);
  padding: var(--iip-spacing-md);

  // 自定义变量
  --my-component-highlight-color: var(--iip-color-primary);
  --my-component-spacing: var(--iip-spacing-sm);

  &__header {
    font-size: var(--iip-font-size-large);
    margin-bottom: var(--my-component-spacing);
    color: var(--my-component-highlight-color);
  }

  &__content {
    font-size: var(--iip-font-size-base);
    line-height: 1.5;
  }

  // 暗色主题适配
  html.dark & {
    --my-component-highlight-color: #60a5fa;
    box-shadow: var(--iip-box-shadow-dark);
  }

  // 悬停状态
  &:hover {
    background-color: var(--iip-fill-color-light);
  }
}
```

### 响应主题变化

在 Vue 组件中响应主题变化：

```vue
<template>
  <div class="my-custom-component" :class="{ 'is-dark': isDark }" :style="componentStyles">
    <div class="my-custom-component__header">标题</div>
    <div class="my-custom-component__content">内容</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium'
})

const { isDark } = useTheme()

const componentStyles = computed(() => {
  const styles: Record<string, string> = {}

  // 根据变体设置颜色
  if (props.variant === 'primary') {
    styles['--my-component-highlight-color'] = 'var(--iip-color-primary)'
  } else {
    styles['--my-component-highlight-color'] = 'var(--iip-color-info)'
  }

  // 根据尺寸设置间距
  const spacingMap = {
    small: 'var(--iip-spacing-sm)',
    medium: 'var(--iip-spacing-md)',
    large: 'var(--iip-spacing-lg)'
  }
  styles['--my-component-spacing'] = spacingMap[props.size]

  return styles
})
</script>
```

## 主题配色方案

### 预设配色

IIP UI Vue3 提供了几套预设配色方案：

```typescript
// theme-presets.ts
export const themePresets = {
  // 默认蓝色主题
  default: {
    primary: '#409eff',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c'
  },

  // 绿色主题
  green: {
    primary: '#52c41a',
    success: '#67c23a',
    warning: '#faad14',
    danger: '#f5222d'
  },

  // 紫色主题
  purple: {
    primary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    danger: '#f5222d'
  },

  // 橙色主题
  orange: {
    primary: '#fa8c16',
    success: '#52c41a',
    warning: '#faad14',
    danger: '#f5222d'
  }
}

export function applyThemePreset(preset: keyof typeof themePresets) {
  const colors = themePresets[preset]
  const root = document.documentElement

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--iip-color-${key}`, value)
  })
}
```

### 使用预设

```vue
<template>
  <div>
    <h3>选择主题配色</h3>
    <div class="theme-selector">
      <button
        v-for="(preset, key) in themePresets"
        :key="key"
        @click="applyThemePreset(key)"
        :class="{ active: currentPreset === key }"
      >
        {{ preset.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { themePresets, applyThemePreset } from './theme-presets'

const currentPreset = ref('default')

const selectPreset = (preset: string) => {
  currentPreset.value = preset
  applyThemePreset(preset)
}
</script>
```

## 最佳实践

### 1. 主题一致性

确保你的自定义样式与主题系统保持一致：

```scss
// ✅ 推荐：使用主题变量
.my-component {
  color: var(--iip-text-color-primary);
  background: var(--iip-bg-color);
}

// ❌ 避免：硬编码颜色值
.my-component {
  color: #333;
  background: #fff;
}
```

### 2. 响应式主题

确保组件在主题切换时能正确响应：

```vue
<script setup lang="ts">
// ✅ 推荐：使用 computed 响应主题变化
const themeClass = computed(() => ({
  'component--dark': isDark.value,
  'component--light': !isDark.value
}))

// ❌ 避免：静态类名
const themeClass = 'component--light'
</script>
```

### 3. 性能优化

避免在主题切换时造成不必要的重渲染：

```vue
<script setup lang="ts">
// ✅ 推荐：使用 CSS 变量
const styles = computed(() => ({
  '--component-color': props.color || 'var(--iip-color-primary)'
}))

// ❌ 避免：在 style 中使用复杂计算
const styles = computed(() => ({
  color: isDark.value ? '#fff' : '#000',
  background: isDark.value ? '#000' : '#fff'
}))
</script>
```

### 4. 可访问性

确保主题切换不影响可访问性：

```scss
.my-component {
  // 确保足够的对比度
  color: var(--iip-text-color-primary);

  // 为焦点状态提供明确的视觉反馈
  &:focus {
    outline: 2px solid var(--iip-color-primary);
    outline-offset: 2px;
  }

  // 考虑用户的运动偏好
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
```

## 调试主题

### 主题变量检查器

创建一个工具来检查当前主题变量：

```vue
<template>
  <div v-if="showDebugger" class="theme-debugger">
    <h4>主题变量调试器</h4>
    <div class="variable-list">
      <div v-for="variable in themeVariables" :key="variable.name" class="variable-item">
        <span class="variable-name">{{ variable.name }}</span>
        <span class="variable-value" :style="{ backgroundColor: variable.value }">
          {{ variable.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const showDebugger = ref(false)

const themeVariables = computed(() => {
  const root = document.documentElement
  const styles = getComputedStyle(root)

  const variables = [
    '--iip-color-primary',
    '--iip-color-success',
    '--iip-color-warning',
    '--iip-color-danger',
    '--iip-text-color-primary',
    '--iip-bg-color'
  ]

  return variables.map(name => ({
    name,
    value: styles.getPropertyValue(name).trim()
  }))
})
</script>
```

通过这些工具和方法，你可以轻松地定制和管理 IIP UI Vue3 的主题系统，创建符合你品牌风格的用户界面。
