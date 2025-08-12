import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createThemeManager, setTheme, getTheme, toggleTheme } from '../theme'

// Mock DOM
const mockDocument = {
  documentElement: {
    setAttribute: vi.fn(),
    style: {
      setProperty: vi.fn()
    }
  }
}

const mockWindow = {
  matchMedia: vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }))
}

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn()
}

// 设置全局 mocks
Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true
})

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true
})

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

describe('theme utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
    // 重置主题状态
    setTheme({ mode: 'light', namespace: 'iip', primaryColor: '#409eff' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('createThemeManager', () => {
    it('should create theme manager with default config', () => {
      const manager = createThemeManager()
      const theme = manager.getTheme()

      expect(theme.mode).toBe('light')
      expect(theme.namespace).toBe('iip')
      expect(theme.primaryColor).toBe('#409eff')
    })

    it('should create theme manager with custom config', () => {
      const customConfig = {
        mode: 'dark' as const,
        namespace: 'custom',
        primaryColor: '#ff0000'
      }

      const manager = createThemeManager(customConfig)
      const theme = manager.getTheme()

      expect(theme.mode).toBe('dark')
      expect(theme.namespace).toBe('custom')
      expect(theme.primaryColor).toBe('#ff0000')
    })

    it('should apply theme to DOM on creation', () => {
      createThemeManager({ mode: 'dark' })

      expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
    })
  })

  describe('setTheme', () => {
    it('should update theme configuration', () => {
      setTheme({ mode: 'dark' })
      const theme = getTheme()

      expect(theme.mode).toBe('dark')
    })

    it('should apply theme to DOM', () => {
      setTheme({
        mode: 'dark',
        namespace: 'test',
        primaryColor: '#ff0000'
      })

      expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
      expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
        'data-namespace',
        'test'
      )
      expect(mockDocument.documentElement.style.setProperty).toHaveBeenCalledWith(
        '--iip-color-primary',
        '#ff0000'
      )
    })

    it('should save theme to localStorage', () => {
      setTheme({ mode: 'dark' })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'iip-ui-theme',
        expect.stringContaining('"mode":"dark"')
      )
    })
  })

  describe('toggleTheme', () => {
    it('should toggle between light and dark modes', () => {
      // 先设置为 light 确保初始状态
      setTheme({ mode: 'light' })
      expect(getTheme().mode).toBe('light')

      // 切换到 dark
      toggleTheme()
      expect(getTheme().mode).toBe('dark')

      // 切换回 light
      toggleTheme()
      expect(getTheme().mode).toBe('light')
    })
  })

  describe('auto theme mode', () => {
    it('should use system theme when mode is auto', () => {
      // Mock 系统偏好为暗色
      mockWindow.matchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      })

      setTheme({ mode: 'auto' })

      expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
    })

    it('should watch system theme changes', () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      mockWindow.matchMedia.mockReturnValue(mockMediaQuery)

      const manager = createThemeManager()
      const callback = vi.fn()

      const unwatch = manager.watchSystemTheme(callback)

      expect(mockWindow.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

      // 测试取消监听
      unwatch()
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      )
    })
  })

  describe('custom variables', () => {
    it('should set custom CSS variables', () => {
      setTheme({
        customVars: {
          '--custom-color': '#123456',
          'another-var': '#654321'
        }
      })

      expect(mockDocument.documentElement.style.setProperty).toHaveBeenCalledWith(
        '--custom-color',
        '#123456'
      )
      expect(mockDocument.documentElement.style.setProperty).toHaveBeenCalledWith(
        '--another-var',
        '#654321'
      )
    })
  })

  describe('localStorage integration', () => {
    it('should load theme from localStorage on creation', () => {
      const storedTheme = JSON.stringify({
        mode: 'dark',
        namespace: 'stored',
        primaryColor: '#stored-color'
      })

      mockLocalStorage.getItem.mockReturnValue(storedTheme)

      const manager = createThemeManager()
      const theme = manager.getTheme()

      expect(theme.mode).toBe('dark')
      expect(theme.namespace).toBe('stored')
      expect(theme.primaryColor).toBe('#stored-color')
    })

    it('should handle invalid localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json')

      // 应该不抛出错误，使用默认配置
      expect(() => createThemeManager()).not.toThrow()

      // 创建新的管理器实例来测试
      const manager = createThemeManager()
      const theme = manager.getTheme()
      expect(theme.mode).toBe('light')
    })
  })

  describe('namespace management', () => {
    it('should set and get namespace', () => {
      const manager = createThemeManager()

      manager.setNamespace('custom-namespace')
      expect(manager.getNamespace()).toBe('custom-namespace')

      expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
        'data-namespace',
        'custom-namespace'
      )
    })
  })

  describe('primary color management', () => {
    it('should set primary color', () => {
      const manager = createThemeManager()

      manager.setPrimaryColor('#ff0000')

      expect(mockDocument.documentElement.style.setProperty).toHaveBeenCalledWith(
        '--iip-color-primary',
        '#ff0000'
      )
      expect(manager.getTheme().primaryColor).toBe('#ff0000')
    })
  })
})
