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
 * 判断是否为整数
 */
export const isInteger = (val: unknown): val is number => isNumber(val) && Number.isInteger(val)

/**
 * 判断是否为数字（支持 number 类型和数字字符串）
 * @param val 待检查的值
 * @returns 如果是 number 类型或可转换为数字的字符串，返回 true；否则返回 false
 * @example
 * isNumeric(123) // true
 * isNumeric('123') // true
 * isNumeric('123.45') // true
 * isNumeric('-123') // true
 * isNumeric('abc') // false
 * isNumeric('') // false
 * isNumeric('  ') // false
 * isNumeric(Infinity) // false
 * isNumeric(NaN) // false
 */
export const isNumeric = (val: unknown): boolean => {
  // 如果是 number 类型
  if (isNumber(val)) {
    // 排除 NaN、Infinity 和 -Infinity
    if (Number.isNaN(val) || !Number.isFinite(val)) {
      return false
    }
    return true
  }

  // 如果是 string 类型
  if (isString(val)) {
    const trimmed = val.trim()
    // 空字符串或只有空格，返回 false
    if (trimmed === '') {
      return false
    }
    // 尝试转换为数字
    const num = Number(trimmed)
    // 如果转换成功且是有限数字，返回 true
    return !Number.isNaN(num) && Number.isFinite(num)
  }

  return false
}

/**
 * 判断是否为整数（支持 number 类型和数字字符串）
 * @param val 待检查的值
 * @returns 如果是整数（number 类型或整数字符串），返回 true；否则返回 false
 * @example
 * isNumericInteger(123) // true
 * isNumericInteger('123') // true
 * isNumericInteger('-456') // true
 * isNumericInteger('123.45') // false
 * isNumericInteger(3.14) // false
 * isNumericInteger('abc') // false
 * isNumericInteger('') // false
 * isNumericInteger(Infinity) // false
 * isNumericInteger(NaN) // false
 */
export const isNumericInteger = (val: unknown): boolean => {
  // 如果是 number 类型
  if (isNumber(val)) {
    // 排除 NaN、Infinity 和 -Infinity
    if (Number.isNaN(val) || !Number.isFinite(val)) {
      return false
    }
    // 检查是否为整数
    return Number.isInteger(val)
  }

  // 如果是 string 类型
  if (isString(val)) {
    const trimmed = val.trim()
    // 空字符串或只有空格，返回 false
    if (trimmed === '') {
      return false
    }
    // 尝试转换为数字
    const num = Number(trimmed)
    // 如果转换成功且是有限整数，返回 true
    return !Number.isNaN(num) && Number.isFinite(num) && Number.isInteger(num)
  }

  return false
}

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
