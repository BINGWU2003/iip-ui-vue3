import { StorageOptions } from './types'

/**
 * 存储相关工具函数
 * 封装 uni.setStorage 等 API，提供统一的错误处理
 */

/**
 * 设置缓存
 * @param key 键名
 * @param data 数据
 * @param options 选项
 */
export function setStorage(key: string, data: any, options?: StorageOptions): void {
  try {
    const finalKey = options?.prefix ? `${options.prefix}_${key}` : key
    uni.setStorageSync(finalKey, data)
  } catch (e) {
    console.error('setStorage error:', e)
  }
}

/**
 * 获取缓存
 * @param key 键名
 * @param options 选项
 * @returns 数据
 */
export function getStorage<T = any>(key: string, options?: StorageOptions): T | null {
  try {
    const finalKey = options?.prefix ? `${options.prefix}_${key}` : key
    const result = uni.getStorageSync(finalKey)
    return result as T
  } catch (e) {
    console.error('getStorage error:', e)
    return null
  }
}

/**
 * 移除缓存
 * @param key 键名
 * @param options 选项
 */
export function removeStorage(key: string, options?: StorageOptions): void {
  try {
    const finalKey = options?.prefix ? `${options.prefix}_${key}` : key
    uni.removeStorageSync(finalKey)
  } catch (e) {
    console.error('removeStorage error:', e)
  }
}

/**
 * 清除所有缓存
 */
export function clearStorage(): void {
  try {
    uni.clearStorageSync()
  } catch (e) {
    console.error('clearStorage error:', e)
  }
}
