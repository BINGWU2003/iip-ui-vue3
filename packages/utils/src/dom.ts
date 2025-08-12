// DOM 操作工具函数

/**
 * 判断是否为浏览器环境
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * 获取元素的样式
 */
export function getStyle(element: HTMLElement, styleName: string): string {
  if (!isBrowser || !element || !styleName) return ''

  const style = window.getComputedStyle(element)
  return style.getPropertyValue(styleName) || ''
}

/**
 * 添加类名
 */
export function addClass(element: HTMLElement, className: string): void {
  if (!element || !className) return
  element.classList.add(className)
}

/**
 * 移除类名
 */
export function removeClass(element: HTMLElement, className: string): void {
  if (!element || !className) return
  element.classList.remove(className)
}

/**
 * 切换类名
 */
export function toggleClass(element: HTMLElement, className: string): void {
  if (!element || !className) return
  element.classList.toggle(className)
}

/**
 * 判断是否包含类名
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  if (!element || !className) return false
  return element.classList.contains(className)
}

/**
 * 获取元素的位置信息
 */
export function getElementPosition(element: HTMLElement) {
  if (!element) return { top: 0, left: 0, width: 0, height: 0 }

  const rect = element.getBoundingClientRect()
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height
  }
}
