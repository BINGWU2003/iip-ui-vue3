import { describe, it, expect, vi } from 'vitest'
import {
  debounce,
  throttle,
  deepClone,
  generateId,
  omitObject,
  pickObject,
  getFileSuffix
} from '../common'

describe('通用工具函数', () => {
  describe('debounce', () => {
    it('应该对函数调用进行防抖处理', async () => {
      vi.useFakeTimers()

      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      // 快速调用多次
      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')

      // 函数还没有被调用
      expect(fn).not.toHaveBeenCalled()

      // 快进时间
      vi.advanceTimersByTime(100)

      // 函数应该只被调用一次，使用最后的参数
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('arg3')

      vi.useRealTimers()
    })

    it('应该支持立即执行模式', async () => {
      vi.useFakeTimers()

      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100, true)

      debouncedFn('arg1')

      // 立即执行模式下，函数应该立即被调用
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('arg1')

      vi.useRealTimers()
    })
  })

  describe('throttle', () => {
    it('应该对函数调用进行节流处理', async () => {
      vi.useFakeTimers()

      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      // 第一次调用应该立即执行
      throttledFn('arg1')
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('arg1')

      // 在节流期间的调用应该被忽略
      throttledFn('arg2')
      throttledFn('arg3')
      expect(fn).toHaveBeenCalledTimes(1)

      // 快进时间
      vi.advanceTimersByTime(100)

      // 现在可以再次调用
      throttledFn('arg4')
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith('arg4')

      vi.useRealTimers()
    })
  })

  describe('deepClone', () => {
    it('应该克隆原始值', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('hello')).toBe('hello')
      expect(deepClone(true)).toBe(true)
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('应该克隆数组', () => {
      const original = [1, 2, [3, 4]]
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned[2]).not.toBe(original[2])
    })

    it('应该克隆对象', () => {
      const original = {
        a: 1,
        b: 'hello',
        c: {
          d: 2,
          e: [1, 2, 3]
        }
      }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.c).not.toBe(original.c)
      expect(cloned.c.e).not.toBe(original.c.e)
    })

    it('应该克隆日期对象', () => {
      const original = new Date('2023-01-01')
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned instanceof Date).toBe(true)
    })
  })

  describe('generateId', () => {
    it('应该生成唯一的 ID', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^id-[a-z0-9]+$/)
      expect(id2).toMatch(/^id-[a-z0-9]+$/)
    })

    it('应该使用自定义前缀', () => {
      const id = generateId('custom')
      expect(id).toMatch(/^custom-[a-z0-9]+$/)
    })

    it('应该生成固定长度的 ID', () => {
      const id1 = generateId()
      const id2 = generateId()

      // ID 应该有一致的格式：prefix-9位字符
      expect(id1.split('-')[1]).toHaveLength(9)
      expect(id2.split('-')[1]).toHaveLength(9)
    })
  })

  describe('omitObject', () => {
    it('应该排除指定的单个 key', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = omitObject(obj, ['a'])
      expect(result).toEqual({ b: 2, c: 3 })
      expect('a' in result).toBe(false)
    })

    it('应该排除指定的多个 key', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = omitObject(obj, ['a', 'c'])
      expect(result).toEqual({ b: 2 })
    })

    it('排除不存在的 key 时应返回原对象的浅拷贝', () => {
      const obj = { a: 1, b: 2 }
      // @ts-expect-error 故意传入不存在的 key 以测试运行时行为
      const result = omitObject(obj, ['z'])
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it('keys 为空数组时应返回包含所有属性的新对象', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = omitObject(obj, [])
      expect(result).toEqual(obj)
      expect(result).not.toBe(obj)
    })

    it('排除所有 key 时应返回空对象', () => {
      const obj = { a: 1, b: 2 }
      const result = omitObject(obj, ['a', 'b'])
      expect(result).toEqual({})
    })

    it('不应修改原对象', () => {
      const obj = { a: 1, b: 2, c: 3 }
      omitObject(obj, ['a'])
      expect(obj).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('应支持值为 undefined / null / false / 0 的属性', () => {
      const obj = { a: undefined, b: null, c: false, d: 0, e: 'keep' }
      const result = omitObject(obj, ['a'])
      expect(result).toEqual({ b: null, c: false, d: 0, e: 'keep' })
    })

    it('应保留嵌套对象的引用（浅拷贝语义）', () => {
      const nested = { x: 1 }
      const obj = { a: nested, b: 2 }
      const result = omitObject(obj, ['b'])
      expect(result.a).toBe(nested)
    })
  })

  describe('pickObject', () => {
    it('应该只保留指定的单个 key', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = pickObject(obj, ['a'])
      expect(result).toEqual({ a: 1 })
      expect('b' in result).toBe(false)
      expect('c' in result).toBe(false)
    })

    it('应该只保留指定的多个 key', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = pickObject(obj, ['a', 'c'])
      expect(result).toEqual({ a: 1, c: 3 })
    })

    it('pick 不存在的 key 时结果中不应出现该 key', () => {
      const obj = { a: 1, b: 2 }
      // @ts-expect-error 故意传入不存在的 key 以测试运行时行为
      const result = pickObject(obj, ['z'])
      expect(result).toEqual({})
    })

    it('keys 为空数组时应返回空对象', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = pickObject(obj, [])
      expect(result).toEqual({})
    })

    it('pick 所有 key 时应返回包含所有属性的新对象', () => {
      const obj = { a: 1, b: 2 }
      const result = pickObject(obj, ['a', 'b'])
      expect(result).toEqual(obj)
      expect(result).not.toBe(obj)
    })

    it('不应修改原对象', () => {
      const obj = { a: 1, b: 2, c: 3 }
      pickObject(obj, ['a'])
      expect(obj).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('应支持值为 undefined / null / false / 0 的属性', () => {
      const obj = { a: undefined, b: null, c: false, d: 0, e: 'skip' }
      const result = pickObject(obj, ['b', 'c', 'd'])
      expect(result).toEqual({ b: null, c: false, d: 0 })
    })

    it('应保留嵌套对象的引用（浅拷贝语义）', () => {
      const nested = { x: 1 }
      const obj = { a: nested, b: 2 }
      const result = pickObject(obj, ['a'])
      expect(result.a).toBe(nested)
    })

    it('omitObject 与 pickObject 的结果应互补', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 }
      const keys = ['a', 'c'] as const
      const picked = pickObject(obj, [...keys])
      const omitted = omitObject(obj, [...keys])
      // pick + omit 合并后应等于原对象
      expect({ ...picked, ...omitted }).toEqual(obj)
    })
  })

  describe('getFileSuffix', () => {
    it('应该正确提取带有查询参数的URL的文件后缀名并转换为大写', () => {
      expect(getFileSuffix('https://example.com/report.pdf?token=abc')).toBe('PDF')
    })

    it('应该正确提取普通URL的文件后缀名并转换为大写', () => {
      expect(getFileSuffix('https://example.com/file/doc.docx')).toBe('DOCX')
    })

    it('如果URL中没有文件后缀名，应该返回空字符串', () => {
      expect(getFileSuffix('https://example.com/noext')).toBe('')
    })

    it('对于无效的URL，应该捕获异常并返回空字符串', () => {
      expect(getFileSuffix('not-a-valid-url')).toBe('')
    })

    it('应该正确处理末尾带有点的特殊情况', () => {
      expect(getFileSuffix('https://example.com/file/bad.')).toBe('')
    })
  })
})
