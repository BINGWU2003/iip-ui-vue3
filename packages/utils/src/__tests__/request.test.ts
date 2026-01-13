import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRequestManager } from '../request'

describe('请求管理工具', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('基础功能', () => {
    it('应该创建请求管理器并执行请求', async () => {
      const manager = createRequestManager()
      const mockData = { id: 1, name: 'test' }

      const result = await manager.request(async () => mockData)

      expect(result.data).toEqual(mockData)
      expect(result.isLatest).toBe(true)
      expect(result.requestId).toBe(1)
    })

    it('应该在请求失败时抛出错误', async () => {
      const manager = createRequestManager()

      await expect(
        manager.request(async () => {
          throw new Error('Request failed')
        })
      ).rejects.toThrow('Request failed')
    })
  })

  describe('竞态处理', () => {
    it('应该只处理最新请求的响应', async () => {
      const manager = createRequestManager()

      // 创建三个请求，第三个最快完成
      const promise1 = manager.request(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return 'request1'
      })

      const promise2 = manager.request(async () => {
        await new Promise(resolve => setTimeout(resolve, 300))
        return 'request2'
      })

      const promise3 = manager.request(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return 'request3'
      })

      // 等待所有请求完成
      vi.advanceTimersByTime(50)
      const result3 = await promise3

      vi.advanceTimersByTime(50)
      const result1 = await promise1

      vi.advanceTimersByTime(200)
      const result2 = await promise2

      // 只有最后发起的请求应该被标记为最新
      expect(result3.isLatest).toBe(true)
      expect(result1.isLatest).toBe(false)
      expect(result2.isLatest).toBe(false)

      vi.useRealTimers()
    })

    it('应该忽略过期请求的错误', async () => {
      const manager = createRequestManager()

      const promise1 = manager.request(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        throw new Error('Old request error')
      })

      const promise2 = manager.request(async () => 'success')

      const result2 = await promise2
      expect(result2.isLatest).toBe(true)

      vi.advanceTimersByTime(100)
      const result1 = await promise1
      expect(result1.isLatest).toBe(false)
      expect(result1.error).toBeDefined()

      vi.useRealTimers()
    })
  })

  describe('回调函数', () => {
    it('应该调用 onSuccess 回调', async () => {
      const manager = createRequestManager()
      const onSuccess = vi.fn()
      const mockData = { id: 1 }

      await manager.request(async () => mockData, { onSuccess })

      expect(onSuccess).toHaveBeenCalledWith(mockData)
    })

    it('应该调用 onError 回调并不抛出错误', async () => {
      const manager = createRequestManager()
      const onError = vi.fn()
      const error = new Error('Test error')

      const result = await manager.request(
        async () => {
          throw error
        },
        { onError }
      )

      expect(onError).toHaveBeenCalledWith(error)
      expect(result.error).toBe(error)
    })

    it('应该只对最新请求调用回调', async () => {
      const manager = createRequestManager()
      const onSuccess1 = vi.fn()
      const onSuccess2 = vi.fn()

      const promise1 = manager.request(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 100))
          return 'old'
        },
        { onSuccess: onSuccess1 }
      )

      const promise2 = manager.request(async () => 'new', { onSuccess: onSuccess2 })

      await promise2
      expect(onSuccess2).toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      await promise1
      expect(onSuccess1).not.toHaveBeenCalled()

      vi.useRealTimers()
    })

    it('应该调用 onFinally 回调', async () => {
      const manager = createRequestManager()
      const onFinally = vi.fn()

      await manager.request(async () => 'data', { onFinally })

      expect(onFinally).toHaveBeenCalledTimes(1)
    })
  })

  describe('实际使用场景', () => {
    it('应该正确处理快速搜索场景', async () => {
      const manager = createRequestManager()
      const searchResults: string[] = []

      // 模拟用户快速输入
      const search1 = manager.request(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 100))
          return 'results for "a"'
        },
        { onSuccess: data => searchResults.push(data) }
      )

      const search2 = manager.request(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 50))
          return 'results for "ab"'
        },
        { onSuccess: data => searchResults.push(data) }
      )

      const search3 = manager.request(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 30))
          return 'results for "abc"'
        },
        { onSuccess: data => searchResults.push(data) }
      )

      vi.advanceTimersByTime(30)
      await search3

      vi.advanceTimersByTime(20)
      await search2

      vi.advanceTimersByTime(50)
      await search1

      // 只有最后一次搜索的结果应该被添加
      expect(searchResults).toEqual(['results for "abc"'])

      vi.useRealTimers()
    })
  })
})
