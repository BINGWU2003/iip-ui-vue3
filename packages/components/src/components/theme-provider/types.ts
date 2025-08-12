import type { ThemeConfig } from '@iip-ui/utils'

export interface IipThemeProviderProps {
  /** 主题配置 */
  theme?: Partial<ThemeConfig>
  /** 是否监听系统主题变化 */
  watchSystem?: boolean
  /** 命名空间 */
  namespace?: string
}

export interface IipThemeProviderEmits {
  /** 主题变化时触发 */
  (e: 'theme-change', theme: ThemeConfig): void
}

export interface IipThemeProviderExpose {
  /** 设置主题 */
  setTheme: (theme: Partial<ThemeConfig>) => void
  /** 获取当前主题 */
  getTheme: () => ThemeConfig
  /** 切换主题 */
  toggleTheme: () => void
}
