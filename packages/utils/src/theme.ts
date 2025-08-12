// 主题管理工具

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
  mode: ThemeMode
  namespace?: string
  primaryColor?: string
  customVars?: Record<string, string>
}

export interface ThemeManager {
  setTheme: (config: Partial<ThemeConfig>) => void
  getTheme: () => ThemeConfig
  toggleTheme: () => void
  setNamespace: (namespace: string) => void
  getNamespace: () => string
  setPrimaryColor: (color: string) => void
  setCustomVars: (vars: Record<string, string>) => void
  watchSystemTheme: (callback: (isDark: boolean) => void) => () => void
}

const THEME_STORAGE_KEY = 'iip-ui-theme'

let currentConfig: ThemeConfig = {
  mode: 'light',
  namespace: 'iip',
  primaryColor: '#409eff',
  customVars: {}
}

/**
 * 获取系统主题偏好
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * 应用主题到 DOM
 */
function applyTheme(config: ThemeConfig): void {
  if (typeof document === 'undefined') return

  const { mode, namespace, primaryColor, customVars } = config
  const root = document.documentElement

  // 确定实际主题模式
  const actualMode = mode === 'auto' ? getSystemTheme() : mode

  // 设置主题属性
  root.setAttribute('data-theme', actualMode)

  // 设置命名空间
  if (namespace) {
    root.setAttribute('data-namespace', namespace)
  }

  // 设置主色调
  if (primaryColor) {
    root.style.setProperty('--iip-color-primary', primaryColor)
    // 生成主色调的变体
    const primaryVariants = generateColorVariants(primaryColor)
    Object.entries(primaryVariants).forEach(([key, value]) => {
      root.style.setProperty(`--iip-color-primary-${key}`, value)
    })
  }

  // 设置自定义变量
  if (customVars) {
    Object.entries(customVars).forEach(([key, value]) => {
      const varName = key.startsWith('--') ? key : `--${key}`
      root.style.setProperty(varName, value)
    })
  }
}

/**
 * 生成颜色变体
 */
function generateColorVariants(color: string): Record<string, string> {
  // 简化的颜色变体生成，实际项目中可以使用更复杂的颜色算法
  const variants: Record<string, string> = {}

  // 这里可以实现更复杂的颜色变体生成逻辑
  // 暂时返回基础色
  variants['base'] = color

  return variants
}

/**
 * 从存储中加载主题配置
 */
function loadThemeFromStorage(): Partial<ThemeConfig> {
  if (typeof localStorage === 'undefined') return {}

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * 保存主题配置到存储
 */
function saveThemeToStorage(config: ThemeConfig): void {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config))
  } catch {
    // 忽略存储错误
  }
}

/**
 * 创建主题管理器
 */
export function createThemeManager(initialConfig?: Partial<ThemeConfig>): ThemeManager {
  // 合并初始配置
  const storedConfig = loadThemeFromStorage()
  currentConfig = {
    ...currentConfig,
    ...storedConfig,
    ...initialConfig
  }

  // 应用初始主题
  applyTheme(currentConfig)

  return {
    setTheme(config: Partial<ThemeConfig>) {
      currentConfig = { ...currentConfig, ...config }
      applyTheme(currentConfig)
      saveThemeToStorage(currentConfig)
    },

    getTheme() {
      return { ...currentConfig }
    },

    toggleTheme() {
      const newMode = currentConfig.mode === 'light' ? 'dark' : 'light'
      this.setTheme({ mode: newMode })
    },

    setNamespace(namespace: string) {
      this.setTheme({ namespace })
    },

    getNamespace() {
      return currentConfig.namespace || 'iip'
    },

    setPrimaryColor(color: string) {
      this.setTheme({ primaryColor: color })
    },

    setCustomVars(vars: Record<string, string>) {
      this.setTheme({ customVars: { ...currentConfig.customVars, ...vars } })
    },

    watchSystemTheme(callback: (isDark: boolean) => void) {
      if (typeof window === 'undefined') {
        return () => {}
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handler = (e: MediaQueryListEvent) => {
        callback(e.matches)
        // 如果当前是自动模式，更新主题
        if (currentConfig.mode === 'auto') {
          applyTheme(currentConfig)
        }
      }

      mediaQuery.addEventListener('change', handler)

      // 返回取消监听的函数
      return () => {
        mediaQuery.removeEventListener('change', handler)
      }
    }
  }
}

/**
 * 默认主题管理器实例
 */
export const themeManager = createThemeManager()

/**
 * 设置主题
 */
export const setTheme = themeManager.setTheme.bind(themeManager)

/**
 * 获取主题
 */
export const getTheme = themeManager.getTheme.bind(themeManager)

/**
 * 切换主题
 */
export const toggleTheme = themeManager.toggleTheme.bind(themeManager)

/**
 * 设置命名空间
 */
export const setNamespace = themeManager.setNamespace.bind(themeManager)

/**
 * 获取命名空间
 */
export const getNamespace = themeManager.getNamespace.bind(themeManager)

/**
 * 设置主色调
 */
export const setPrimaryColor = themeManager.setPrimaryColor.bind(themeManager)

/**
 * 设置自定义变量
 */
export const setCustomVars = themeManager.setCustomVars.bind(themeManager)

/**
 * 监听系统主题变化
 */
export const watchSystemTheme = themeManager.watchSystemTheme.bind(themeManager)
