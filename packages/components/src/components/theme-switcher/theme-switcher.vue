<template>
  <div class="iip-theme-switcher" :class="switcherClasses">
    <!-- 按钮类型 -->
    <el-button v-if="type === 'button'" :size="size" :disabled="disabled" @click="handleToggle">
      <el-icon>
        <component :is="currentIcon" />
      </el-icon>
      <span v-if="showText" class="iip-theme-switcher__text">
        {{ currentText }}
      </span>
    </el-button>

    <!-- 开关类型 -->
    <el-switch
      v-else-if="type === 'switch'"
      :model-value="currentMode === 'dark'"
      :size="size"
      :disabled="disabled"
      :active-icon="DarkIcon"
      :inactive-icon="LightIcon"
      @change="handleSwitchChange"
    />

    <!-- 下拉选择类型 -->
    <el-dropdown
      v-else-if="type === 'dropdown'"
      :disabled="disabled"
      @command="handleDropdownCommand"
    >
      <el-button :size="size" :disabled="disabled">
        <el-icon>
          <component :is="currentIcon" />
        </el-icon>
        <span v-if="showText" class="iip-theme-switcher__text">
          {{ currentText }}
        </span>
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="mode in themeOptions"
            :key="mode.value"
            :command="mode.value"
            :class="{ 'is-active': currentMode === mode.value }"
          >
            <el-icon>
              <component :is="mode.icon" />
            </el-icon>
            {{ mode.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ElButton,
  ElSwitch,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon
} from 'element-plus'
import { Sunny, Moon, Monitor, ArrowDown } from '@element-plus/icons-vue'
import { themeManager, type ThemeMode } from '@iip-ui/utils'
import type { IipThemeSwitcherProps, IipThemeSwitcherEmits, IipThemeSwitcherExpose } from './types'

defineOptions({
  name: 'IipThemeSwitcher'
})

const props = withDefaults(defineProps<IipThemeSwitcherProps>(), {
  type: 'button',
  showText: false,
  texts: () => ({
    light: '浅色',
    dark: '深色',
    auto: '跟随系统'
  }),
  disabled: false,
  size: 'default'
})

const emit = defineEmits<IipThemeSwitcherEmits>()

// 图标组件
const LightIcon = Sunny
const DarkIcon = Moon
const AutoIcon = Monitor

// 当前主题模式
const currentMode = ref<ThemeMode>(props.modelValue || themeManager.getTheme().mode)

// 主题选项
const themeOptions = [
  { value: 'light' as ThemeMode, label: props.texts.light, icon: LightIcon },
  { value: 'dark' as ThemeMode, label: props.texts.dark, icon: DarkIcon },
  { value: 'auto' as ThemeMode, label: props.texts.auto, icon: AutoIcon }
]

// 计算属性
const switcherClasses = computed(() => ({
  [`iip-theme-switcher--${props.type}`]: true,
  [`iip-theme-switcher--${props.size}`]: props.size !== 'default',
  'iip-theme-switcher--disabled': props.disabled
}))

const currentIcon = computed(() => {
  switch (currentMode.value) {
    case 'light':
      return LightIcon
    case 'dark':
      return DarkIcon
    case 'auto':
      return AutoIcon
    default:
      return LightIcon
  }
})

const currentText = computed(() => {
  switch (currentMode.value) {
    case 'light':
      return props.texts.light
    case 'dark':
      return props.texts.dark
    case 'auto':
      return props.texts.auto
    default:
      return props.texts.light
  }
})

// 事件处理
const handleToggle = () => {
  const modes: ThemeMode[] = ['light', 'dark', 'auto']
  const currentIndex = modes.indexOf(currentMode.value)
  const nextIndex = (currentIndex + 1) % modes.length
  const nextMode = modes[nextIndex]

  setMode(nextMode)
}

const handleSwitchChange = (value: string | number | boolean) => {
  const newMode: ThemeMode = value ? 'dark' : 'light'
  setMode(newMode)
}

const handleDropdownCommand = (command: ThemeMode) => {
  setMode(command)
}

const setMode = (mode: ThemeMode) => {
  currentMode.value = mode
  themeManager.setTheme({ mode })
  emit('update:modelValue', mode)
  emit('change', mode)
}

const toggle = () => {
  handleToggle()
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newValue => {
    if (newValue && newValue !== currentMode.value) {
      currentMode.value = newValue
    }
  }
)

defineExpose<IipThemeSwitcherExpose>({
  toggle,
  setMode
})
</script>

<style lang="scss" scoped>
.iip-theme-switcher {
  display: inline-flex;
  align-items: center;

  &__text {
    margin-left: var(--iip-spacing-xs);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  :deep(.el-dropdown-menu__item) {
    &.is-active {
      color: var(--iip-color-primary);
      background-color: var(--iip-color-primary-light-9);
    }
  }
}
</style>
