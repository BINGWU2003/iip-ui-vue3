import type { ThemeMode } from '@bingwu/iip-ui-utils'

export interface IipThemeSwitcherProps {
  /** 当前主题模式 */
  modelValue?: ThemeMode
  /** 切换器类型 */
  type?: 'button' | 'switch' | 'dropdown'
  /** 是否显示文本 */
  showText?: boolean
  /** 自定义文本 */
  texts?: {
    light?: string
    dark?: string
    auto?: string
  }
  /** 是否禁用 */
  disabled?: boolean
  /** 尺寸 */
  size?: 'large' | 'default' | 'small'
}

export interface IipThemeSwitcherEmits {
  /** 主题模式变化时触发 */
  (e: 'update:modelValue', mode: ThemeMode): void
  /** 主题切换时触发 */
  (e: 'change', mode: ThemeMode): void
}

export interface IipThemeSwitcherExpose {
  /** 切换到下一个主题 */
  toggle: () => void
  /** 设置主题模式 */
  setMode: (mode: ThemeMode) => void
}
