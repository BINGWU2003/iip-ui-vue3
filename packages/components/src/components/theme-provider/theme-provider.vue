<template>
  <div class="iip-theme-provider" :data-namespace="currentNamespace">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { createThemeManager, type ThemeConfig } from '@bingwu/iip-ui-utils'
import type { IipThemeProviderProps, IipThemeProviderEmits, IipThemeProviderExpose } from './types'

defineOptions({
  name: 'IipThemeProvider'
})

const props = withDefaults(defineProps<IipThemeProviderProps>(), {
  watchSystem: true,
  namespace: 'iip'
})

const emit = defineEmits<IipThemeProviderEmits>()

// 主题管理器
const themeManager = createThemeManager(props.theme)
const currentNamespace = ref(props.namespace)

// 系统主题监听器
let unwatchSystem: (() => void) | null = null

// 监听主题变化
const handleThemeChange = () => {
  const currentTheme = themeManager.getTheme()
  emit('theme-change', currentTheme)
}

// 设置主题
const setTheme = (theme: Partial<ThemeConfig>) => {
  themeManager.setTheme(theme)
  handleThemeChange()
}

// 获取当前主题
const getTheme = () => {
  return themeManager.getTheme()
}

// 切换主题
const toggleTheme = () => {
  themeManager.toggleTheme()
  handleThemeChange()
}

// 监听 props 变化
watch(
  () => props.theme,
  newTheme => {
    if (newTheme) {
      setTheme(newTheme)
    }
  },
  { deep: true }
)

watch(
  () => props.namespace,
  newNamespace => {
    currentNamespace.value = newNamespace
    themeManager.setNamespace(newNamespace)
    handleThemeChange()
  }
)

onMounted(() => {
  // 设置初始命名空间
  themeManager.setNamespace(props.namespace)

  // 监听系统主题变化
  if (props.watchSystem) {
    unwatchSystem = themeManager.watchSystemTheme(isDark => {
      const currentTheme = themeManager.getTheme()
      if (currentTheme.mode === 'auto') {
        handleThemeChange()
      }
    })
  }

  // 触发初始主题变化事件
  handleThemeChange()
})

onUnmounted(() => {
  // 清理系统主题监听器
  if (unwatchSystem) {
    unwatchSystem()
  }
})

defineExpose<IipThemeProviderExpose>({
  setTheme,
  getTheme,
  toggleTheme
})
</script>

<style lang="scss" scoped>
.iip-theme-provider {
  width: 100%;
  height: 100%;
}
</style>
