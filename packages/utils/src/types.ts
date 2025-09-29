// 类型工具函数

/**
 * 判断是否为字符串
 */
export const isString = (val: unknown): val is string => typeof val === 'string'

/**
 * 判断是否为数字
 */
export const isNumber = (val: unknown): val is number => typeof val === 'number'

/**
 * 判断是否为布尔值
 */
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'

/**
 * 判断是否为函数
 */
export const isFunction = (val: unknown): val is (...args: any[]) => any =>
  typeof val === 'function'

/**
 * 判断是否为对象
 */
export const isObject = (val: unknown): val is Record<string, any> =>
  val !== null && typeof val === 'object'

/**
 * 判断是否为数组
 */
export const isArray = Array.isArray

/**
 * 判断是否为 undefined
 */
export const isUndefined = (val: unknown): val is undefined => val === undefined

/**
 * 判断是否为 null
 */
export const isNull = (val: unknown): val is null => val === null

/**
 * 判断是否为 null 或 undefined
 */
export const isNullOrUndefined = (val: unknown): val is null | undefined =>
  isNull(val) || isUndefined(val)
