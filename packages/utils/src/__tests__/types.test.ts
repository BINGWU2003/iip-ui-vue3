import { describe, it, expect, vi } from 'vitest'
import {
  isString,
  isNumber,
  isInteger,
  isNumeric,
  isNumericInteger,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isUndefined,
  isNull,
  isNullOrUndefined
} from '../types'

describe('类型工具函数', () => {
  describe('isString', () => {
    it('应该对字符串值返回 true', () => {
      expect(isString('')).toBe(true)
      expect(isString('hello')).toBe(true)
      expect(isString('123')).toBe(true)
      expect(isString(String('test'))).toBe(true)
    })

    it('应该对非字符串值返回 false', () => {
      expect(isString(123)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
      expect(isString({})).toBe(false)
      expect(isString([])).toBe(false)
      expect(isString(() => {})).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('应该对数字值返回 true', () => {
      expect(isNumber(0)).toBe(true)
      expect(isNumber(123)).toBe(true)
      expect(isNumber(-456)).toBe(true)
      expect(isNumber(3.14)).toBe(true)
      expect(isNumber(Number.MAX_VALUE)).toBe(true)
      expect(isNumber(Number.MIN_VALUE)).toBe(true)
      expect(isNumber(Infinity)).toBe(true)
      expect(isNumber(-Infinity)).toBe(true)
      expect(isNumber(NaN)).toBe(true)
    })

    it('应该对非数字值返回 false', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
      expect(isNumber({})).toBe(false)
      expect(isNumber([])).toBe(false)
      expect(isNumber(() => {})).toBe(false)
    })
  })

  describe('isInteger', () => {
    it('应该对整数值返回 true', () => {
      expect(isInteger(0)).toBe(true)
      expect(isInteger(123)).toBe(true)
      expect(isInteger(-456)).toBe(true)
      expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
      expect(isInteger(Number.MIN_SAFE_INTEGER)).toBe(true)
    })

    it('应该对非整数数字值返回 false', () => {
      expect(isInteger(3.14)).toBe(false)
      expect(isInteger(0.5)).toBe(false)
      expect(isInteger(-0.1)).toBe(false)
      expect(isInteger(Number.MIN_VALUE)).toBe(false)
      expect(isInteger(Infinity)).toBe(false)
      expect(isInteger(-Infinity)).toBe(false)
      expect(isInteger(NaN)).toBe(false)
    })

    it('应该对非数字值返回 false', () => {
      expect(isInteger('123')).toBe(false)
      expect(isInteger('123.45')).toBe(false)
      expect(isInteger(true)).toBe(false)
      expect(isInteger(null)).toBe(false)
      expect(isInteger(undefined)).toBe(false)
      expect(isInteger({})).toBe(false)
      expect(isInteger([])).toBe(false)
      expect(isInteger(() => {})).toBe(false)
    })
  })

  describe('isNumeric', () => {
    it('应该对数字值返回 true', () => {
      expect(isNumeric(0)).toBe(true)
      expect(isNumeric(123)).toBe(true)
      expect(isNumeric(-456)).toBe(true)
      expect(isNumeric(3.14)).toBe(true)
      expect(isNumeric(-0.5)).toBe(true)
      expect(isNumeric(Number.MAX_VALUE)).toBe(true)
      expect(isNumeric(Number.MIN_VALUE)).toBe(true)
      expect(isNumeric(Number.MAX_SAFE_INTEGER)).toBe(true)
      expect(isNumeric(Number.MIN_SAFE_INTEGER)).toBe(true)
    })

    it('应该对数字字符串值返回 true', () => {
      expect(isNumeric('0')).toBe(true)
      expect(isNumeric('123')).toBe(true)
      expect(isNumeric('-456')).toBe(true)
      expect(isNumeric('3.14')).toBe(true)
      expect(isNumeric('-0.5')).toBe(true)
      expect(isNumeric('123.456')).toBe(true)
      expect(isNumeric('+123')).toBe(true)
      expect(isNumeric(' 123 ')).toBe(true) // 带空格
      expect(isNumeric('  456  ')).toBe(true) // 带空格
    })

    it('应该对非数字字符串值返回 false', () => {
      expect(isNumeric('')).toBe(false)
      expect(isNumeric('   ')).toBe(false) // 只有空格
      expect(isNumeric('abc')).toBe(false)
      expect(isNumeric('123abc')).toBe(false)
      expect(isNumeric('abc123')).toBe(false)
      expect(isNumeric('12.34.56')).toBe(false) // 多个小数点
      expect(isNumeric('--123')).toBe(false) // 多个负号
      expect(isNumeric('++123')).toBe(false) // 多个正号
      expect(isNumeric('12-3')).toBe(false) // 中间有负号
    })

    it('应该对 NaN 和 Infinity 返回 false', () => {
      expect(isNumeric(NaN)).toBe(false)
      expect(isNumeric(Infinity)).toBe(false)
      expect(isNumeric(-Infinity)).toBe(false)
      expect(isNumeric('NaN')).toBe(false)
      expect(isNumeric('Infinity')).toBe(false)
      expect(isNumeric('-Infinity')).toBe(false)
    })

    it('应该对非数字和非字符串值返回 false', () => {
      expect(isNumeric(true)).toBe(false)
      expect(isNumeric(false)).toBe(false)
      expect(isNumeric(null)).toBe(false)
      expect(isNumeric(undefined)).toBe(false)
      expect(isNumeric({})).toBe(false)
      expect(isNumeric([])).toBe(false)
      expect(isNumeric(() => {})).toBe(false)
    })
  })

  describe('isNumericInteger', () => {
    it('应该对整数数字值返回 true', () => {
      expect(isNumericInteger(0)).toBe(true)
      expect(isNumericInteger(123)).toBe(true)
      expect(isNumericInteger(-456)).toBe(true)
      expect(isNumericInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
      expect(isNumericInteger(Number.MIN_SAFE_INTEGER)).toBe(true)
    })

    it('应该对非整数数字值返回 false', () => {
      expect(isNumericInteger(3.14)).toBe(false)
      expect(isNumericInteger(0.5)).toBe(false)
      expect(isNumericInteger(-0.1)).toBe(false)
      expect(isNumericInteger(Number.MIN_VALUE)).toBe(false)
      expect(isNumericInteger(Infinity)).toBe(false)
      expect(isNumericInteger(-Infinity)).toBe(false)
      expect(isNumericInteger(NaN)).toBe(false)
    })

    it('应该对整数字符串值返回 true', () => {
      expect(isNumericInteger('0')).toBe(true)
      expect(isNumericInteger('123')).toBe(true)
      expect(isNumericInteger('-456')).toBe(true)
      expect(isNumericInteger('+789')).toBe(true)
      expect(isNumericInteger(' 123 ')).toBe(true) // 带空格
      expect(isNumericInteger('  456  ')).toBe(true) // 带空格
    })

    it('应该对非整数字符串值返回 false', () => {
      expect(isNumericInteger('3.14')).toBe(false)
      expect(isNumericInteger('0.5')).toBe(false)
      expect(isNumericInteger('-0.1')).toBe(false)
      expect(isNumericInteger('123.45')).toBe(false)
      expect(isNumericInteger('12.34.56')).toBe(false) // 多个小数点
    })

    it('应该对非数字字符串值返回 false', () => {
      expect(isNumericInteger('')).toBe(false)
      expect(isNumericInteger('   ')).toBe(false) // 只有空格
      expect(isNumericInteger('abc')).toBe(false)
      expect(isNumericInteger('123abc')).toBe(false)
      expect(isNumericInteger('abc123')).toBe(false)
      expect(isNumericInteger('--123')).toBe(false) // 多个负号
      expect(isNumericInteger('++123')).toBe(false) // 多个正号
      expect(isNumericInteger('12-3')).toBe(false) // 中间有负号
      expect(isNumericInteger('NaN')).toBe(false)
      expect(isNumericInteger('Infinity')).toBe(false)
      expect(isNumericInteger('-Infinity')).toBe(false)
    })

    it('应该对非数字和非字符串值返回 false', () => {
      expect(isNumericInteger(true)).toBe(false)
      expect(isNumericInteger(false)).toBe(false)
      expect(isNumericInteger(null)).toBe(false)
      expect(isNumericInteger(undefined)).toBe(false)
      expect(isNumericInteger({})).toBe(false)
      expect(isNumericInteger([])).toBe(false)
      expect(isNumericInteger(() => {})).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('应该对布尔值返回 true', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
      expect(isBoolean(Boolean(1))).toBe(true)
      expect(isBoolean(Boolean(0))).toBe(true)
    })

    it('应该对非布尔值返回 false', () => {
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean(0)).toBe(false)
      expect(isBoolean('true')).toBe(false)
      expect(isBoolean('false')).toBe(false)
      expect(isBoolean(null)).toBe(false)
      expect(isBoolean(undefined)).toBe(false)
      expect(isBoolean({})).toBe(false)
      expect(isBoolean([])).toBe(false)
      expect(isBoolean(() => {})).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('应该对函数值返回 true', () => {
      const mockFn = vi.fn()
      expect(isFunction(mockFn)).toBe(true)
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function () {})).toBe(true)
      expect(isFunction(async () => {})).toBe(true)
      expect(isFunction(function* () {})).toBe(true)
      expect(isFunction(Array.isArray)).toBe(true)
      expect(isFunction(console.log)).toBe(true)

      // 带返回值的箭头函数
      expect(
        isFunction(() => {
          return 'function'
        })
      ).toBe(true)
    })

    it('应该对非函数值返回 false', () => {
      expect(isFunction('string')).toBe(false)
      expect(isFunction(123)).toBe(false)
      expect(isFunction(true)).toBe(false)
      expect(isFunction(null)).toBe(false)
      expect(isFunction(undefined)).toBe(false)
      expect(isFunction({})).toBe(false)
      expect(isFunction([])).toBe(false)
      expect(isFunction(/regex/)).toBe(false)
    })
  })

  describe('isObject', () => {
    it('应该对对象值返回 true', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ key: 'value' })).toBe(true)
      expect(isObject([])).toBe(true)
      expect(isObject(new Date())).toBe(true)
      expect(isObject(new RegExp(''))).toBe(true)
      expect(isObject(new Error())).toBe(true)
    })

    it('应该对非对象值返回 false', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(() => {})).toBe(false)
    })
  })

  describe('isArray', () => {
    it('应该对数组值返回 true', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(['a', 'b', 'c'])).toBe(true)
      expect(isArray(new Array(5))).toBe(true)
      expect(isArray(Array.from({ length: 3 }))).toBe(true)
    })

    it('应该对非数组值返回 false', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('string')).toBe(false)
      expect(isArray(123)).toBe(false)
      expect(isArray(true)).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
      expect(isArray(() => {})).toBe(false)

      // 测试类似 arguments 的对象
      function testFunction() {
        // 创建一个类似 arguments 的对象用于测试
        const argumentsLike = { 0: 'a', 1: 'b', length: 2 }
        return argumentsLike
      }
      expect(isArray(testFunction())).toBe(false)
    })
  })

  describe('isUndefined', () => {
    it('应该对 undefined 值返回 true', () => {
      expect(isUndefined(undefined)).toBe(true)
      expect(isUndefined(void 0)).toBe(true)

      let undefinedVar
      expect(isUndefined(undefinedVar)).toBe(true)
    })

    it('应该对非 undefined 值返回 false', () => {
      expect(isUndefined(null)).toBe(false)
      expect(isUndefined('')).toBe(false)
      expect(isUndefined(0)).toBe(false)
      expect(isUndefined(false)).toBe(false)
      expect(isUndefined({})).toBe(false)
      expect(isUndefined([])).toBe(false)
      expect(isUndefined(() => {})).toBe(false)
      expect(isUndefined('undefined')).toBe(false)
    })
  })

  describe('isNull', () => {
    it('应该对 null 值返回 true', () => {
      expect(isNull(null)).toBe(true)
    })

    it('应该对非 null 值返回 false', () => {
      expect(isNull(undefined)).toBe(false)
      expect(isNull('')).toBe(false)
      expect(isNull(0)).toBe(false)
      expect(isNull(false)).toBe(false)
      expect(isNull({})).toBe(false)
      expect(isNull([])).toBe(false)
      expect(isNull(() => {})).toBe(false)
      expect(isNull('null')).toBe(false)
    })
  })

  describe('isNullOrUndefined', () => {
    it('应该对 null 或 undefined 值返回 true', () => {
      expect(isNullOrUndefined(null)).toBe(true)
      expect(isNullOrUndefined(undefined)).toBe(true)
      expect(isNullOrUndefined(void 0)).toBe(true)

      let undefinedVar
      expect(isNullOrUndefined(undefinedVar)).toBe(true)
    })

    it('应该对非 null 和非 undefined 值返回 false', () => {
      expect(isNullOrUndefined('')).toBe(false)
      expect(isNullOrUndefined(0)).toBe(false)
      expect(isNullOrUndefined(false)).toBe(false)
      expect(isNullOrUndefined({})).toBe(false)
      expect(isNullOrUndefined([])).toBe(false)
      expect(isNullOrUndefined(() => {})).toBe(false)
      expect(isNullOrUndefined('null')).toBe(false)
      expect(isNullOrUndefined('undefined')).toBe(false)
    })
  })
})
