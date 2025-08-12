// 通用类型定义

export interface ComponentSize {
  large: 'large'
  default: 'default'
  small: 'small'
}

export type Size = 'large' | 'default' | 'small'

export interface ComponentType {
  primary: 'primary'
  success: 'success'
  warning: 'warning'
  danger: 'danger'
  info: 'info'
}

export type Type = 'primary' | 'success' | 'warning' | 'danger' | 'info'

// 组件通用 Props
export interface BaseProps {
  size?: Size
  disabled?: boolean
}

// 导出所有组件类型
export * from '../components/input/types'
export * from '../components/select/types'
export * from '../components/theme-provider/types'
export * from '../components/theme-switcher/types'
