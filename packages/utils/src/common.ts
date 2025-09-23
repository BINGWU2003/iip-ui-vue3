// 通用工具函数

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * 生成唯一ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * 降级复制方法（兼容旧浏览器）
 */
export async function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // 避免在页面上显示
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  textArea.style.opacity = '0'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand
  const successful = document.execCommand('copy')
  document.body.removeChild(textArea)
  return new Promise((resolve, reject) => {
    if (!successful) {
      reject(new Error('复制失败，请手动复制'))
    } else {
      resolve('复制成功')
    }
  })
}

/**
 * 复制方法（兼容旧浏览器）
 */
export async function copyText(text: string) {
  if (!text) {
    throw new Error('text is required')
  }
  if (typeof text !== 'string') {
    throw new Error('text must be a string')
  }
  // 优先使用现代的 Clipboard API
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/isSecureContext
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
  } else {
    // 降级到传统的复制方法（兼容旧浏览器）
    await fallbackCopyTextToClipboard(text)
  }
}
