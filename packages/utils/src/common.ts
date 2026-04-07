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

/**
 * 从对象中排除指定的 key，返回剩余属性组成的新对象
 * @param obj 源对象
 * @param keys 需要排除的 key 列表
 * @returns 排除指定 key 后的新对象
 * @example
 * omitObject({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { b: 2 }
 */
export function omitObject<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const keysSet = new Set<string | symbol>(keys as (string | symbol)[])
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keysSet.has(k))) as Omit<T, K>
}

/**
 * 从对象中选取指定的 key，返回这些属性组成的新对象
 * @param obj 源对象
 * @param keys 需要保留的 key 列表
 * @returns 只包含指定 key 的新对象
 * @example
 * pickObject({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { a: 1, c: 3 }
 */
export function pickObject<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const keysSet = new Set<string | symbol>(keys as (string | symbol)[])
  return Object.fromEntries(Object.entries(obj).filter(([k]) => keysSet.has(k))) as Pick<T, K>
}

/**
 * 从 URL 中提取文件后缀名，使用浏览器原生 URL API 自动处理查询参数和 hash
 * @param url 文件的完整 URL
 * @returns 大写的后缀名，如 'PDF'、'DOCX'；无法解析时返回空字符串
 * @example
 * getFileSuffix('https://example.com/report.pdf?token=abc') // => 'PDF'
 * getFileSuffix('https://example.com/file/doc.docx')        // => 'DOCX'
 * getFileSuffix('https://example.com/noext')                // => ''
 */
export function getFileSuffix(url: string): string {
  try {
    const { pathname } = new URL(url)
    const ext = pathname.split('.').pop()
    return ext && ext !== pathname ? ext.toUpperCase() : ''
  } catch {
    return ''
  }
}
