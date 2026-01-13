import { describe, it, expect, vi } from 'vitest'
import { debounce, throttle, deepClone, generateId } from '../common'

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
})
