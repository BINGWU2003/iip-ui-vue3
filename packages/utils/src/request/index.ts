import { RequestIdentifier, RequestManager, RequestResult } from './types'

/**
 * 创建一个请求管理器，用于处理请求竞态问题
 * @returns 请求管理器对象
 */
export function createRequestManager(): RequestManager {
  // 最新请求的ID
  let latestRequestId = 0

  /**
   * 创建一个新的请求，并返回请求ID和检查函数
   * @returns 包含请求ID和检查函数的对象
   */
  function createRequest(): RequestIdentifier {
    const requestId = ++latestRequestId

    /**
     * 检查当前请求是否是最新的请求
     * @returns 是否是最新请求
     */
    function isLatestRequest(): boolean {
      return requestId === latestRequestId
    }

    return {
      requestId,
      isLatestRequest
    }
  }

  /**
   * 执行一个受控的异步请求，只处理最新请求的响应
   * @param asyncFn 异步请求函数，接收requestId作为参数
   * @param onSuccess 成功回调，仅当是最新请求时调用
   * @param onOutdated 过期请求回调，可选
   * @returns 返回Promise，可用于链式调用或await
   */
  async function managedRequest<T = any, R = any>(
    asyncFn: (requestId: number) => Promise<T>,
    onSuccess?: (data: T) => R,
    onOutdated?: (data: T, requestId: number) => void
  ): Promise<RequestResult<T>> {
    const { requestId, isLatestRequest } = createRequest()

    // 执行异步请求
    return asyncFn(requestId)
      .then(data => {
        if (isLatestRequest()) {
          // 只处理最新请求的响应
          const result = onSuccess?.(data)
          return { data, requestId, isLatest: true, result } as RequestResult<T>
        } else if (onOutdated) {
          // 处理过期请求的响应（可选）
          onOutdated(data, requestId)
        }
        return { data, requestId, isLatest: false } as RequestResult<T>
      })
      .catch(error => {
        if (isLatestRequest()) {
          console.error('请求错误:', error)
          throw error
        }
        return { error, requestId, isLatest: false } as RequestResult<T>
      })
  }

  /**
   * 使用async/await方式处理请求竞态
   * @param fetchFn 获取数据的异步函数
   * @returns 处理过竞态问题的Promise
   */
  async function managedFetch<T = any>(
    fetchFn: (requestId: number) => Promise<T>
  ): Promise<RequestResult<T>> {
    const { requestId, isLatestRequest } = createRequest()

    try {
      // 执行异步请求
      const data = await fetchFn(requestId)

      // 检查是否是最新请求
      if (isLatestRequest()) {
        return { data, requestId, isLatest: true } as RequestResult<T>
      } else {
        return { data, requestId, isLatest: false } as RequestResult<T>
      }
    } catch (error) {
      if (isLatestRequest()) {
        throw error
      }
      return { error: error as Error, requestId, isLatest: false } as RequestResult<T>
    }
  }

  return {
    createRequest,
    managedRequest,
    managedFetch,
    getCurrentId: () => latestRequestId
  }
}

export * from './types'

// 默认导出
export default createRequestManager
