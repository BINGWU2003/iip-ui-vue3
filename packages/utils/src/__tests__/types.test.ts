import { describe, it, expect, vi } from 'vitest'
import {
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isUndefined,
  isNull,
  isNullOrUndefined
} from '../types'

describe('types utils', () => {
  describe('isString', () => {
    it('should return true for string values', () => {
      expect(isString('')).toBe(true)
      expect(isString('hello')).toBe(true)
      expect(isString('123')).toBe(true)
      expect(isString(String('test'))).toBe(true)
    })

    it('should return false for non-string values', () => {
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
    it('should return true for number values', () => {
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

    it('should return false for non-number values', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
      expect(isNumber({})).toBe(false)
      expect(isNumber([])).toBe(false)
      expect(isNumber(() => {})).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('should return true for boolean values', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
      expect(isBoolean(Boolean(1))).toBe(true)
      expect(isBoolean(Boolean(0))).toBe(true)
    })

    it('should return false for non-boolean values', () => {
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
    it('should return true for function values', () => {
      const mockFn = vi.fn()
      expect(isFunction(mockFn)).toBe(true)
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function () {})).toBe(true)
      expect(isFunction(async () => {})).toBe(true)
      expect(isFunction(function* () {})).toBe(true)
      expect(isFunction(Array.isArray)).toBe(true)
      expect(isFunction(console.log)).toBe(true)

      // Arrow function with return value
      expect(
        isFunction(() => {
          return 'function'
        })
      ).toBe(true)
    })

    it('should return false for non-function values', () => {
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
    it('should return true for object values', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ key: 'value' })).toBe(true)
      expect(isObject([])).toBe(true)
      expect(isObject(new Date())).toBe(true)
      expect(isObject(new RegExp(''))).toBe(true)
      expect(isObject(new Error())).toBe(true)
    })

    it('should return false for non-object values', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(() => {})).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for array values', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(['a', 'b', 'c'])).toBe(true)
      expect(isArray(new Array(5))).toBe(true)
      expect(isArray(Array.from({ length: 3 }))).toBe(true)
    })

    it('should return false for non-array values', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('string')).toBe(false)
      expect(isArray(123)).toBe(false)
      expect(isArray(true)).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
      expect(isArray(() => {})).toBe(false)

      // Test with arguments-like object
      function testFunction() {
        // Create an arguments-like object for testing
        const argumentsLike = { 0: 'a', 1: 'b', length: 2 }
        return argumentsLike
      }
      expect(isArray(testFunction())).toBe(false)
    })
  })

  describe('isUndefined', () => {
    it('should return true for undefined values', () => {
      expect(isUndefined(undefined)).toBe(true)
      expect(isUndefined(void 0)).toBe(true)

      let undefinedVar
      expect(isUndefined(undefinedVar)).toBe(true)
    })

    it('should return false for non-undefined values', () => {
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
    it('should return true for null values', () => {
      expect(isNull(null)).toBe(true)
    })

    it('should return false for non-null values', () => {
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
    it('should return true for null or undefined values', () => {
      expect(isNullOrUndefined(null)).toBe(true)
      expect(isNullOrUndefined(undefined)).toBe(true)
      expect(isNullOrUndefined(void 0)).toBe(true)

      let undefinedVar
      expect(isNullOrUndefined(undefinedVar)).toBe(true)
    })

    it('should return false for non-null and non-undefined values', () => {
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
